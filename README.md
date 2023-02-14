# WebService Boilerplate

Boilerplate for NodeJS typescript Webservices.

## How to use

We prefer to run this app with Node v14.17.1 or higher.

### Docker

The easiest way to get up and running is using Docker. Once the Docker CLI is installed from https://www.docker.com/get-docker.

Run: `docker-compose -f local-setup/docker-compose.yml up -d` to start up the local db & redis client.

### To initialize the app. Need to run the following scripts.

```
npm i

npm run local
```

### To run the migration files - creating all the tables

```
npm run migration
```

### To run the seed files - seeding the default values.

```
npm run seed
```

### To start the application on development mode.

```
npm run dev
```

To run migrations use following scripts:

#### create empty migration file

```
npm run typeorm migration:create -- -n migrationNameHere
```

#### generate new migration file

```
npm run typeorm migration:generate -- -n migrationNameHere
```

Swagger document can be found at `http://localhost:8000/apiDocs`

## Features

<dl>
  <dt>Instant feedback and reload</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/nodemon">Nodemon</a> to automatically reload the server after a file change when on development mode, makes the development faster and easier.
  </dd>

  <dt>Scalable and easy to use web server</dt>
  <dd>
    Use <a href="https://www.npmjs.com/package/express">Express</a> for requests routing and middlewares. There are some essential middlewares for web APIs already setup, like <a href="https://www.npmjs.com/package/body-parser">body-parser</a>, <a href="https://www.npmjs.com/package/compression">compression</a>, <a href="https://www.npmjs.com/package/cors">CORS</a> and <a href="https://www.npmjs.com/package/method-override">method-override</a>.
  </dd>

  <dt>Database integration</dt>
  <dd>
    <a href="https://www.npmjs.com/package/typeorm">TypeORM</a>, an ORM for SQL databases, is already integrated, you just have to set the authentication configurations</a>.
  </dd>

  <dt>Logging</dt>
  <dd>
    The <a href="https://www.npmjs.com/package/log4js">Log4js</a> logger is highly pluggable, being able to append the messages to a file during the development and send them to a logging service when on production. Even the requests (through <a href="https://www.npmjs.com/package/morgan">morgan</a>) and queries will be logged.
  </dd>

  <dt>Linter</dt>
  <dd>
    It's also setup with <a href="https://www.npmjs.com/package/eslint">ESLint</a> to make it easy to ensure a code styling and find code smells.
  </dd>
</dl>

## Tech

- [Node v14.17.1](http://nodejs.org/)
- [Express](https://npmjs.com/package/express)
- [TypeORM](https://www.npmjs.com/package/typeorm)
- [HTTP Status](https://www.npmjs.com/package/http-status)
- [Log4js](https://www.npmjs.com/package/log4js)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [ESLint](https://www.npmjs.com/package/eslint) + [ESLint AirBnb](https://www.npmjs.com/package/eslint-config-airbnb-base) + [Prettier](https://www.npmjs.com/package/prettier)
- [Joi](https://www.npmjs.com/package/@hapi/joi)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
