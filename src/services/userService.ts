import UserDao from "../daos/userDao";
import { Get, Post } from "../helpers/decorators/handlers.decorator";
import Service from "../helpers/decorators/service.decorator";
import { IUser, UserID } from "../interfaces/entity/user";
import IUserService from "../interfaces/services/IUserService";

/**
 * User Service
 * @public
 */
@Service("/users")
export default class UserService implements IUserService {
  userDao: UserDao;
  constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  @Post("/")
  async createUser(user: IUser): Promise<IUser> {
    return this.userDao.createUser(user);
  }

  @Get("/:id")
  async findUser(id: UserID): Promise<IUser> {
    return this.userDao.findUser(id);
  }
}
