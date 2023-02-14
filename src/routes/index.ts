import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import chalk from "chalk";
import express, { Application, Handler, Router } from "express";
import { Server } from "socket.io";
import { ENVConfig } from "../config/env";
import expressConfig from "../config/expressConfig";
import i18nextConfig from "../config/i18nextConfig";
import logger from "../config/logger/Logger";
// Dao
import UserDao from "../daos/userDao";
import { IRouter } from "../helpers/decorators/handlers.decorator";
import { MetadataKeys } from "../helpers/decorators/metadata.keys";
// Helper
import JwtHandler from "../helpers/jwtHandler";
import * as resHndlr from "../helpers/resHandler";
import Jobs from "../lib/jobs";
import PromClient from "../lib/prometheus";
import JwtAuthenticator from "../middlewares/authentication";
import { WSRedisClient } from "../redis/redis";
// Service../helpers/decorators/handlers.decorator
import UserService from "../services/userService";
// Route
import userRoute from "./userRoute";

export default async function createExpressApp(
  envConfig: ENVConfig
): Promise<Application> {
  // This function is used to set headers for cors domain issues
  const redisClient = new WSRedisClient(envConfig.redisDb);
  await redisClient.connectRedis();

  logger.info("Redis db connection established!");

  const expressApp = express();

  expressApp.set("trust proxy", true);

  Sentry.init({
    environment: envConfig.env,
    dsn: envConfig.sentry.dsn,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app: expressApp }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  expressApp.use(
    Sentry.Handlers.requestHandler({
      ip: true,
      serverName: false,
      user: ["email"],
    })
  );
  // TracingHandler creates a trace for every incoming request
  expressApp.use(Sentry.Handlers.tracingHandler());

  await expressConfig(expressApp);

  const apiRouter = Router();

  const server = expressApp.listen(expressApp.get("port"), () => {
    logger.info(
      "%s App is running at http://localhost:%d in %s mode",
      chalk.green("✓"),
      expressApp.get("port"),
      expressApp.get("env")
    );
    logger.info("Press CTRL-C to stop\n");
  });

  const corsOptions = {
    origin: /localhost.*$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  const io = new Server(server, {
    transports: ["polling", "websocket"],
    cors: corsOptions,
  });

  // init Prom Client
  const promClient = new PromClient(expressApp);
  await promClient.init();

  // init Bull Queue
  const jobs = new Jobs(expressApp, envConfig.redisDb);
  jobs.init();

  // init Dao
  const userDao = new UserDao();

  const jwtHandler = new JwtHandler(
    redisClient,
    envConfig.jwtKey,
    i18nextConfig
  );
  const authenticator = new JwtAuthenticator(jwtHandler, userDao);
  const userService = new UserService(userDao);
  // init Route
  const createUserRoute = userRoute(userService, authenticator);

  // REMINDER: Make sure to add all service files into this services array.
  function registerRouters() {
    const services = [{ instance: userService, className: UserService }];
    const info: Array<{ api: string; handler: string }> = [];

    services.forEach((service) => {
      const serviceInstance: { [handleName: string]: Handler } =
        service.instance as any;

      const basePath: string = Reflect.getMetadata(
        MetadataKeys.BASE_PATH,
        service.className
      );
      const routers: IRouter[] = Reflect.getMetadata(
        MetadataKeys.ROUTERS,
        service.className
      );

      const exRouter = express.Router();

      routers.forEach(({ method, path, handlerName }) => {
        exRouter[method](
          path,
          serviceInstance[String(handlerName)].bind(serviceInstance)
        );

        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          handler: `${service.className.name}.${String(handlerName)}`,
        });
      });

      expressApp.use(basePath, exRouter);
    });

    console.table(info);
  }

  registerRouters();

  // router definition
  apiRouter.use("/users", createUserRoute);

  expressApp.use(
    "/api",
    (req, res, next) => {
      req.headers.app_language = req.language || "en";
      i18nextConfig.changeLanguage(req.language);
      next();
    },
    apiRouter
  );

  expressApp.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 404 and 500 errors
        if ([400, 401, 422, 500, 404].includes(Number(error.status))) {
          return true;
        }
        return false;
      },
    })
  );

  expressApp.use(resHndlr.handleError);

  return expressApp;
}
