declare namespace Controllers {
  /**
   * Express Default Type Definitions
   *
   * @remarks
   * These types mirror the default types that Express uses for the respective request parameters.
   */
  type Method = "get" | "post" | "put" | "patch" | "delete" | "options" | "head";
  type DefaultBody = any;
  type DefaultParams = import("express-serve-static-core").ParamsDictionary;
  type DefaultQuery = import("qs").ParsedQs;
  type DefaultHeaders = import("http").IncomingHttpHeaders;
  type DefaultCookies = any;
  type DefaultLocals = import("express-serve-static-core").Locals;

  /**
   * Request payload definition for controllers
   *
   * @remarks
   * This interface defines the structure of the `this.request` property used in all controllers. It comprises data
   * extracted from the Express `req` object and is injected into the controller via the respective route decorators
   * (e.g., @get, @post, etc.).
   */
  interface Request<Body = DefaultBody, Params = DefaultParams, Query = DefaultQuery, Headers = DefaultHeaders, Cookies = DefaultCookies> {
    body: Body;
    params: Params;
    query: Query;
    headers: Headers;
    auth: Express.User;
    cookies: Cookies;
    ip: string;
    route: any;
    method: Method;
    baseUrl: string;
    originalUrl: string;
    getHeader: (name: string) => string | undefined;
  }

  /**
   * Response payload definition for controllers
   *
   * @remarks
   * This interface defines the structure of the `this.response` property used in all controllers. It comprises data
   * extracted from the Express `res` object and is injected into the controller via the respective route decorators
   * (e.g., @get, @post, etc.).
   */
  interface Response<Locals = DefaultLocals> {
    locals: Locals;
    setHeader: (field: string, value?: string | string[]) => any;
    setCookie: (name: string, val: any, options?: import("express").CookieOptions) => any;
    clearCookie: (name: string, options?: import("express").CookieOptions) => any;
    redirect: (url: string) => void;
  }

  /**
   * Establish the guidelines (contract) for controller properties and methods.
   *
   * @remarks
   * We exclusively enforce public methods and properties. This choice is based on TypeScript's interface limitations,
   * and because private methods, being internal, are inconsequential to outside implementations.
   */
  interface Contract<R = any> {
    status: number;
    handle: () => Promise<R>;
  }
}
