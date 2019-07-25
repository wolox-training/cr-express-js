const authService = require('../services/authentication');
const { check } = require('express-validator/check');
const { badRequestError } = require('../errors');
const { unauthorizedError } = require('../errors');
const { admin_role } = require('../constants');
const session = require('.././session');

exports.verifyTokenFormat = () => [
  check('Authorization', 'invalid token')
    .not()
    .isEmpty()
    .custom(token => {
      const splitToken = token.split(' ');
      return splitToken[0] && splitToken[0] === 'Bearer' && splitToken[1];
    })
];

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const user = authService.decodeToken(token);
      if (user && user.role === admin_role) {
        session.setAdmin();
      }
      return next();
    } catch {
      return next(badRequestError('invalid token'));
    }
  }
  return next(badRequestError('invalid token'));
};

exports.verifyAdminRole = (req, res, next) => {
  if (session.isAdmin()) {
    session.setDefault();
    return next();
  }
  session.setDefault();
  return next(unauthorizedError('not allowed'));
};
