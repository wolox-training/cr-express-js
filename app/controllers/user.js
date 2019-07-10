const { badRequestError, notFoundError } = require('../errors');
const authenticationService = require('../services/authentication');
const encryptionService = require('../services/encryption');
const userService = require('../services/user');

exports.register = (req, res, next) => {
  const user = {
    email: req.body.email,
    name: req.body.email,
    lastName: req.body.lastName,
    password: encryptionService.encryptPassword(req.body.password)
  };
  return userService
    .createUser(user)
    .then(userCreated => {
      res.send(201, userCreated);
    })
    .catch(next);
};

exports.signIn = (req, res, next) => {
  userService
    .findOne(req.body.email)
    .then(user => {
      if (user) {
        if (encryptionService.validatePasssword(req.body.password, user.password)) {
          res.send(authenticationService.generateToken(user));
        }
        throw badRequestError('Invalid password');
      }
      throw notFoundError('User not found');
    })
    .catch(next);
};

/* exports.signIn = (req, res, next) => {
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        if (encryptionService.validatePasssword(req.body.password, user.password)) {
          res.send(authenticationService.generateToken(user));
        }
        next(badRequestError('Invalid password'));
      }
      next(notFoundError('User not found'));
    })
    .catch(err => {
      next(defaultError(err));
    });
};*/
