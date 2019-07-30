const jwt = require('jwt-simple');
const moment = require('moment');
const { secret } = require('../../../config').common.session;

exports.generateToken = user => {
  const tokenPayload = {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    id: user.id,
    role: user.role,
    generatedDate: Date.now(),
    exp: moment()
      .add(1, 'seconds')
      .valueOf()
  };
  return jwt.encode(tokenPayload, secret);
};
