const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAllAlbums);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
};
