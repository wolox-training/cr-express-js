const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.bad_request_error = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.CONFLICT_ERROR = 'conflict_error';
exports.conflict_error = message => internalError(message, exports.CONFLICT_ERROR);
