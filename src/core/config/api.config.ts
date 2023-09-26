/**
 * Environment for the API.
 *
 * @remarks
 * If no environment configuration is found, we will automatically use the settings for the development environment.
 * Please make sure you've created a .env.development.local file to customise these values as needed.
 */
export const environment = {
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST || "localhost",
  port: (process.env.PORT && +process.env.PORT) || 7050,
};

/**
 * Logging configuration for the API.
 *
 * @remarks
 * This section contains all configuration settings related to logging. It encompasses various logging services, both
 * external options like Sentry and DataDog, as well as internal loggers such as Pino and Watson.
 *
 * API
 * This section represents a subset of the Pino configuration. Please refer to the Pino documentation for in-depth
 * details, as our configuration options align with those provided by Pino.
 *
 * @see {@link https://github.com/pinojs/pino Pino GitHub}
 *
 * Sentry
 * Specify the HTTP error codes that should NOT be sent to Sentry by adding them to the ignore array.
 */
export const logging = {
  api: {
    name: process.env.LOGGING_API_NAME,
    level: process.env.LOGGING_API_LEVEL || "info",
    redact: ["email", "password", "*.email", "*.password"],
    include: {
      time: process.env.LOGGING_API_INCLUDE_TIME === "true",
      pid: process.env.LOGGING_API_INCLUDE_PID === "true",
      host: process.env.LOGGING_API_INCLUDE_HOST === "true",
    },
    ignore: {
      codes: [301, 307, 308, 401, 402, 403, 404, 405, 409, 418, 422],
    },
  },
  sentry: {
    dsn: process.env.LOGGING_SENTRY_DSN,
  },
};

/**
 * Authentication configuration for the API.
 *
 * @remarks
 * Our API currently exclusively supports the HS256 algorithm for authentication. To enable authentication, you must
 * set the secret key in your .env file. Refer to the README for guidance on securing your endpoints. The audience and
 * issuer values are not mandatory; if you omit them, they will not be considered during JWT authentication.
 */
export const authentication = {
  secret: process.env.AUTH_JWT_SECRET,
  audience: process.env.AUTH_JWT_AUDIENCE,
  issuer: process.env.AUTH_JWT_ISSUER,
};

/**
 * Debugging configuration for the API.
 *
 * @remarks
 * This setting enables various debugging features for the API. It's recommended to enable debugging only in
 * development environments to avoid unnecessary noise in the loggers. Please note that all terminal styling
 * (e.g., Chalk, ASCII) will be omitted in production logs.
 */
export const debugging = {
  enabled: process.env.DEBUG === "true",
};
