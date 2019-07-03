const rp = require('request-promise');
const { albums_api } = require('../../config').api_services;
const { defaultError } = require('../errors');

const options = url => ({
  method: 'GET',
  uri: `${albums_api}${url}`,
  json: true
});

const getAllAlbums = () =>
  rp(options('albums'))
    .then(res => res)
    .catch(err => Promise.reject(defaultError(err.message)));

const getPhotosAlbum = id =>
  rp(options(`albums/${id}/photos`))
    .then(res => res)
    .catch(err => Promise.reject(defaultError(err.message)));

module.exports = { getAllAlbums, getPhotosAlbum };
