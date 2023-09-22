import { readFileSync } from "fs";
import https, { Server } from "https";

import chalk from "chalk";
import { Express } from "express";

import { api } from "@src/server.js";

import { config, utils } from "@core/index.js";

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
server.listen(config.api.environment.port, () => {
  utils.api.log(chalk.green(`\n  ${chalk.bgGreen.hex("#000000").bold(" ✓ ")} Environment: ${chalk.yellow.bold(config.api.environment.env)}`));
  utils.api.log(chalk.green(`  ${chalk.bgGreen.hex("#000000").bold(" ✓ ")} URL: ${chalk.yellow.bold(utils.api.url())}`));
  utils.api.log(chalk.white.dim("\n  Press CTRL+C to stop the API.\n"));
});
