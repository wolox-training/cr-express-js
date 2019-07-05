const { defaultError, badRequestError, conflictError, notFoundError } = require('../errors');
const userModel = require('../models').user;
const encryptionService = require('../services/encryption');
const logger = require('.././logger');
const authenticationService = require('../services/authentication');

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
          password: encryptionService.encryptPassword(req.body.password)
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

exports.signIn = (req, res, next) => {
  userModel
    .findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        if (encryptionService.validatePasssword(req.body.password, user.password)) {
          res.send(authenticationService.generateToken(user));
        }
        next(badRequestError('Invalid password'));
      }
      next(notFoundError('User not found'));
    })
    .catch(err => {
      next(defaultError(err));
    });
};

exports.getAllUsers = (req, res, next) => {
  const { limit } = req.query;
  const { page } = req.query;
  const offset = (page - 1) * limit;
  userModel
    .findAll({ limit, offset, order: ['name'] })
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      next(defaultError(err));
    });
};
