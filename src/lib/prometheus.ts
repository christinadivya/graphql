import { Application } from "express";
import client, { Registry } from "prom-client";

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in microseconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export default class PromClient {
  public expressApp: Application;
  public register: Registry;
  constructor(expressApp: Application) {
    this.expressApp = expressApp;
    this.register = new client.Registry();
  }

  private async configMetricsAPI(): Promise<void> {
    this.expressApp.use("/metrics", async (req, res) => {
      const end = httpRequestDurationMicroseconds.startTimer();
      const route = req.baseUrl;

      res.setHeader("Content-Type", this.register.contentType);
      res.send(await this.register.metrics());

      // End timer and add labels
      end({ route, code: res.statusCode, method: req.method });
    });
  }

  public async init(): Promise<void> {
    this.register.setDefaultLabels({
      app: "node-boilerplate",
    });

    client.collectDefaultMetrics({ register: this.register });

    await this.configMetricsAPI();

    this.register.registerMetric(httpRequestDurationMicroseconds);
  }
}
