const { body } = require('express-validator/check');
const userModel = require('../models').user;

exports.validateSignup = () => [
  body('name')
    .not()
    .isEmpty()
    .withMessage('name is required'),
  body('lastname')
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
