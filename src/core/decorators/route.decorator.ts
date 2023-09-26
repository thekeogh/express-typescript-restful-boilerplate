import handler from "express-async-handler";
import { expressjwt as jwt } from "express-jwt";

import { router } from "@src/router.js";

import { config } from "@core/index.js";

import { log } from "@logger";

/**
 * Decorator template for all route decorators.
 *
 * @param target - The controller target from the decorator.
 * @param method - The HTTP method of the route.
 * @param path - The route path.
 */
export function route<T extends GenericClass>(target: T, method: Controllers.Method, path: string) {
  const Controller = class extends target {};
  const controller = new Controller();
  const guard = controller.guard || false;
  router[method](
    path,
    guard
      ? jwt({
          secret: config.api.authentication.secret,
          algorithms: ["HS256"],
          audience: config.api.authentication.audience || undefined,
          issuer: config.api.authentication.issuer || undefined,
        })
      : [],
    controller.middleware || [],
    handler(async (req, res, next) => {
      const controller = new target(
        {
          body: req.body,
          params: req.params,
          query: req.query,
          headers: req.headers,
          auth: req.auth || req.user,
          cookies: req.cookies,
          ip: req.ip,
          route: req.route,
          method: req.method,
          originalUrl: req.originalUrl,
          baseUrl: req.baseUrl,
          getHeader: req.header.bind(req),
        },
        {
          locals: res.locals,
          setHeader: res.header.bind(res),
          setCookie: res.cookie.bind(res),
          clearCookie: res.clearCookie.bind(res),
          redirect: res.redirect.bind(res),
        }
      );
      const response = await controller.handle();
      if (config.api.debugging.enabled && guard) {
        const child = log.child({ jwt: req.auth });
        child.trace("User");
      }
      res.status(controller.status).send(response);
    })
  );
  if (config.api.debugging.enabled) {
    const child = log.child({ route: `${method.toUpperCase()} ${path}`, guarded: guard });
    child.info("Mounted route");
  }
}
