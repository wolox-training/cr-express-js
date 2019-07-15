const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName
  };
  return jwt.encode(tokenPayload, secret);
};

exports.decodeToken = token => jwt.decode(token, secret);
