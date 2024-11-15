import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { register } from './utils/metrics';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/error';
import env from './config/env';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
// Import other routes...

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(rateLimiter);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Use other routes...

// Error handling
app.use(errorHandler);

const port = parseInt(env.PORT);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});