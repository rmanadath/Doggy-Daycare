/**
 * Validates email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password 
 * @returns {object} { isValid, errors }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates price format
 * @param {number} price 
 * @returns {boolean}
 */
export const isValidPrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

/**
 * Validates UUID format
 * @param {string} id 
 * @returns {boolean}
 */
export const isValidUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Sanitizes string input (removes extra whitespace)
 * @param {string} str 
 * @returns {string}
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' ');
};