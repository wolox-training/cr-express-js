const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const logger = require('.././logger');

exports.findAllPagination = (limit, offset, orderField) =>
  userModel
    .findAll({ limit, offset, order: [orderField] })
    .then(users => users)
    .catch(error => {
      logger.info(error);
      throw databaseError(error);
    });

exports.findOne = email =>
  userModel
    .findOne({ where: { email } })
    .then(user => user)
    .catch(error => {
      throw databaseError(error);
    });

exports.createUser = user =>
  userModel
    .create({
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      password: user.password,
      role: user.role
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

exports.updateUserRole = user =>
  user
    .save()
    .then(updatedUser => updatedUser)
    .catch(error => {
      throw databaseError(error);
    });
