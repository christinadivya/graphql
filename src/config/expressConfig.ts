import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import middleware from "i18next-http-middleware";
import logger from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import i18nextConfig from "./i18nextConfig";
import Logger from "./logger/Logger";
import LoggerStreamAdapter from "./logger/LoggerStreamAdapter";

const apiDocument = YAML.load(path.resolve(__dirname, "../swagger.yml"));

// Start export the app modules
export default async (expressApp: Application): Promise<void> => {
  expressApp.use(middleware.handle(i18nextConfig));

  const corsOptions = {
    origin: /localhost.*$/,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  // This function is used to set headers for cors domain issues
  expressApp.use(cors(corsOptions));

  expressApp.use(
    logger("dev", { stream: LoggerStreamAdapter.toStream(Logger) })
  );

  expressApp.set("host", process.env.HOST_IP || "0.0.0.0");
  expressApp.set("port", process.env.APP_PORT || 8000);

  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));

  expressApp.disable("x-powered-by");

  // eslint-disable-next-line no-unused-vars
  expressApp.use("/swagger.json", (req: Request, res: Response) => {
    res.json(apiDocument);
  });

  const options = {
    customSiteTitle: "API Swagger Document",
    customCss: `
    .swagger-ui .topbar {
      display: none;
    }
    .swagger-ui .models {
      display: none;
    }`,
  };

  expressApp.use(
    "/apiDocs",
    swaggerUi.serve,
    swaggerUi.setup(apiDocument, options)
  );

  // moved to down because swagger throws an error
  expressApp.use(helmet());
};
