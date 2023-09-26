import { faker } from "@faker-js/faker";

import { Controller } from "@controllers";
import { guard, middleware, post, response, validate } from "@decorators";

import { users } from "@resources";

@post("/users")
@guard()
@response(201)
@validate(users.validation.Create)
@middleware(users.middleware.example("Example arg setting header"))
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
