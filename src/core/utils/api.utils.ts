import chalk from "chalk";
import { Request, Response } from "express";
import morgan, { TokenIndexer } from "morgan";

import { config } from "@core/index.js";

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
 *
 * @remarks
 * By default, we limit HTTP request logging to the development environment to mitigate excessive log output in
 * non-development environments.
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
