const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const logger = require('.././logger');

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
      totalPages: calculateTotalPages(users.count, paginationObject.limite),
      limit: Number(paginationObject.limit),
      order: paginationObject.order,
      page: Number(paginationObject.page)
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
