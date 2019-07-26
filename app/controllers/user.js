const { badRequestError } = require('../errors');
const authenticationService = require('../services/authentication');
const encryptionService = require('../services/encryption');
const userService = require('../services/user');
const { ascOrder } = require('../constants');
const { defaultOrderBy } = require('../constants');
const authService = require('../services/authentication');
const { admin_role } = require('../constants').admin_role;
const albumService = require('../services/album');

const createUserObject = req => ({
  email: req.body.email,
  name: req.body.name,
  lastName: req.body.lastName,
  password: encryptionService.encryptPassword(req.body.password)
});

exports.register = (req, res, next) => {
  const user = createUserObject(req);
  return userService
    .createUser(user)
    .then(userCreated => {
      res.status(201).send(userCreated);
    })
    .catch(next);
};

exports.registerAdmin = (req, res, next) => {
  const user = createUserObject(req);
  return userService
    .updateOrCreateAdmin(user)
    .then(savedUser => {
      res.send(savedUser);
    })
    .catch(next);
};

exports.signIn = (req, res, next) =>
  userService
    .findOne({ email: req.body.email })
    .then(userFound => {
      if (userFound && encryptionService.validatePasssword(req.body.password, userFound.password)) {
        const token = authenticationService.generateToken(userFound);
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
      res.send(users);
    })
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const user = authService.decodeToken(req.headers.authorization);
  return userService
    .buyAlbum(user, req.params.id)
    .then(purchase => {
      res.send({ user: user.email, albumId: purchase.albumId });
    })
    .catch(next);
};

exports.listAlbumsUserOrUsers = (req, res, next) => {
  const user = authService.decodeToken(req.headers.authorization);
  let keyValue = {};
  if (user.role === admin_role) {
    keyValue = { user_id: req.params.user_id };
  }
  return userService
    .findAlbums(keyValue)
    .then(userAlbums => {
      const albums = [];
      userAlbums.forEach(userAlbum => {
        albumService.getAlbumById(userAlbum.albumId).then(album => {
          albums.push(album);
        });
      });
      res.send(albums);
    })
    .catch(next);
};
