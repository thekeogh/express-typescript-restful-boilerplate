export class Controller<Request = Controllers.Request, Response = Controllers.Response> {
  /**
   * Request data container.
   *
   * @remarks
   * This property will store all the useful data from the Express req object. Your child controller should define the
   * specific TypeScript types for the specific controller request (e.g. body, params etc).
   */
  protected request: Request;

  /**
   * Response data container.
   *
   * @remarks
   * This property will store all the useful data from the Express res object. Your child controller should define the
   * specific TypeScript types for the specific controller request (e.g. locals, setHeader etc).
   */
  protected response: Response;

  /**
   * Default HTTP status code for successful responses.
   *
   * @remarks
   * By default, all successful responses are set to HTTP status code 200. This property is exclusively intended for
   * successful response status codes. Error responses should be handled by raising exceptions. You can customise this
   * value using the @response() decorator.
   */
  public status = 200;

  /**
   * Controller Initialisation.
   *
   * @param request - Provided by the decorator.
   * @param response - Provided by the decorator.
   */
  public constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}
