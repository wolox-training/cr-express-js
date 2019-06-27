const { healthCheck } = require('./controllers/healthCheck');
const albumController = require('./controllers/album');
const userController = require('./controllers/user');
const { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAll);
  app.get('/albums/:id/photos', albumController.getPhotosAlbum);
  app.post(
    '/users',
    [
      check('name', 'invalid name')
        .not()
        .isEmpty(),
      check('lastname', 'invalid lastname')
        .not()
        .isEmpty(),
      check('email', 'Invalid email')
        .isEmail()
        .custom(value => {
          aux = value.substr(value.indexOf('@') + 1);
          aux = aux.substr(0, aux.indexOf('.'));
          return aux === 'wolox';
        })
        .not()
        .isEmpty(),
      check('password', 'invalid password')
        .isLength({ min: 8 })
        .isAlphanumeric()
    ],
    userController.register
  );
};
