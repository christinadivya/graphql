import { appDataSource } from "../data-source";
import User from "../entity/User";
import IUserDao from "../interfaces/daos/IUserDao";
import { IUser } from "../interfaces/entity/user";

/**
 *  User DAO
 * @public
 */
export default class UserDao implements IUserDao {
  async createUser(user: IUser): Promise<IUser> {
    console.log(user);

    const newUser = await appDataSource.getRepository<IUser>(User).save(user);

    return newUser;
  }

  async findUser(id: number): Promise<IUser> {
    return appDataSource.getRepository<IUser>(User).findOne({ where: { id } });
  }
}
