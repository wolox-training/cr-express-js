const { validationResult } = require('express-validator/check');
const { badRequestError } = require('../errors');

exports.validateError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(badRequestError(errors.array()));
  }
  return next();
};
