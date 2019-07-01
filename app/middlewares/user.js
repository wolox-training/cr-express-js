const { body } = require('express-validator/check');
exports.validateSignup = () => [
  body('name')
    .not()
    .isEmpty()
    .withMessage('name is required'),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('lastname is required'),
  body('email', 'Invalid email')
    .isEmail()
    .withMessage('email error')
    .not()
    .isEmpty()
    .withMessage('email is required'),
  body('password')
    .isLength({ min: 8 })
    .isAlphanumeric()
];
