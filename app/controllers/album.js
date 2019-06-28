const albumService = require('../services/album');

const getAll = (req, res) => {
  albumService
    .getAll()
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(error => {
      throw error;
    });
};

const getPhotosAlbum = (req, res) => {
  const { id } = req.params;

  albumService
    .getPhotosAlbum(id)
    .then(albums => {
      if (albums) {
        res.status(200).send(albums);
      } else {
        res.status(404).send('NOT FOUND');
      }
    })
    .catch(error => {
      throw error;
    });
};

module.exports = { getAll, getPhotosAlbum };
