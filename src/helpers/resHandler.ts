import * as Sentry from "@sentry/node";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import logger from "../config/logger/Logger";
import APIResponse from "./APIResponse";
import Exception from "./Exception";

// This function is used to send success / error response
/**
 *
 * @param res -express response object
 * @param result- result to send in response
 * @returns - express response
 */
export function sendResponse(res: Response, result: any): Response {
  try {
    if (result && result.error && result.error.errorCode === 1) {
      return res.status(500).send(result);
    }

    // Internal server error
    if (result && result.error && result.error.errorCode === 2) {
      return res.status(400).send(result);
    }

    // Bad request
    if (
      result &&
      result.error &&
      (result.error.errorCode === 5 || result.error.errorCode === 6)
    ) {
      return res.status(401).send(result);
    }

    // Un-authorized
    if (result && result.error && result.error.errorCode === 4) {
      return res.status(409).send(result);
    } // Conflict and in duplicate data
    if (result && result.error && result.error.errorCode === 7) {
      return res.status(429).send(result);
    }
    // send status code 200
    return res.status(200).send(result);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 *This function is used to send error to end users
 * @param res -express response object
 * @param err -error to send
 */
export function sendError(res: Response, err?: Exception): void {
  try {
    Sentry.captureMessage(JSON.stringify(err));
    logger.error(err);
    let error = err?.err;
    if (err?.error) {
      error = err.error;
    }
    let errorCode = err?.errorCode || 1;
    let msg;
    if (err instanceof ValidationError) {
      msg = err.details;
      errorCode = 2;
    } else if (!err?.msg) {
      msg = "Internal Server Error";
    } else if (typeof err?.msg === "string") {
      msg = err?.msg;
    } else {
      msg = err.msg;
    }

    let responseError: Exception;
    if (err instanceof ValidationError) {
      responseError = new Exception(errorCode, msg[0], error);
      // responseError.msg = ;
    } else {
      responseError = new Exception(errorCode, msg, error);
      responseError.msg = msg;
    }

    const result = new APIResponse(false, responseError);
    sendResponse(res, result);
  } catch (error) {
    // Hopefully never happens...
    logger.error(error);
  }
}

// N.B. All 4 variables are required for express to call the handler
/**
 *This function is used to handle uncaught exception
 * @param err -exception
 * @param req -express request object
 * @param res -express response object
 * @param next -express next function
 */
export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendError(res, err);
}

/**
 *This function is used to send success message response
 * @param res -express response object
 * @param msg -success message
 */
export function sendSuccessWithMsg(res: Response, msg: string): void {
  try {
    const rslt = { message: msg };
    const result = new APIResponse(true, rslt);
    sendResponse(res, result);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 *This function is used to send success response to end-user
 * @param res -express response object
 * @param rslt - message to send end user object or string by default it is set to empty object
 */
export function sendSuccess(res: Response, rslt = {}): void {
  try {
    const result = new APIResponse(true, rslt);
    sendResponse(res, result);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
