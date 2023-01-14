import jwt from 'jsonwebtoken';

/**
 * This function checks if the given password and the
 * hashed strings are the same.
 *
 * @param {String} data
 */
export function generateWebToken(data) {
  return new Promise((resolve, reject) => {
    try {
      // Try if the signing works.
      const token = jwt.sign(JSON.stringify(data), process.env.JWT_SECRET);

      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * This function decodes the jwt token
 * and returns the payload.
 *
 * @param {String} token
 * @returns {Object}
 */
export function decodeWebToken(token) {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      resolve(decoded);
    } catch (e) {
      reject(e);
    }
  });
}