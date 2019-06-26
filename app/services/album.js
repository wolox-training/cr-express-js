const https = require('https');
const url = 'https://jsonplaceholder.typicode.com/albums';

const getAll = () =>
  new Promise((resolve, reject) => {
    https.get(url, (res, err) => {
      if (res) {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          body = JSON.parse(body);
          resolve(body);
        });
      } else {
        reject(err);
      }
    });
  });

const getPhotosAlbum = id =>
  new Promise((resolve, reject) => {
    https.get(`${url}/${id}/photos`, (res, err) => {
      if (res) {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          body = JSON.parse(body);
          resolve(body);
        });
      } else {
        reject(err);
      }
    });
  });

module.exports = { getAll, getPhotosAlbum };
