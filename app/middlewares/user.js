const { body } = require('express-validator/check');
exports.validateSignup = () => [
  body('name', 'name error')
    .not()
    .isEmpty(),
  body('lastName', 'lastName error')
    .not()
    .isEmpty(),
  body('email', 'email error')
    .isEmail()
    .custom(value => {
      const aux = value.split('@')[1];
      return aux === 'wolox.com.ar';
    }),
  body('password', 'password error')
    .isLength({ min: 8 })
    .isAlphanumeric()
];
