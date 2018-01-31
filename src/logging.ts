// A general, centrally handled logging mechanism
//
//-----------------------------------------------------------

import { getDateNow } from './helpers';

// Severity levels
const Severity = {
  Info: 'Info',
  Warning: 'Warning',
  Error: 'Error',
};

// ###Helper methods

// Log a verbose message with a datetime stamp and severity level
function logMessage(severity, message) {
  console.log('[' + getDateNow() + ']\t' + severity + ':\t' + message);
}

// Log a plain message with text only
function logMessagePlain(message) {
  console.log('[' + getDateNow() + ']\t' + message);
}

// ###Exported methods

// Standard way to log a plain message without any options
export const out = message => {
  logMessagePlain(message);
};

// Log a message with "Info" severity
export const logInfo = message => {
  logMessage(Severity.Info, message);
};

// Log a message with "Warning" severity
export const logWarning = message => {
  logMessage(Severity.Warning, message);
};

// Log a message with "Error" severity
export const logError = message => {
  logMessage(Severity.Error, message);
};
