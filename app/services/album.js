const rp = require('request-promise');
const { albums_api } = require('../../config').api_services;
const { defaultError } = require('../errors');

const getAllAlbums = () =>
  rp(`${albums_api}albums`)
    .then(res => JSON.parse(res))
    .catch(err => Promise.reject(defaultError(err.message)));

const getPhotosAlbum = id =>
  rp(`${albums_api}albums/${id}/photos`)
    .then(res => JSON.parse(res))
    .catch(err => Promise.reject(defaultError(err.message)));

module.exports = { getAllAlbums, getPhotosAlbum };
