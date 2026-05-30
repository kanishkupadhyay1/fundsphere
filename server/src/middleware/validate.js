import { validationResult } from 'express-validator';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const error = new Error('Validation failed');
  error.statusCode = 422;
  error.errors = errors.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));
  next(error);
};
