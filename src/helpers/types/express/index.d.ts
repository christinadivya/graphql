import { IUser } from "../../../interfaces/entity/user";

declare global {
  declare namespace Express {
    interface Request {
      user?: IUser;
      token: string;
    }
  }
}
