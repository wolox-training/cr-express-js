const encryptionService = require('../services/encryption');
const userService = require('../services/user');

exports.register = (req, res, next) => {
  const user = {
    email: req.body.email,
    name: req.body.email,
    lastName: req.body.lastName,
    password: encryptionService.encryptPassword(req.body.password)
  };
  userService
    .createUser(user)
    .then(userCreated => {
      res.send(201, userCreated);
    })
    .catch(next);
};
