const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;

exports.generateToken = user => {
  const userAccount = {
    email: user.email,
    name: user.name,
    lastName: user.lastName
  };
  const token = jwt.encode(userAccount, secret);
  return token;
};
