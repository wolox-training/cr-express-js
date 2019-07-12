const { badRequestError } = require('../errors');
const authenticationService = require('../services/authentication');
const encryptionService = require('../services/encryption');
const userService = require('../services/user');

exports.register = (req, res, next) => {
  const user = {
    email: req.body.email,
    name: req.body.name,
    lastName: req.body.lastName,
    password: encryptionService.encryptPassword(req.body.password)
  };
  return userService
    .createUser(user)
    .then(userCreated => {
      res.status(201).send(userCreated);
    })
    .catch(next);
};

exports.signIn = (req, res, next) =>
  userService
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        if (encryptionService.validatePasssword(req.body.password, user.password)) {
          res.writeHead(200, { token: authenticationService.generateToken(user) });
          return res.end();
        }
      }
      throw badRequestError('sign in error');
    })
    .catch(next);

exports.getAllUsers = (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const orderBy = req.query.orderBy || 'name';
  return userService
    .findAllPagination(limit, offset, orderBy)
    .then(users => {
      res.send(users);
    })
    .catch(next);
};
