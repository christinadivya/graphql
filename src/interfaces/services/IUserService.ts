import { IUser } from "../entity/user";

export default interface IUserService {
  createUser(user: IUser): Promise<IUser>;
}
