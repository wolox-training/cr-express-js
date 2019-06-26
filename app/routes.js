// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAll);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
