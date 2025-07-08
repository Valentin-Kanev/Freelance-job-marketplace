import pino from "pino";

// export const logger = pino({
//   formatters: {
//     level: (label: string) => {
//       return { level: label.toUpperCase() };
//     },
//   },
//   transport: {
//     target: "pino-pretty",
//     options: {
//       colorize: true,
//       translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
//     },
//   },
// });

const logLevel = process.env.LOG_LEVEL || "info";

const redactFields = [
  "req.headers.authorization",
  "req.body.password",
  "req.body.token",
  "user.password",
  "user.token",
];

export const logger = pino({
  level: logLevel,
  redact: {
    paths: redactFields,
    censor: "[REDACTED]",
  },
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    },
  },
});

export function getLoggerWithContext(context: Record<string, any>) {
  return logger.child(context);
}
