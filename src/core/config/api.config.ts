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
