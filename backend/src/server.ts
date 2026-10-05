import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.ts';
import redisClient from './cache/redis.ts';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.ts';
import userRoutes from './routes/user.route.ts';
import apiKeyRoutes from './routes/apiKey.route.ts';
import queryRoutes from './routes/query.route.ts';
import metricsRoutes from './routes/metrics.route.ts';
import adminRoutes from './routes/admin.route.ts';
import { globalRateLimiter } from './middleware/rateLimiter.ts';

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
