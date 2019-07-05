const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;
const { badRequestError } = require('../errors');

exports.verifyToken = (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    const decoded = jwt.decode(token, secret);
    if (decoded) {
      return next();
    }
    return next(badRequestError('invalid token'));
  }
  return next(badRequestError('token does not exists'));
};
