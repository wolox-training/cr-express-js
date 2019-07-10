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

exports.getAllUsers = (req, res, next) => {
  // const limit = req.query.limit || 10;
  // const page = req.query.page || 1;
  // const offset = (page - 1) * limit;
  /* userModel
    .findAll({ limit, offset, order: ['name'] })
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      next(defaultError(err));
    });*/
  res.send('');
  next();
};
