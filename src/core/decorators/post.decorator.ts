import { route } from "./route.decorator.js";

/**
 * Attach a POST route to the Express router.
 *
 * @param path - The route path.
 */
export function post(path: string) {
  return function <T extends GenericClass>(target: T) {
    route(target, "post", path);
  };
}
