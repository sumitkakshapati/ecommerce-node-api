import buildError from '../utils/buildError.js';

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export function genericErrorHandler(err, req, res, next) {
    const error = buildError(err);
  
    res.status(error.code).json({ error });
  }