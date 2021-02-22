import chalk from 'chalk';
import figlet from 'figlet';
import { getDateNow } from './helpers';

type Severity = 'Info' | 'Warning' | 'Error';

const log = (str: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(str);
  }
};

const chalkColour = (severity: Severity) =>
  ({
    Info: chalk.white,
    Warning: chalk.yellow,
    Error: chalk.red,
  }[severity]);

const logMessage = (severity: Severity) => (message: string) =>
  log(chalkColour(severity)(`[${getDateNow()}]\t${severity}:\t${message}`));

const logMessagePlain = (message: string) =>
  log(chalkColour('Info')(`[${getDateNow()}]\t${message}`));

export const logMsg = logMessagePlain;
export const logInfo = logMessage('Info');
export const logWarning = logMessage('Warning');
export const logError = logMessage('Error');

export const logHeader = (str: string) =>
  console.log(
    `${chalk.blueBright(figlet.textSync(str))}\n\nVersion ${
      process.env.npm_package_version
    }\n`
  );
