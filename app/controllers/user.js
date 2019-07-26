const { badRequestError } = require('../errors');
const authenticationService = require('../services/authentication');
const encryptionService = require('../services/encryption');
const userService = require('../services/user');
const { ascOrder } = require('../constants');
const { defaultOrderBy } = require('../constants');
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

exports.buyAlbum = (req, res, next) =>
  userService
    .buyAlbum(req.userPayload, req.params.id)
    .then(purchase => {
      res.send({ user: req.userPayload.email, albumId: purchase.albumId });
    })
    .catch(next);

exports.listAlbumsUserOrUsers = (req, res, next) => {
  const keyValue = { userId: req.params.user_id };

  const getAlbums = userAlbums => {
    const albumsData = [];
    for (const userAlbum of userAlbums) {
      albumsData.push(albumService.getAlbumById(userAlbum.albumId));
    }
    return Promise.all(albumsData);
  };
  return userService
    .findBoughtAlbums(keyValue)
    .then(boughtAlbums => {
      getAlbums(boughtAlbums).then(albumsData => {
        res.send({ albumsData });
      });
    })
    .catch(next);
};
