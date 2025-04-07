import pino from "pino";

export const logger = pino({
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    },
  },
});
