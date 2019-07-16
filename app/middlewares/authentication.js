const authService = require('../services/authentication');
const { badRequestError } = require('../errors');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    const decoded = authService.decodeToken(token);
    if (decoded) {
      return next();
    }
  }
  return next(badRequestError('invalid token'));
};
