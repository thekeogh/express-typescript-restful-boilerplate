import { readFileSync } from "fs";
import https, { Server } from "https";

import { Express } from "express";

import { api } from "@src/server.js";

import { config, utils } from "@core/index.js";

import { log } from "@logger";

/**
 * Boot the Express API.
 *
 * @remarks
 * If the SSL certificate and key are defined in the environmental variables, it initiates an HTTPS server and serves
 * the Express app under SSL. This is typically done in development environments, while other environments handle this
 * outside the API.
 */
let server: Express | Server = api;
if (process.env.SSL_CERT && process.env.SSL_KEY) {
  server.disable("trust proxy");
  server = https.createServer(
    {
      cert: readFileSync(process.cwd() + process.env.SSL_CERT),
      key: readFileSync(process.cwd() + process.env.SSL_KEY),
    },
    server
  );
} else {
  server.enable("trust proxy");
}

/**
 * Start the server and listen on the specified port.
 */
server.listen(config.api.environment.port, () => {
  log.info(`Listening at ${utils.api.url()} in ${config.api.environment.env} with Sentry ${config.api.logging.sentry.dsn ? "on" : "off"}`);
});
