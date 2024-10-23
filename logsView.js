import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from './path/to/logger.js'; // Adjust the path to your logger.js

const app = express();

// Define a route to access all logs
app.get('/logs', (req, res) => {
    const logDir = path.join(process.cwd(), 'logs');
    const combinedLogPath = path.join(logDir, 'combined.log');
    const errorLogPath = path.join(logDir, 'error.log');

    // Read combined log file
    fs.readFile(combinedLogPath, 'utf8', (err, combinedData) => {
        if (err) {
            logger.error(`Failed to read combined log: ${err.message}`);
            return res.status(500).send('Failed to read logs');
        }

        // Read error log file
        fs.readFile(errorLogPath, 'utf8', (err, errorData) => {
            if (err) {
                logger.error(`Failed to read error log: ${err.message}`);
                return res.status(500).send('Failed to read logs');
            }

            // Send both log contents as a response
            res.send(`
                <h1>Combined Log</h1>
                <pre>${combinedData}</pre>
                <h1>Error Log</h1>
                <pre>${errorData}</pre>
            `);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
