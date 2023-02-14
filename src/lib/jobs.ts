import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { logger } from "@sentry/utils";
import { Job, Queue, QueueScheduler, Worker } from "bullmq";
import { Application } from "express";
import Redis from "ioredis";
import { RedisConfig } from "../config/env";

export default class Jobs {
  public expressApp: Application;
  public redisConfig: RedisConfig;
  public redisConnection: Record<any, any>;
  public addQueue: any;
  constructor(expressApp: Application, redisConfig: RedisConfig) {
    this.expressApp = expressApp;
    this.redisConfig = redisConfig;
    this.redisConnection = {
      connection: new Redis(
        `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}/2`,
        { maxRetriesPerRequest: null }
      ),
    };
  }

  async init(): Promise<void> {
    await this.createQueue();
    await this.createDefaultWorker();
    await this.createNewWorker();
  }

  async createQueue(): Promise<void> {
    const queueSchedule = new QueueScheduler("default", this.redisConnection);
    const defaultQueue = new Queue("default", this.redisConnection);
    const newQueue = new Queue("newQueue", this.redisConnection);

    defaultQueue.add(
      "defaultQueue",
      { name: "stephen" },
      {
        repeat: {
          cron: "*/10 * * * * *",
        },
      }
    );

    newQueue.add(
      "newQueueList",
      { name: "test one" },
      {
        repeat: {
          cron: "* 15 3 * * *",
        },
      }
    );

    this.configBullBoard([
      new BullMQAdapter(defaultQueue),
      new BullMQAdapter(newQueue),
    ]);
  }

  async createDefaultWorker(): Promise<void> {
    async function defaultQueueCron(job: Job) {
      logger.log(`job Data ${JSON.stringify(job)}`);
    }

    const worker = new Worker(
      "default",
      defaultQueueCron,
      this.redisConnection
    );

    worker.on("completed", (job) => {
      logger.info(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      logger.error(`${job.id} has failed with ${err.message}`);
    });
  }

  async createNewWorker(): Promise<void> {
    async function newQueueCron(job: Job) {
      logger.log(`job Data ${JSON.stringify(job)}`);
    }

    const worker = new Worker("default", newQueueCron, this.redisConnection);

    worker.on("completed", (job) => {
      logger.info(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      logger.error(`${job.id} has failed with ${err.message}`);
    });
  }

  configBullBoard(queues: Array<BullMQAdapter>) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");

    createBullBoard({
      queues,
      serverAdapter,
    });

    this.expressApp.use("/admin/queues", serverAdapter.getRouter());
  }
}
