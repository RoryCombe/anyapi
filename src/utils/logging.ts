import { getDateNow } from './helpers';

type Severity = 'Info' | 'Warning' | 'Error';

const log = (str: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(str);
  }
};

const logMessage = (severity: Severity) => (message: string) =>
  log(`[${getDateNow()}]\t${severity}:\t${message}`);

const logMessagePlain = (message: string) =>
  log(`[${getDateNow()}]\t${message}`);

export const logMsg = logMessagePlain;
export const logInfo = logMessage('Info');
export const logWarning = logMessage('Warning');
export const logError = logMessage('Error');
