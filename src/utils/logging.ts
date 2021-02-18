import { getDateNow } from './helpers';

type Severity = 'Info' | 'Warning' | 'Error';

const logMessage = (severity: Severity) => (message: string) =>
  console.log(`[${getDateNow()}]\t${severity}:\t${message}`);

const logMessagePlain = (message: string) =>
  console.log(`[${getDateNow()}]\t${message}`);

export const logMsg = logMessagePlain;
export const logInfo = logMessage('Info');
export const logWarning = logMessage('Warning');
export const logError = logMessage('Error');
