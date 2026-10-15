import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { config } from './config/env';

const app = express();

// Security and middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible integration in dev/testing
}));

app.use(cors({
  origin: '*', // Allow local frontend and test origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-id', 'x-user-email', 'x-user-name'],
}));

app.use(express.json());
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Mount REST APIs
app.use('/api', apiRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'TeamPulse Intelligence API',
    status: 'online',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use(errorHandler);

export default app;
