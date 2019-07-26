const { body, check } = require('express-validator/check');
const { ascOrder } = require('../constants');
const { descOrder } = require('../constants');

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
  this.validateEmailPassword
];

exports.checkOrder = [
  check('order')
    .optional()
    .not()
    .isEmpty()
    .customSanitizer(value => value && value.toUpperCase())
    .isIn([ascOrder, descOrder])
];
