const { badRequestError } = require('../errors');
const authenticationService = require('../services/authentication');
const encryptionService = require('../services/encryption');
const userService = require('../services/user');
const { ascOrder } = require('../constants');
const { defaultOrderBy } = require('../constants');
const { admin_role } = require('../../config').roles;
const { regular_role } = require('../../config').roles;
const albumService = require('../services/album');
const authService = require('../services/authentication');

const createUserObject = req => ({
  email: req.body.email,
  name: req.body.name,
  lastName: req.body.lastName,
  password: encryptionService.encryptPassword(req.body.password)
});

exports.register = (req, res, next) => {
  const user = createUserObject(req);
  user.role = regular_role;
  return userService
    .createUser(user)
    .then(userCreated => {
      res.status(201).send(userCreated);
    })
    .catch(next);
};

exports.registerAdmin = (req, res, next) => {
  const user = createUserObject(req);
  user.role = admin_role;
  userService
    .findOne({ email: user.email })
    .then(usr => {
      if (usr) {
        usr.role = admin_role;
        userService.updateUserRole(usr).then(updatedUser => {
          res.send(200, updatedUser);
        });
      } else {
        userService.createUser(user).then(createdUser => {
          res.send(201, createdUser);
        });
      }
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
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const paginationParams = {
    limit,
    page,
    offset: (page - 1) * limit,
    orderBy: req.query.orderBy || defaultOrderBy,
    order: req.query.order || ascOrder
  };
  return userService
    .findAllPagination(paginationParams)
    .then(users => {
      res.send({ users: users.users, totalPages: users.totalPages });
    })
    .catch(next);
};

exports.buyAlbum = (req, res, next) =>
  albumService
    .getAlbumById(req.params.id)
    .then(album => {
      const user = authService.decodeToken(req.headers.authorization.split(' ')[1]);
      return userService.buyAlbum(user, album).then(purchase => {
        res.send(purchase);
      });
    })
    .catch(next);
