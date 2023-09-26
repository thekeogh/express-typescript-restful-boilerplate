/**
 * Defines the environmental variables used by the API.
 *
 * @remarks
 * Be sure to include any extra `.env` variables in this file. TypeScript will automatically detect and incorporate
 * them into the `process.env` object.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Environment
    readonly NODE_ENV: "development" | "staging" | "production" | "test";
    readonly HOST: string;
    readonly PORT: string;
    readonly SSL_CERT?: string | null;
    readonly SSL_KEY?: string | null;

    // Authentication
    readonly AUTH_JWT_SECRET: string;
    readonly AUTH_JWT_AUDIENCE: string;
    readonly AUTH_JWT_ISSUER: string;

    // Logging
    readonly LOGGING_API_NAME: string;
    readonly LOGGING_API_LEVEL: import("pino").LevelWithSilent;
    readonly LOGGING_API_INCLUDE_TIME: string;
    readonly LOGGING_API_INCLUDE_PID: string;
    readonly LOGGING_API_INCLUDE_HOST: string;
    readonly LOGGING_SENTRY_DSN: string;

    // Debugging
    readonly DEBUG: string;
  }
}
