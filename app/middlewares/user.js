/* eslint-disable no-extra-parens*/

const { body, check } = require('express-validator/check');
const { ascOrder } = require('../constants');
const { descOrder } = require('../constants');
const { badRequestError } = require('../errors');
const { default_role, admin_role } = require('../constants');

exports.validateEmailPassword = [
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

exports.validateSignup = [
  body('name', 'name error')
    .not()
    .isEmpty(),
  body('lastName', 'lastName error')
    .not()
    .isEmpty(),
  exports.validateEmailPassword
];

exports.checkOrder = [
  check('order')
    .optional()
    .not()
    .isEmpty()
    .customSanitizer(value => value && value.toUpperCase())
    .isIn([ascOrder, descOrder])
];

exports.checkBoughtAlbumsPermission = (req, res, next) => {
  if (
    (req.userPayload.role === default_role && req.userPayload.id === parseInt(req.params.userId)) ||
    req.userPayload.role === admin_role
  ) {
    return next();
  }
  return next(badRequestError('invalid userId'));
};
