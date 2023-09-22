import fs from "fs/promises";

import chalk from "chalk";
import prettier from "prettier";

export const utils = {
  filesystem: {
    /**
     * Generate an absolute file path based on the provided relative path.
     *
     * @param path - The relative path to convert.
     */
    getAbsolutePath(path: string): string {
      return process.cwd() + path;
    },

    /**
     * Read a file and send the contents back. We do nothing with this data and send back the string
     *
     * @param filepath - The path to the file to read
     */
    async read(filepath: string): Promise<string> {
      return fs.readFile(filepath, { encoding: "utf-8" });
    },

    /**
     * Write to a file on disk
     *
     * @param filepath - The path to the file to write
     * @param content - The content to write to the file
     */
    async write(filepath: string, content: string): Promise<void> {
      return fs.writeFile(filepath, content);
    },

    /**
     * Return whether a file exists or not
     *
     * @param filepath - Path to the file to check for
     */
    async exists(filepath: string): Promise<boolean> {
      try {
        await fs.access(filepath, fs.constants.F_OK);
        return true;
      } catch {
        return false;
      }
    },
  },

  templates: {
    /**
     * Fetch the contents of a template file
     *
     * @param template - The template filename. Do not include the file extension.
     *
     * @example utils.templates.read("typescript") => /schema/templates/typescript.template
     */
    async read(template: string): Promise<string> {
      const path = process.cwd() + "/bin/templates/" + template + ".template";
      return utils.filesystem.read(path);
    },

    /**
     * Prettify a code snippet using Prettier.
     *
     * @param input - The input code to be prettified
     * @param parser - What parser we should use (what lang is this)
     */
    async prettier(input: string, parser: "typescript" | "json"): Promise<string> {
      return prettier.format(input, { parser });
    },
  },

  notification: {
    /**
     * Send a warning notification to the terminal
     *
     * @param message - The message for the notification
     */
    warn(message: string): void {
      return console.log(`${chalk.bgYellow.hex("#000000").bold(" ⚠ ")} ${chalk.dim.white.bold(message)}`);
    },

    /**
     * Send a success notification to the terminal
     *
     * @param message - The message for the notification
     */
    success(message: string): void {
      return console.log(`${chalk.bgGreen.hex("#000000").bold(" ✓ ")} ${chalk.green.bold(message)}`);
    },

    /**
     * Send a error notification to the terminal
     *
     * @param message - The message for the notification
     */
    error(message: string): void {
      return console.log(`${chalk.bgRed.hex("#000000").bold(" ✘ ")} ${chalk.red.bold(message)}`);
    },

    /**
     * Send a info notification to the terminal
     *
     * @param message - The message for the notification
     */
    info(message: string): void {
      return console.log(`${chalk.bgBlue.hex("#000000").bold(" i ")} ${chalk.blue.bold(message)}`);
    },
  },
};
