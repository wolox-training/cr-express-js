const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;
const { badRequestError } = require('../errors');
const logger = require('.././logger');

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    id: user.id
  };
  return jwt.encode(tokenPayload, secret);
};

exports.decodeToken = token => {
  try {
    return jwt.decode(token, secret);
  } catch (err) {
    logger.info(err);
    throw badRequestError('invalid token');
  }
};
