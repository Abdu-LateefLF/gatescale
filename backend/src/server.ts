import express from 'express';
import authRoutes from './routes/auth.route';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use(errorHandler);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const shutdown = () => {
    console.log('Shutting down server...');
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);