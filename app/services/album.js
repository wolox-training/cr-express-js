const rp = require('request-promise');
const { albums_api } = require('../../config').api_services;
const { defaultError, badRequestError } = require('../errors');

const options = url => ({
  method: 'GET',
  uri: `${albums_api}${url}`,
  json: true
});

exports.getAllAlbums = () =>
  rp(options('albums'))
    .then(res => res)
    .catch(err => Promise.reject(defaultError(err.message)));

exports.getPhotosAlbum = id =>
  rp(options(`albums/${id}/photos`))
    .then(res => res)
    .catch(err => Promise.reject(defaultError(err.message)));

exports.getAlbumById = id =>
  rp(options(`albums/${id}`))
    .then(res => res)
    .catch(() => Promise.reject(badRequestError('invalid id')));
