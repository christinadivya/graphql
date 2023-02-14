export type sortBy = "DESC" | "ASC";

export interface JwtPayload {
  id: number;
  fcmToken: string;
  role: string;
}

export interface TypeORMCache {
  type: string;
  options: {
    host: string;
    port: string;
    password: string;
    db: number;
  };
  duration: number;
  ignoreErrors: boolean;
}

export interface ORMConfig {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  cache: TypeORMCache;
  synchronize: boolean;
  logging: boolean;
  timezone: string;
  charset: string;
  entities: string[];
  migrations: string[];
  seeds: string[];
  cli: {
    entitiesDir: string;
    migrationsDir: string;
    seedsDir: string;
  };
}
