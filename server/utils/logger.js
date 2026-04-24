const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // 'info', 'error', 'debug', etc.
  transport: process.env.NODE_ENV !== 'production' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname', // Keeps output clean
        },
      }
    : undefined,
});

module.exports = logger;