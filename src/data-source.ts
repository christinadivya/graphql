import { DataSource } from "typeorm";
import * as envConfig from "./config/env";

const {
  connection,
  host,
  port,
  username,
  password,
  synchronize,
  logging,
  database,
} = envConfig.getConfig().db;

const {
  port: redisPort,
  host: redisHost,
  password: redisPassword,
} = envConfig.getConfig().redisDb;

// eslint-disable-next-line import/prefer-default-export
export const appDataSource = new DataSource({
  type: connection,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  logging,
  cache: {
    type: "redis",
    options: {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: 3,
    },
    duration: 25000,
    ignoreErrors: true,
  },
  timezone: "Z",
  charset: "utf8mb4_general_ci",
  entities: [`${__dirname}/entity/*.ts`],
  migrations: [`${__dirname}/database/migration/*.ts`],
});
