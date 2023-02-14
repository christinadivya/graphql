import { ENVConfig } from "../src/config/env";

export const envConfig: ENVConfig = {
  appPort: "",
  hostIP: "",
  hostName: "",
  redisDb: {
    redisDBIndex: 0,
    port: "",
    host: "",
    password: "",
  },
  db: {
    username: "",
    password: "",
    database: "",
    connection: "mysql",
    logging: false,
    synchronize: false,
    host: "",
    port: 0,
    storage: "",
  },
  jwtKey: "",
  apiUrl: {
    apiUrl: "",
  },
  sentry: {
    dsn: "",
  },
  env: "",
};
