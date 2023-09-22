import chalk from "chalk";
import { program } from "commander";
import inquirer from "inquirer";

import { utils } from "../utils.js";

export async function middleware() {
  const questions = [
    {
      type: "input",
      name: "resource",
      message: "Resource for this middleware (e.g. users):",
      validate: (input: string) => {
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return "Resource must be a valid resource name (letters, numbers, dashes and underscores only).";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "name",
      message: "Name your middleware:",
      validate: (input: string) => {
        if (!/^[a-zA-Z0-9]+$/.test(input)) {
          return "Name must be alphanumeric (letters and numbers only).";
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  const name: string = answers.name;
  const resource: string = answers.resource;

  const pathExists = await utils.filesystem.exists(utils.filesystem.getAbsolutePath(`/src/resources/${resource}/middleware`));

  if (!pathExists) {
    program.error(chalk.red("Path don't exist brother!"));
  }

  console.log(`Create middleware: ${name} in ${resource}!`);
}
