const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');
const userController = require('./controllers/user');
const userMiddleware = require('./middlewares/user');
const authenticationMiddleware = require('./middlewares/authentication');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAllAlbums);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
  app.post(
    '/users',
    [userMiddleware.validateSignup(), userMiddleware.validateError],
    userController.register
  );

  app.post(
    '/users/sessions',
    [userMiddleware.validateSignin(), userMiddleware.validateError],
    userController.signIn
  );
  app.get('/users', [authenticationMiddleware.verifyToken], userController.getAllUsers);
  app.post(
    '/admin/users',
    [userMiddleware.validateSignup(), userMiddleware.validateError],
    userController.registerAdmin
  );
};
