const albumService = require('../services/album');
const { badRequestError } = require('../errors');

exports.verifyAlbumId = (req, res, next) =>
  albumService
    .getAlbumById(req.params.albumId)
    .then(album => {
      if (album) {
        return next();
      }
      return next(badRequestError('invalid album id'));
    })
    .catch(next);
