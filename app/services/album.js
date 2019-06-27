const rp = require('request-promise');
const url = process.env.JSONPlaceholder_API.toString();

const getAllAlbums = () =>
  new Promise((resolve, reject) => {
    rp(`${url}albums`)
      .then(res => resolve(JSON.parse(res)))
      .catch(err => {
        reject(err);
      });
  });

const getPhotosAlbum = id =>
  new Promise((resolve, reject) => {
    rp(`${url}albums/${id}/photos`)
      .then(res => resolve(JSON.parse(res)))
      .catch(err => {
        reject(err);
      });
  });

module.exports = { getAllAlbums, getPhotosAlbum };
