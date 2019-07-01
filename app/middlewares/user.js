const { body } = require('express-validator/check');
const userModel = require('../models').user;

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
    .custom(value => {
      let aux = value.substr(value.indexOf('@') + 1);
      aux = aux.substr(0, aux.indexOf('.'));
      return aux === 'wolox';
    }),
  body('password')
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
