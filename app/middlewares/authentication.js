const authService = require('../services/authentication');
const { badRequestError } = require('../errors');
const { admin_role } = require('../constants');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      authService.decodeToken(token);
      return next();
    } catch {
      return next(badRequestError('invalid token'));
    }
  }
  return next(badRequestError('invalid token'));
};

exports.verifyAdminRole = (req, res, next) => {
  const user = authService.decodeToken(req.headers.authorization);
  if (user.role === admin_role) {
    return next();
  }
  return next(badRequestError('not allowed'));
};
