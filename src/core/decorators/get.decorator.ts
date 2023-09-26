import { route } from "./route.decorator.js";

/**
 * Attach a GET route to the Express router.
 *
 * @param path - The route path.
 */
export function get(path: string) {
  return function <T extends GenericClass>(target: T) {
    route(target, "get", path);
  };
}
