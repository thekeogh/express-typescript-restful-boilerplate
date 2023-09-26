import { route } from "./route.decorator.js";

/**
 * Attach a PUT route to the Express router.
 *
 * @param path - The route path.
 */
export function put(path: string) {
  return function <T extends GenericClass>(target: T) {
    route(target, "put", path);
  };
}
