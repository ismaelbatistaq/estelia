import winston from 'winston';
import env from '../config/env';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  );
  logger.add(new winston.transports.File({ filename: 'combined.log' }));
}

export { logger };