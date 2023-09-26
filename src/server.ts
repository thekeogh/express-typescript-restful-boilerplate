import { dirname } from "path";
import { fileURLToPath } from "url";

import * as Sentry from "@sentry/node";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { glob } from "glob";
import lusca from "lusca";

import { router } from "@src/router.js";

import { config, exception, utils } from "@core/index.js";

import { log } from "@logger";

/**
 * Setup some shared variables.
 */
const useSentry = !!config.api.logging.sentry.dsn;

/**
 * Sets up the core configuration for Express.
 */
const api = express();
api.disable("x-powered-by");

/**
 * Configures the request payloads for Express.
 *
 * @remarks
 * Although body-parser is built into Express nowadays, it still needs to be initialised separately. This function sets
 * up the middleware for parsing JSON and URL-encoded request bodies.
 */
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

/**
 * Set up the Lusca middleware configuration.
 *
 * @see {@link https://github.com/krakenjs/lusca | Lusca GitHub repository}
 */
api.use(lusca.xframe("SAMEORIGIN"));
api.use(lusca.xssProtection(true));
api.use(lusca.nosniff());

/**
 * Initialise Morgan the HTTP request logger.
 *
 * @see {@link https://github.com/expressjs/morgan | Morgan GitHub repository}
 */
api.use(utils.api.logger);

/**
 * Enable cross-origin resource sharing (CORS) middleware.
 *
 * @see {@link https://github.com/expressjs/cors | CORS GitHub repository}
 */
api.use(
  cors({
    preflightContinue: false,
    credentials: true,
  })
);

/**
 * Add some HTTP headers for all responses in the API.
 */
api.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  return next();
});

/**
 * Initialise Sentry error logging.
 *
 * @remarks
 * To disable Sentry error logging, leave the LOGGING_SENTRY_DSN environment variable empty.
 */
if (useSentry) {
  Sentry.init({
    dsn: config.api.logging.sentry.dsn,
    environment: config.api.environment.env,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Sentry.Integrations.Express({ app: api })],
    tracesSampleRate: config.api.environment.env === "production" ? 0.1 : 1.0,
  });
  api.use(Sentry.Handlers.requestHandler());
  api.use(Sentry.Handlers.tracingHandler());
}

/**
 * Set up a basic health check endpoint for ELB (Elastic Load Balancer).
 *
 * @remarks
 * This endpoint responds with an empty response to indicate the api's health status.
 */
api.get("/health-check", (req, res) => res.end());

/**
 * Register root endpoints.
 *
 * @remarks
 * This endpoint serves no specific purpose other than preventing unwanted errors and logs. It returns a successful
 * response with no content. This covers the root and prefixed route of all methods.
 */
api.all([""], (req, res) => res.status(204).end());

/**
 * Register routes for the API
 *
 * @remarks
 * Scans the resources for all controllers and uses the route decorator to attach the controller's route to the Express
 * router. The decorators will link the route, and we assign it to the Express instance at this point.
 */
const controllerPattern = "/resources/**/*.controller.?(ts|js)";
const controllers = glob.sync(dirname(fileURLToPath(import.meta.url)) + controllerPattern);
if (controllers.length === 0) {
  log.warn(`No controllers found. Looking in '${controllerPattern}'`);
}
await Promise.all(controllers.map((file) => import(file)));
api.use(router);

/*
|----------------------------------------------------------------------------------------------------------------------
| Error handling
|----------------------------------------------------------------------------------------------------------------------
|
| Sets up Express error handling to capture and handle errors. These functions configure Express to handle errors via
| middleware. All errors occurring within the api will be captured and processed accordingly.
|
|----------------------------------------------------------------------------------------------------------------------
*/

/**
 * Manages 404 file not found errors.
 *
 * @remarks
 * When a route reaches this middleware, it indicates that the requested path has not been registered in the api.
 * In such instances, a 404 File Not Found error is generated and returned.
 */
api.use((req, res, next) => {
  return next(exception.NotFound(`Cannot find ${req.originalUrl}`));
});

/**
 * Catches and manages all other errors (catchall).
 *
 * @remarks
 * This middleware captures any errors that occur during the processing of requests. These errors can include both
 * known errors and unhandled exceptions originating from Express or its dependencies. The primary purpose of this
 * middleware is to capture and handle errors, ensuring that known errors (errors.Exception) are prepared as responses
 * for the subsequent middleware in the pipeline.
 */
api.use((error: exception.HttpError | Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof exception.HttpError) {
    return next(error);
  }
  const customError = error as { status?: number; statusCode?: number; code?: number };
  const status = customError.status || customError.statusCode || customError.code || 500;
  const message = error.message || "Oops! Something went wrong.";
  return next(exception(status, message));
});

/**
 * Handles error responses.
 *
 * @remarks
 * This middleware is responsible for crafting and sending a response that includes the provided error. It assumes that
 * the error is an instance of 'HttpError'. Error logging occurs only if the HTTP status code is not found in the
 * ignored list.
 */
api.use((error: exception.HttpError, req: Request, res: Response, next: NextFunction) => {
  if (!config.api.logging.api.ignore.codes.includes(error.status)) {
    // Log to Sentry
    if (useSentry) {
      const user = req.auth;
      if (user) {
        Sentry.setUser(user);
      }
      Sentry.captureException(error);
    }
    // Log with Pino
    log.fatal(error, error.message);
  }
  // Return the error to the client
  return res.status(error.status).send({
    name: error.name,
    status: error.status,
    message: error.message,
  });
});

/**
 * Return the server instance.
 */
export { api };
