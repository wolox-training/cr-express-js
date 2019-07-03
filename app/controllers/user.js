const { validationResult } = require('express-validator/check');
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);
const { databaseError, badRequestError, conflictError } = require('../errors');
const userModel = require('../models').user;
const encryptionService = require('../services/encryption').encryptPassword;

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    next(badRequestError(errors.array()));
  } else {
    userModel
      .findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          next(conflictError('user already exists!'));
        } else {
          userModel
            .create({
              name: req.body.name,
              lastName: req.body.lastName,
              email: req.body.email,
              password: encryptionService(req.body.password)
            })
            .then(userCreated => {
              console.log(`User with name ${userCreated.name} created!!`);
              res.send(userCreated);
            })
            .catch(error => {
              next(databaseError(error));
            });
        }
      })
      .catch(error => next(databaseError(error)));
  }
};
