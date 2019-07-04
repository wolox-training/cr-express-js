const { conflictError, defaultError } = require('../errors');
const userModel = require('../models').user;
const encryptionService = require('../services/encryption').encryptPassword;
const logger = require('.././logger');

exports.register = (req, res, next) =>
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        return next(conflictError('user already exists!'));
      }
      return userModel
        .create({
          name: req.body.name,
          lastName: req.body.lastName,
          email: req.body.email,
          password: encryptionService(req.body.password)
        })
        .then(userCreated => {
          logger.info(`User with name ${userCreated.name} created!!`);
          res.send(userCreated);
        })
        .catch(error => {
          next(defaultError(error));
        });
    })
    .catch(error => {
      next(defaultError(error));
    });
