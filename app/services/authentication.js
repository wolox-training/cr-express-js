const jwt = require('jwt-simple');
const moment = require('moment');
const { secret, expiry, expiry_type } = require('../../config').common.session;

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    id: user.id,
    role: user.role,
    generatedDate: Date.now(),
    exp: moment()
      .add(expiry, expiry_type)
      .valueOf()
  };
  return jwt.encode(tokenPayload, secret);
};

const formatToken = token => token.split(' ')[1];

exports.decodeToken = token => {
  const formatedToken = formatToken(token);
  return jwt.decode(formatedToken, secret);
};
