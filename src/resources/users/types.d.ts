declare namespace Users {
  /**
   * Resource
   *
   * @remarks
   * Define the resource and any other shared types here.
   */
  interface User {
    id: string;
    name: string;
    email: string;
  }

  /**
   * Endpoints
   *
   * @remarks
   * Define the request and response types for all endpoints here.
   */
  namespace Get {
    type Request = Controllers.Request<Controllers.DefaultReqBody, { id: string }>;
    type Response = Users.User;
  }
  namespace Create {
    type Request = Controllers.Request<import("@resources/users/validation/index.js").Create>;
    type Response = Users.User;
  }
}
