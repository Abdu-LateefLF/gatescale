import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import redisClient from './cache/redis.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import apiKeyRoutes from './routes/apiKey.route.js';
import queryRoutes from './routes/query.route.js';
import metricsRoutes from './routes/metrics.route.js';
import adminRoutes from './routes/admin.route.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
} else {
    app.set('trust proxy', parseInt(process.env.TRUST_PROXY || '1'));
}

const clientUrl = process.env.CLIENT_URL;
if (clientUrl) {
    console.log('Configuring CORS for ', clientUrl);
    app.use(
        cors({
            origin: clientUrl,
            credentials: true,
            exposedHeaders: [
                'X-RateLimit-Limit',
                'X-RateLimit-Remaining',
                'X-RateLimit-Reset',
            ],
        })
    );
    app.options('/{*path}', cors());
}

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', globalRateLimiter, authRoutes);
app.use('/users', globalRateLimiter, userRoutes);
app.use('/api-keys', globalRateLimiter, apiKeyRoutes);
app.use('/query', queryRoutes);
app.use('/metrics', globalRateLimiter, metricsRoutes);
app.use('/admin/metrics', globalRateLimiter, adminRoutes);

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
