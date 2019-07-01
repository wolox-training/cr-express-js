const { body } = require('express-validator/check');
exports.validateSignup = () => [
  body('name', 'name error')
    .not()
    .isEmpty(),
  body('lastName', 'lastName error')
    .not()
    .isEmpty(),
  body('email', 'email error')
    .not()
    .isEmpty()
    .isEmail()
    .custom(value => {
      let aux = value.substr(value.indexOf('@') + 1);
      aux = aux.substr(0, aux.indexOf('.'));
      return aux === 'wolox';
    }),
  body('password', 'password error')
    .isLength({ min: 8 })
    .isAlphanumeric()
];
