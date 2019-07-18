const { body, check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const { badRequestError } = require('../errors');
const ascOrder = 'ASC';
const descOrder = 'DESC';

const validateEmailPassword = () => [
  body('email', 'email error')
    .not()
    .isEmpty()
    .isEmail()
    .custom(value => {
      const aux = value.split('@')[1];
      return aux === 'wolox.com.ar';
    }),
  body('password', 'password error')
    .isLength({ min: 8 })
    .isAlphanumeric()
];

exports.validateSignup = () => [
  body('name', 'name error')
    .not()
    .isEmpty(),
  body('lastName', 'lastName error')
    .not()
    .isEmpty(),
  validateEmailPassword()
];

exports.validateSignin = () => [validateEmailPassword()];

exports.validateError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(badRequestError(errors.array()));
  }
  return next();
};

exports.checkOrder = () => [
  check('order')
    .optional()
    .not()
    .isEmpty()
    .customSanitizer(value => value && value.toUpperCase())
    .isIn([ascOrder, descOrder])
];
