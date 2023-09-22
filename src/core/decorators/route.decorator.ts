import chalk from "chalk";
import handler from "express-async-handler";

import { router } from "@src/router.js";

import { config, utils } from "@core/index.js";

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
  router[method](
    path,
    controller.middleware || [],
    handler(async (req, res, next) => {
      const controller = new target(
        {
          body: req.body,
          params: req.params,
          query: req.query,
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
      res.status(controller.status).send(response);
    })
  );
  if (config.api.debugging.enabled) {
    utils.api.log(
      chalk.blue(
        `  ${chalk.bgBlue.hex("#000000").bold(" ✈ ")} Route Attached: ${chalk.white.dim.bold(method.toUpperCase())} ${chalk.white.dim(path)}`
      )
    );
  }
}
