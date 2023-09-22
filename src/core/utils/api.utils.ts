import chalk from "chalk";
import { Request, Response } from "express";
import morgan, { TokenIndexer } from "morgan";
import PrettyError from "pretty-error";
import strip from "strip-ansi";

import { config, errors } from "@core/index.js";

/**
 * Strip ANSI characters from a given message and output.
 *
 * @param message - The message to output to STDOUT.
 *
 * @remarks
 * This function takes a message that may or may not contain ANSI characters and removes all ANSI formatting. It's
 * particularly useful in environments, like DataDog, where ANSI characters can introduce unwanted noise. If no ANSI
 * characters are found in the message, it is returned unchanged.
 */
export function log(message: string): void {
  if (config.api.environment.env === "test") {
    return;
  }
  if (config.api.environment.env !== "development") {
    message = strip(message).trim();
  }
  return console.log(message);
}

/**
 * Returns the correct URL for the service based on the configuration and environment variables.
 *
 * @remarks
 * The URL is determined by the configuration and environment variables set. If SSL certificate and key environment
 * variables are present, the URL starts with "https://". Otherwise, it starts with "http://". The host is obtained
 * from the configuration, defaulting to "localhost" if not specified. If a port is specified in the configuration, it
 * is included in the URL.
 */
export function url(): string {
  const protocol = process.env.SSL_CERT && process.env.SSL_KEY ? "https://" : "http://";
  const host = config.api.environment.host || "localhost";
  const port = config.api.environment.port ? `:${config.api.environment.port}` : "";
  return `${protocol}${host}${port}`;
}

/**
 * Set up the HTTP request logger using Morgan middleware.
 *
 * @see {@link https://github.com/expressjs/morgan | Morgan GitHub repository}
 */
export const logger = morgan(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response): string | undefined => {
    if (config.api.environment.env !== "development") {
      return;
    }
    const code = tokens.status(req, res);
    let status = chalk.green.bold(code);
    if (code && parseInt(code, 10) >= 300) {
      status = chalk.bgRed.white.bold(` ${code} `);
    }
    if (code === "404") {
      status = chalk.red.bold(`${code}`);
    }
    return [chalk.green.dim(tokens.date(req, res)), chalk.bold(tokens.method(req, res)), tokens.url(req, res), status].join(" ");
  },
  { skip: (req) => req.method === "OPTIONS" }
);

/**
 * Prettifies an error object using Pretty Error and returns it.
 *
 * @param error - The error object to be prettified.
 *
 * @see {@link https://github.com/AriaMinaei/pretty-error | Pretty Error GitHub repository}
 *
 * @remarks
 * This utility function is designed for development purposes only and has no effect outside of that environment. Its
 * main objective is to provide more readable error messages in the development terminal.
 */
export function pretty(error: errors.Exception | Error) {
  if (config.api.environment.env !== "development") {
    return;
  }
  const pretty = new PrettyError();
  pretty.skipNodeFiles();
  pretty.skipPackage("express");
  pretty.skipPackage("joi");
  pretty.skipPackage("express-async-handler");
  pretty.appendStyle({
    "pretty-error > header": {
      marginTop: 1,
    },
    "pretty-error > trace ": {
      marginTop: 1,
    },
    "pretty-error > trace > item": {
      marginBottom: 0,
    },
  });
  return console.log(pretty.render(error));
}
