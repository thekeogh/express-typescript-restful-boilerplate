import { RequestHandler } from "express";

/**
 * Attach middleware to the specified controller.
 *
 * @param func - The middleware function to be added.
 *
 * @remarks
 * Middleware should be applied after the route decorator; otherwise, it won't be associated with the route. For
 * example, `@post("/path") @middleware(...)` and not `@middleware(...) @post("/path")`
 */
export function middleware(func: RequestHandler | RequestHandler[]) {
  return function <T extends GenericClass>(target: T) {
    const Controller = class extends target {};
    const controller = new Controller();
    return class extends target {
      middleware = [func, ...(controller.middleware || [])];
    };
  };
}
