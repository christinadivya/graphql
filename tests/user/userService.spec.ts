import { expect } from "chai";
import { describe, it } from "mocha";
import sinon, { assert } from "sinon";
import UserDao from "../../src/daos/userDao";
import UserService from "../../src/services/userService";

const userDao = new UserDao();

const userService = new UserService(userDao);
const sandbox = sinon.createSandbox();

describe("User Service", () => {
  const user = {
    id: 1,
    first_name: "Test",
    last_name: "User",
    phone: "8667092145",
    country_code: "91",
    email: "test@yopmail.com",
    password: "password",
  };

  describe("create user", function () {
    this.timeout(7000);
    it("should send otp to user and return user details", async () => {
      const createUserDao = sandbox
        .stub(userDao, "createUser")
        .resolves({ ...user, password: "hashedPassword" });
      const result = await userService.createUser(user);
      expect(result).to.be.a("object");
      expect(result.id).to.equal(1);
      expect(result.password).to.equal("hashedPassword");
      assert.calledOnce(createUserDao);
    });
  });
});
