const NAME_INFO = "\x1b[34m[SERVER]\x1b[0m";
const NAME_ERROR = "\x1b[31m[SERVER]\x1b[0m";

class Logger {
  static logError(message: string, error?: Error | unknown): void {
    message = `\x1b[31m${message}\x1b[0m`;
    console.error(NAME_ERROR, message, error);
  }

  static logInfo(message: string, ...other: (string | Error)[]): void {
    message = `\x1b[36m${message}\x1b[0m`;
    console.log(NAME_INFO, message, ...other);
  }
}

export default Logger;
