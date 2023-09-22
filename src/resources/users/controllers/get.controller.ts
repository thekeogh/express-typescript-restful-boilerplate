import { faker } from "@faker-js/faker";

import { Controller } from "@controllers";
import { get } from "@decorators";

@get("/users/:id")
export class Get extends Controller<Users.Get.Request> implements Controllers.Contract<Users.Get.Response> {
  /**
   * Main request handler.
   *
   * @remarks
   * This method serves as the primary entry point on the controller, and it is invoked by the route to process the
   * request. It is a required and pivotal function from which all subsequent operations originate.
   */
  public async handle(): Promise<Users.Get.Response> {
    return {
      id: this.request.params.id,
      name: faker.person.firstName(),
      email: faker.internet.email(),
    };
  }
}
