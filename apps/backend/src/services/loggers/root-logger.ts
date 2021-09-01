import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

// Declare root log transports
const rootTransports = [];
const rootTransportsForExpections = [];

// If enabled, adds Console transport
if (process.env.LOG_CONSOLE_ENABLED === 'true') {
  const consoleTransport = new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  });
  // Console logs everything
  rootTransports.push(consoleTransport);
  rootTransportsForExpections.push(consoleTransport);
}

// If enabled, push logs to files
const logFolder = process.env.LOG_DIR;
if (typeof logFolder === 'string') {
  // Ensure log folder is created
  fs.mkdirSync(logFolder, { recursive: true });

  // Pipe all logs to server.log file
  rootTransports.push(
    new transports.File({
      filename: path.join(logFolder,'app.log'),
      format: format.combine(format.timestamp(), format.json())
    })
  );

  rootTransportsForExpections.push(
    new transports.File({
      filename: path.join(logFolder,'expection.log'),
      format: format.combine(format.timestamp(), format.json())
    })
  );
}

/**
 * Root logger for the application
 */
export const rootLogger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  exitOnError: false,
  transports: [...rootTransports],
  exceptionHandlers: [...rootTransports]
});
