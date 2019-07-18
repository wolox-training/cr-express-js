const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;
// const { badRequestError } = require('../errors');
// const logger = require('.././logger');

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName
  };
  return jwt.encode(tokenPayload, secret);
};

exports.decodeToken = token => jwt.decode(token, secret);
