const { databaseError } = require('../errors');
const logger = require('.././logger');

exports.handleError = error => {
  logger.info(error);
  databaseError(error);
};
