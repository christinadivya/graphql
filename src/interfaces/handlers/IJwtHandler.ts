import { JwtPayload } from "../../helpers/types";

export default interface IJwtHandler {
  generateToken(user_id: number, fcmToken: string): Promise<string>;
  verifyToken(token: string | undefined): Promise<JwtPayload>;
  deleteToken(token: string | undefined): Promise<number>;
}
