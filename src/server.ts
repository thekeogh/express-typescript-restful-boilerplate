import { dirname } from "path";
import { fileURLToPath } from "url";

import chalk from "chalk";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { glob } from "glob";
import lusca from "lusca";

import { router } from "@src/router.js";

import { config, errors, utils } from "@core/index.js";

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
 * Enable Cross-Origin Resource Sharing (CORS) middleware.
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
 * Add some HTTP headers for all responses in the api.
 */
api.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Billing-Service-Environment", config.api.environment.env);
  return next();
});

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
 * Register Routes for the API
 *
 * @remarks
 * Scans the resources for all controllers and uses the route decorator to attach the controller's route to the Express
 * router. The decorators will link the route, and we assign it to the Express instance at this point.
 */
const controllerPattern = "/resources/**/*.controller.?(ts|js)";
const controllers = glob.sync(dirname(fileURLToPath(import.meta.url)) + controllerPattern);
if (controllers.length === 0) {
  utils.api.log(`  ${chalk.bgYellow.hex("#000000").bold(" ⚠ ")}
  ${chalk.dim.white.bold(`No controllers found. Looking in '${controllerPattern}'`)}`);
}
await Promise.all(controllers.map((file) => import(file)));
api.use(router);

/*
|----------------------------------------------------------------------------------------------------------------------
| Error Handling
|----------------------------------------------------------------------------------------------------------------------
|
| Sets up Express error handling to capture and handle errors. These functions configure Express to handle errors via
| middleware. All errors occurring within the api will be captured and processed accordingly.
|
|----------------------------------------------------------------------------------------------------------------------
*/

/**
 * Manages 404 File Not Found Errors.
 *
 * @remarks
 * When a route reaches this middleware, it indicates that the requested path has not been registered in the api.
 * In such instances, a 404 File Not Found error is generated and returned.
 */
api.use((req, res, next) => {
  return next(errors.notFound(`Cannot find ${req.originalUrl}`));
});

/**
 * Catches and Manages All Other Errors (Catchall).
 *
 * @remarks
 * This middleware captures any errors that occur during the processing of requests. These errors can include both
 * known errors and unhandled exceptions originating from Express or its dependencies. The primary purpose of this
 * middleware is to capture and handle errors, ensuring that known errors (errors.Exception) are prepared as responses
 * for the subsequent middleware in the pipeline.
 */
api.use((error: errors.Exception | Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof errors.Exception) {
    return next(error);
  }
  const customError = error as { status?: number; statusCode?: number; code?: number };
  const status = customError.status || customError.statusCode || customError.code || 500;
  const name = error.name || "InternalServerError";
  const message = error.message || "Oops! Something went wrong.";
  return next(new errors.Exception(/^(?!0\d)\d{1,2}$|^(?!6\d\d)\d{1,3}$/.test(status.toString()) ? status : 500, message, error, name));
});

/**
 * Manages Error Responses.
 *
 * @remarks
 * This middleware is in charge of sending a response containing the provided error. It assumes that the error instance
 * is of the custom 'Exception' class and that all the necessary properties have been correctly configured. In
 * development settings, we will additionally display the error in the terminal using the "pretty-error" package.
 */
api.use((error: errors.Exception, req: Request, res: Response, next: NextFunction) => {
  utils.api.pretty(error);
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
