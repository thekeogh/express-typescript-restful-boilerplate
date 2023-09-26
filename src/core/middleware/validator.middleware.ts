import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import handler from "express-async-handler";

import { errors, utils } from "@core/index.js";

/**
 * Validate request data.
 *
 * @param Schema - The class-validator class (not instantiated).
 *
 * @see {@link https://github.com/typestack/class-validator class-validator}
 *
 * @remarks
 * By default, validation is performed on the request body only.
 */
export function validator(Schema: GenericClass) {
  return handler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    /**
     * Create an instance of the class.
     *
     * @remarks
     * To create a validatable object, we first instantiate the class, and then merge the request data into it.
     * Note that we only accept the class name without the "new" keyword (e.g., ClassName instead of new ClassName()).
     */
    const schema = new Schema();
    Object.assign(schema, req.body);

    /**
     * Perform data validation.
     *
     * @remarks
     * The instance we previously constructed represents the incoming request data. We can now use class-validator to
     * determine if this data meets the validation criteria.
     */
    const validated = await validate(schema, {
      stopAtFirstError: true,
      validationError: {
        target: false,
      },
    });

    /**
     * Continue if no errors were found.
     *
     * @remarks
     * If there are no errors in the request, we can proceed and assume the request data is valid.
     */
    if (!validated.length) {
      return next();
    }

    /**
     * Retrieve the first error from the validation results.
     *
     * @remarks
     * We aim to provide one error at a time, ensuring the validation results are valid for this purpose.
     */
    const constraints = validated[0].constraints;
    if (!constraints || !Object.values(constraints) || !Object.values(constraints).length) {
      return next(errors.BadRequest("Looks like something is missing. Please try again."));
    }

    /**
     * Retrieve the error message from the first error.
     *
     * @remarks
     * We are confident that the 'constraints' value is valid and contains at least one error, so let's extract it.
     */
    const message = Object.values(constraints)[0].trim();

    /**
     * Done! Send a Bad Request error response with the formatted error message to the client.
     *
     * @remarks
     * To enhance readability, we capitalise the first word of the message. class-validator typically starts error
     * messages with property names, which are in lowercase.
     */
    return next(errors.BadRequest(utils.string.capitaliseFirst(message)));
  });
}
