const jwt = require('jwt-simple');
const { secret, expiry, expiry_format } = require('../../config').common.session;
const moment = require('moment');

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    id: user.id,
    role: user.role,
    iat: moment().unix(),
    exp: moment()
      .add(expiry, expiry_format)
      .unix()
  };
  return { token: jwt.encode(tokenPayload, secret), exp: tokenPayload.exp };
};

const formatToken = token => token.split(' ')[1];

exports.decodeToken = token => {
  const formatedToken = formatToken(token);
  return jwt.decode(formatedToken, secret, false);
};
