const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');
const userController = require('./controllers/user');
const userMiddleware = require('./middlewares/user');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAll);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
  app.post('/users', userMiddleware.validateSignup(), userController.register);
};
