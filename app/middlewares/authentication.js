const authService = require('../services/authentication');
const { badRequestError } = require('../errors');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
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
