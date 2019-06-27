const albumService = require('../services/album');

exports.getAllAlbums = (req, res, next) =>
  albumService
    .getAllAlbums()
    .then(albums => res.send(albums))
    .catch(next);

exports.getPhotosAlbum = (req, res, next) => {
  const { id } = req.params;
  return albumService
    .getPhotosAlbum(id)
    .then(albums => {
      if (albums) {
        res.send(albums);
      } else {
        next(new Error('NOT FOUND'));
      }
    })
    .catch(next);
};
