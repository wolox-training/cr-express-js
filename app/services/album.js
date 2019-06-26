const https = require('https');
const url = 'https://jsonplaceholder.typicode.com/albums';


let getAll = () => {
    return new Promise((resolve, reject) => {
        https.get(url, (res, err) => {
            if (res) {
                res.setEncoding('utf8');
                let body = '';
                res.on('data', data => {
                    body += data;
                });
                res.on('end', () => {
                    body = JSON.parse(body);
                    //console.log(body);       
                    resolve(body);
                });
            } else {
                reject(new Error('Not Found'));
            }
        });
    });
}

let getPhotosAlbum = (id) => {
    return new Promise((resolve, reject) => {
        https.get(`${url}/${id}/photos`, (res) => {
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
                reject();
            }
        });
    });
}

module.exports = { getAll, getPhotosAlbum }