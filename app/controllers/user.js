const { validationResult } = require('express-validator/check');
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);
const { databaseError, badRequestError, conflictError } = require('../errors');
const userModel = require('../models').user;
const encryptionService = require('../services/encryption').encryptPassword;
const logger = require('.././logger');

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    return next(badRequestError(errors.array()));
  }
  return userModel
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
          next(databaseError(error));
        });
    })
    .catch(error => next(databaseError(error)));
};
