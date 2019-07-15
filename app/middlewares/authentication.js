const { badRequestError } = require('../errors');
const authService = require('../services/authentication');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    const decoded = authService.decodeToken(token);
    if (decoded) {
      return next();
    }
    return next(badRequestError('invalid token'));
  }
  return next(badRequestError('token does not exists'));
};
