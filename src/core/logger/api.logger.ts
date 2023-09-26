import pino from "pino";
import pretty from "pino-pretty";

import { config } from "@core/index.js";

/**
 * Alias the pino config options.
 */
const options = config.api.logging.api;

/**
 * Specifies the default Pino configuration settings.
 *
 * @remarks
 * The default configuration for Pino determines how Pino behaves in a production environment. Any configuration
 * specific to non-production environments should be defined within the switch statement below.
 */
let stream: any;
let enabled = true;
let redact: string[] | undefined = options.redact;
const timestamp = options.include.time ? pino.stdTimeFunctions.isoTime : pino.stdTimeFunctions.nullTime;

/**
 * Enviroment specific configuration for Pino.
 *
 * @remarks
 * During testing, we commonly disable Pino to minimise log noise. Consequently, if 'enabled' is set to false, all
 * other settings become inconsequential. Conversely, in development, we aim to keep the log output as concise as
 * possible whilst streaming through pretty.
 */
switch (config.api.environment.env) {
  /**
   * Development
   */
  case "development":
    stream = pretty({
      colorize: true,
      singleLine: true,
      ignore: [!options.include.time && "time", !options.include.pid && "pid", !options.include.host && "hostname"].filter(Boolean).join(","),
    });
    redact = undefined;
    break;

  /**
   * Test
   */
  case "test":
    enabled = false;
    break;
}

/**
 * Export the Pino logger
 */
export const log = pino(
  {
    enabled,
    name: options.name,
    level: options.level,
    redact,
    timestamp,
    formatters: {
      bindings: (bindings) => {
        return {
          pid: options.include.pid ? bindings.pid : undefined,
          hostname: options.include.host ? bindings.hostname : undefined,
        };
      },
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
  },
  stream
);
