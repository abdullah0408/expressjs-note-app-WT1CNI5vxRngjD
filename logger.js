// logger.js
import winston from 'winston';
import path from 'path';

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        winston.format.json() // Log in JSON format
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ 
            filename: path.join(process.cwd(), 'logs', 'error.log'), 
            level: 'error' // Only log error messages to this file
        }),
        new winston.transports.File({ 
            filename: path.join(process.cwd(), 'logs', 'combined.log') // Log all messages to this file
        })
    ]
});

// Create logs directory if it doesn't exist
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Export the logger
export default logger;
