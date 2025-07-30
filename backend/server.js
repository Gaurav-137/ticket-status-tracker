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


import getPort from 'get-port';

const startServer = async () => {
    const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    const PORT = await getPort({ port: defaultPort });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // Start the cron job
        ticketProgressionJob.start();
        console.log('Ticket progression job scheduled.');
    });
};

startServer();
