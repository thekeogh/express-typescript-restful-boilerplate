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

    // Debugging
    readonly DEBUG: string;
  }
}
