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
      if (user && encryptionService.validatePasssword(req.body.password, user.password)) {
        const token = authenticationService.generateToken(user);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.end();
      } else {
        throw badRequestError('sign in error');
      }
    })
    .catch(next);

exports.getAllUsers = (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const paginationParams = {
    limit,
    page,
    offset: (page - 1) * limit,
    orderBy: req.query.orderBy || 'email',
    order:
      req.query.order && (req.query.order.toUpperCase() === 'ASC' || req.query.order.toUpperCase() === 'DESC')
        ? req.query.order.toUpperCase()
        : 'ASC'
  };

  return userService
    .findAllPagination(paginationParams)
    .then(users => {
      users.totalPages = Math.ceil(users.count / limit);
      res.send(users);
    })
    .catch(next);
};
