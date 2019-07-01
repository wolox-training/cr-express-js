const { body } = require('express-validator/check');
const userModel = require('../models').user;

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

exports.validateEmailExistance = (req, res, next) => {
  req.user = {};
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(next);
};
