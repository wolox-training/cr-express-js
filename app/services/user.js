const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const logger = require('.././logger');
const { admin_role } = require('../constants');

const calculateTotalPages = (count, limit) => {
  if (count === 0) {
    return 1;
  }
  return Math.ceil(count / limit);
};

exports.findAllPagination = paginationObject =>
  userModel
    .findAndCountAll({
      limit: paginationObject.limit,
      offset: paginationObject.offset,
      order: [[paginationObject.orderBy, paginationObject.order]]
    })
    .then(users => ({
      users,
      totalPages: calculateTotalPages(users.count, paginationObject.limit)
    }))
    .catch(error => {
      logger.info(error);
      throw databaseError(error);
    });

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
      password: user.password,
      role: user.role
    })
    .then(userCreated => {
      logger.info(`user with name ${userCreated.name} created!`);
      logger.info(JSON.stringify(userCreated));
      return userCreated;
    })
    .catch(error => {
      logger.info(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw conflictError('user already exists!');
      }
      throw databaseError(error);
    });

exports.updateOrCreate = user =>
  userModel
    .findOrCreate({
      where: { email: user.email },
      defaults: {
        name: user.name,
        lastName: user.lastName,
        password: user.password,
        role: admin_role
      }
    })
    .spread((userFound, userCreated) => {
      if (userFound) {
        return userFound.update({ role: admin_role });
      }
      return userCreated;
    })
    .catch(error => {
      logger.info(error);
      throw databaseError(error);
    });
