const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const logger = require('.././logger');

exports.findOne = keyValues =>
  userModel.findOne({ where: keyValues }).catch(error => {
    throw databaseError(error);
  });

exports.createUser = user =>
  userModel
    .create({
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      password: user.password
    })
    .then(userCreated => {
      logger.info(`user with name ${userCreated.name} created!`);
      return userCreated;
    })
    .catch(error => {
      logger.info(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw conflictError('user already exists!');
      }
      throw databaseError(error);
    });
