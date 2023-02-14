// organize-imports-ignore
import "reflect-metadata";
import { Application } from "express";
import { appDataSource } from "./src/data-source";
import * as envConfig from "./src/config/env";
import Logger from "./src/config/logger/Logger";
import createExpressApp from "./src/routes";

export default async function runServer(): Promise<Application> {
  try {
    const config = envConfig.getConfig();
    await appDataSource.initialize();
    Logger.info("Database connected");

    return createExpressApp(config);
  } catch (e) {
    Logger.error(e, "Unable to start the server!");
    return e;
  }
}

// TODO(JEM): Could now use this to spin up the server in-process during tests if desired
runServer().catch((err) => {
  Logger.error(`Top-level catch: ${err}`);
});
