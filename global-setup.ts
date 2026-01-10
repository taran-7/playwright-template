import { FullConfig } from "@playwright/test";
import * as dotenv from "dotenv";

async function globalSetup(config: FullConfig) {
  if (!process.env.test_env) {
    process.env.test_env = "test";
  }
  if (process.env.test_env) {
    dotenv.config({
      path: `.env.${process.env.test_env}`,
      override: true,
      quiet: true,
    });
  }
}

export default globalSetup;
