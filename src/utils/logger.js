
export const logInfo = (message, data = null) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
};

export const logError = (message, error = null) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
};

export const logWarning = (message, data = null) => {
  console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`, data || '');
};

export const logDebug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
  }
};