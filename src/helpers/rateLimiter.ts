import { NextFunction, Request, Response } from "express";
import { RateLimiter } from "limiter";
import i18next from "../config/i18nextConfig";
import Logger from "../config/logger/Logger";
import customExceptions from "./customExceptions";

const limiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: "minute",
  fireImmediately: true,
});

export async function limitHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const remainingRequests = await limiter.removeTokens(1);
    if (remainingRequests < 0) {
      throw customExceptions.unAuthenticatedAccess(
        i18next.t("requestOverload"),
        7
      );
    } else {
      next();
    }
  } catch (er) {
    Logger.error(er.msg);
    next(er);
  }
}
