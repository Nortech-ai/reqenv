#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "fs";
import { bold, red } from "kleur";
import type { IPackageJson } from "package-json-type";
import { join } from "path";

const program = new Command();

const packageDetails = getCurrentPackageDetails();
program
  .version(packageDetails.version!)
  .name(packageDetails.name!.replace("@nortech/", ""))
  .description(packageDetails.description!);

program
  .argument(
    "<variables...>",
    "What variables you want to check e.g AWS_KEY WORKSPACE"
  )
  .action((variables: string[]) => {
    const missingVariables = [] as string[];

    for (const variable of variables) {
      if (!process.env[variable]) {
        missingVariables.push(variable);
      }
    }

    if (missingVariables.length > 0) {
      console.error(
        red(
          `${bold(missingVariables.join(", "))} - Environment ${
            missingVariables.length > 1 ? "variables are" : "variable is"
          } missing and must be defined `
        )
      );
      process.exit(1);
    }
  });
program.parse();

function getCurrentPackageDetails() {
  return JSON.parse(
    readFileSync(join(__dirname, "package.json"), "utf-8")
  ) as IPackageJson;
}
