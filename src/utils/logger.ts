type ErrorMessages = Array<unknown>;

export const logger = {
  error: (...args: ErrorMessages) => {
    if (process.env.NODE_ENV === "development") {
      console.error(...args);
    }
  },
  info: (...args: ErrorMessages) => {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  },
  warn: (...args: ErrorMessages) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },
};
