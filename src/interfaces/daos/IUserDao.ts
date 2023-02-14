import { IUser } from "../entity/user";

export default interface IUserDao {
  createUser(user: IUser): Promise<IUser>;
}
