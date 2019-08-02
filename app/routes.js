const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');
const userController = require('./controllers/user');
const userMiddleware = require('./middlewares/user');
const authenticationMiddleware = require('./middlewares/authentication');
const validatorErrorMiddleware = require('./middlewares/expressValidatorError');
const albumMiddleware = require('./middlewares/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAllAlbums);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
  app.post(
    '/users',
    [userMiddleware.validateSignup, validatorErrorMiddleware.validateError],
    userController.register
  );

  app.post(
    '/users/sessions',
    [userMiddleware.validateEmailPassword, validatorErrorMiddleware.validateError],
    userController.signIn
  );
  app.get(
    '/users',
    [
      authenticationMiddleware.verifyTokenFormat,
      userMiddleware.checkOrder,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken
    ],
    userController.getAllUsers
  );
  app.post(
    '/admin/users',
    [
      authenticationMiddleware.verifyTokenFormat,
      userMiddleware.validateSignup,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken,
      authenticationMiddleware.verifyAdminRole
    ],
    userController.registerAdmin
  );
  app.post(
    '/albums/:albumId',
    [
      authenticationMiddleware.verifyTokenFormat,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken,
      albumMiddleware.verifyAlbumId
    ],
    userController.buyAlbum
  );
  app.get(
    '/users/:userId/albums',
    [
      authenticationMiddleware.verifyTokenFormat,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken,
      userMiddleware.checkBoughtAlbumsPermission
    ],
    userController.listAlbumsUser
  );
  app.get(
    '/users/albums/:id/photos',
    [
      authenticationMiddleware.verifyTokenFormat,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken
    ],
    userController.listPhotosAlbumsBought
  );
  app.post(
    '/users/sessions/invalidate_all',
    [
      authenticationMiddleware.verifyTokenFormat,
      validatorErrorMiddleware.validateError,
      authenticationMiddleware.verifyToken
    ],
    userController.invalidateSessions
  );
};
