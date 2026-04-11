import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
import redisClient from './config/redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import apiKeyRoutes from './routes/apiKey.route';
import financeRoutes from './routes/finance.route';

const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
    app.use(
        cors({
            origin: process.env.CLIENT_URL,
            credentials: true,
        })
    );
}

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/finance', financeRoutes);

// Error handling
app.use(errorHandler);

app.listen(9000, () => {
    console.log('Server is running on port 9000');
});

const shutdown = () => {
    console.log('Shutting down server...');
    redisClient.quit();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
