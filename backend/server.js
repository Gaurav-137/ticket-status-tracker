import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import ticketProgressionJob from './jobs/ticketProgression.js';
import cron from 'node-cron';

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Import routes
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const findAvailablePort = (startPort, maxAttempts = 10) => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const tryPort = (port) => {
            attempts++;
            console.log(`Attempting to use port ${port}...`);
            
            const server = app.listen(port, () => {
                const actualPort = server.address().port;
                server.close(() => {
                    console.log(`✅ Port ${actualPort} is available`);
                    resolve(actualPort);
                });
            });
            
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`❌ Port ${port} is in use, trying next port...`);
                    if (attempts >= maxAttempts) {
                        reject(new Error(`Could not find an available port after ${maxAttempts} attempts`));
                    } else {
                        tryPort(port + 1);
                    }
                } else {
                    reject(err);
                }
            });
        };
        
        tryPort(startPort);
    });
};

const startServer = async () => {
    try {
        const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
        console.log(`🚀 Starting server, looking for available port starting from ${defaultPort}...`);
        
        const PORT = await findAvailablePort(defaultPort);
        
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 API available at: http://localhost:${PORT}/api`);
            
            // Start the cron job
            ticketProgressionJob.start();
            console.log('⏰ Ticket progression job scheduled.');
            
            // Export the port for frontend to use
            process.env.SERVER_PORT = PORT.toString();
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
