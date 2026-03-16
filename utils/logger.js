const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, errors, colorize, printf } = format;

// Human readable formatting for console
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${level}: ${message} ${metaStr}`;
});

const logger = createLogger({
  defaultMeta: {
    service: 'the-social-network-blog-app',
    environment: process.env.NODE_ENV || 'development'
  },
  format: combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true }),
    json()
  ),
  transports: [

    // Console
    new transports.Console({
      level: 'debug',
      format: process.env.NODE_ENV === 'production'
        ? combine(timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), json())
        : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat)
    }),

    // Extenal file - error logs 
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),

    // Extenal file - admin logs 
    new transports.File({
      filename: 'logs/admin.log',
      level: 'warn'
    }),

    // Extenal file - info logs 
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info'
    })
  ]
});

module.exports = {logger};