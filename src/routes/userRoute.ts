import { Request, Response, Router } from "express";
import { validate } from "express-validation";
import * as resHndlr from "../helpers/resHandler";
import { httpRequestDurationMicroseconds } from "../lib/prometheus";
import JwtAuthenticator from "../middlewares/authentication";
import userValidation from "../middlewares/validations/userValidation";
import UserService from "../services/userService";

export default function userRoute(
  userService: UserService,
  authenticator: JwtAuthenticator
): Router {
  const userRouter = Router();

  userRouter.post(
    "/",
    [
      validate(
        userValidation.register,
        { keyByField: true },
        { abortEarly: false }
      ),
    ],
    async (req: Request, res: Response) => {
      const end = httpRequestDurationMicroseconds.startTimer();
      const route = req.baseUrl;
      try {
        const result = await userService.createUser(req.body);
        resHndlr.sendSuccess(res, result);
      } catch (err) {
        resHndlr.sendError(res, err);
      }
      end({ route, code: res.statusCode, method: req.method });
    }
  );

  return userRouter;
}
