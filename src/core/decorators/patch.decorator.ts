import { route } from "./route.decorator.js";

/**
 * Attach a PATCH route to the Express router.
 *
 * @param path - The route path.
 */
export function patch(path: string) {
  return function <T extends GenericClass>(target: T) {
    route(target, "patch", path);
  };
}
