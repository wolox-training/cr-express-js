const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.badRequestError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.CONFLICT_ERROR = 'conflict_error';
exports.conflictError = message => internalError(message, exports.CONFLICT_ERROR);

exports.NOT_FOUND_ERROR = 'not_found_error';
exports.notFoundError = message => internalError(message, exports.NOT_FOUND_ERROR);

exports.UNAUTHORIZED_ERROR = 'unauthorized_error';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED_ERROR);
