import { route } from "./route.decorator.js";

/**
 * Attach a DELETE route to the Express router.
 *
 * @param path - The route path.
 */
export function del(path: string) {
  return function <T extends GenericClass>(target: T) {
    route(target, "delete", path);
  };
}
