const { conflictError, databaseError } = require('../errors');
const userModel = require('../models').user;
const userAlbumModel = require('../models').user_album;
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
  user.save().catch(error => {
    logger.info(error);
    throw databaseError(error);
  });

exports.buyAlbum = (user, album) =>
  userAlbumModel
    .create({
      userId: user.id,
      albumId: album.id
    })
    .then(purchase => {
      logger.info(`album ${purchase.albumId} bought by userid ${purchase.userId}`);
      return purchase;
    })
    .catch(error => {
      logger.info(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw conflictError('user has already bought this album!');
      }
      throw databaseError(error);
    });
