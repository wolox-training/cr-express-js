const authService = require('../services/authentication');
const { badRequestError } = require('../errors');

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

exports.verifyRole = (req, res, next) => {
  const user = authService.decodeToken(req.headers.authorization);
  if (user.role === 'admin') {
    return next();
  }
  return next(badRequestError('not allowed'));
};
