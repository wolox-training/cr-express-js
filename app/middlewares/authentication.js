const authService = require('../services/authentication');
const { check } = require('express-validator/check');
const { badRequestError } = require('../errors');
const { unauthorizedError } = require('../errors');
const { admin_role } = require('../constants');

exports.verifyTokenFormat = [
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
      req.userPayload = authService.decodeToken(token);
      return next();
    } catch {
      return next(badRequestError('invalid token'));
    }
  }
  return next(badRequestError('invalid token'));
};

exports.verifyAdminRole = (req, res, next) => {
  if (req.userPayload.role === admin_role) {
    return next();
  }
  return next(unauthorizedError('not allowed'));
};
