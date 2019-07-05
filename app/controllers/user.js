const encryptionService = require('../services/encryption');
const userService = require('../services/user');

exports.register = (req, res, next) => {
  userService
    .findOne(req.body.email)
    .then(() => {
      userService
        .createUser(
          req.body.email,
          req.body.name,
          req.body.lastName,
          encryptionService.encryptPassword(req.body.password)
        )
        .then(userCreated => {
          res.send(userCreated);
        });
    })
    .catch(next);
};
