import { program } from "commander";

import { middleware } from "./generate/middleware.js";

program.version("1.0.0");

/**
 * Generate a middleware file.
 *
 * @remarks
 * Will prompt user with questions to help name and store the file.
 */
program
  .command("middleware")
  .description("Create a new middleware")
  .action(async () => middleware());

program.parse(process.argv);
