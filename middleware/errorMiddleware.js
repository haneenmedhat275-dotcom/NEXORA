const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.publicMessage || 'Server error';
  res.status(statusCode).json({ message });
};

module.exports = { errorHandler };
