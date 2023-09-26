import { validator } from "@core/middleware/index.js";

/**
 * Attach middleware to the specified controller to validate incoming request.body.
 *
 * @param Schema - The class-validator class (not instantiated).
 *
 * @see {@link https://github.com/typestack/class-validator class-validator}
 *
 * @remarks
 * Middleware should be applied after the route decorator; otherwise, it won't be associated with the route. For
 * example, `@post("/path") @middleware(...)` and not `@middleware(...) @post("/path")`
 */
export function validate(Schema: GenericClass) {
  return function <T extends GenericClass>(target: T) {
    const Controller = class extends target {};
    const controller = new Controller();
    return class extends target {
      middleware = [validator(Schema), ...controller.middleware];
    };
  };
}
