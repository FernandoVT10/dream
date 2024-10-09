import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkSchema, Schema, validationResult, ErrorFormatter } from "express-validator";

const errorFormater: ErrorFormatter = (error) => ({
  message: error.msg,
  field: error.type === "field" ? error.path : undefined,
});

export default function validateSchema(schema: Schema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validator = checkSchema(schema);

    await validator.run(req);
    const result = validationResult(req).formatWith(errorFormater);

    if(!result.isEmpty()) {
      const errors = result.array({ onlyFirstError: true });
      res.status(400).json({ errors });
    } else next();
  };
}
