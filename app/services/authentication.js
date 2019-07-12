const jwt = require('jwt-simple');
const { secret } = require('../../config').common.session;

exports.generateToken = user => {
  const userAux = {
    email: user.email,
    name: user.name,
    lastName: user.lastName
  };
  const token = jwt.encode(userAux, secret);
  return token;
};
