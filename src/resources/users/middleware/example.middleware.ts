import { NextFunction, Request, Response } from "express";
import handler from "express-async-handler";

export function example(exampleHeader: string) {
  return handler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    /**
     * Perform an operation on the request...
     *
     * @remarks
     * This is a simple Express middleware where you can execute typical operations as needed.
     */
    res.header("ExampleHeader", exampleHeader);

    /**
     * Proceed to the next middleware or route handler.
     */
    return next();
  });
}
