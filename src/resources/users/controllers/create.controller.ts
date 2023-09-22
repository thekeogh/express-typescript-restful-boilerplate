import { faker } from "@faker-js/faker";

import { Controller } from "@controllers";
import { post, middleware, validate, response } from "@decorators";

import { users } from "@resources/index.js";

@post("/users")
@response(201)
@validate(users.validation.Create)
@middleware(users.middleware.example())
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {
  /**
   * Main request handler.
   *
   * @remarks
   * This method serves as the primary entry point on the controller, and it is invoked by the route to process the
   * request. It is a required and pivotal function from which all subsequent operations originate.
   */
  public async handle(): Promise<Users.Create.Response> {
    return {
      id: faker.string.uuid(),
      name: this.request.body.name,
      email: this.request.body.email,
    };
  }
}
