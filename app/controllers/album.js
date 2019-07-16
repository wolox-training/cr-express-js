const albumService = require('../services/album');

exports.getAllAlbums = (_, res, next) =>
  albumService
    .getAllAlbums()
    .then(albums => res.send(albums))
    .catch(next);

exports.getPhotosAlbum = (req, res, next) => {
  const { id } = req.params;
  return albumService
    .getPhotosAlbum(id)
    .then(albums => {
      res.send(albums);
    })
    .catch(next);
};
