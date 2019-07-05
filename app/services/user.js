const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const logger = require('.././logger');

exports.findOne = email =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({ where: { email } })
      .then(user => {
        if (user) {
          reject(conflictError('user already exists!'));
        }
        resolve();
      })
      .catch(error => {
        logger.info(error);
        reject(databaseError(error));
      });
  });

exports.createUser = (email, name, lastName, password) =>
  userModel
    .create({
      name,
      lastName,
      email,
      password
    })
    .then(userCreated => {
      logger.info(`user with name ${userCreated.name} created!`);
      return userCreated;
    })
    .catch(error => {
      logger.info(error);
      return Promise.reject(databaseError(error));
    });
