const { databaseError } = require('../errors');

exports.handleError = error => databaseError(error);
