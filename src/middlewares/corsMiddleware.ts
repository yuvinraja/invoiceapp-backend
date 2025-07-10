import cors from 'cors';
import { env } from '../config/env';

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',  // Local development
    'http://localhost:3001',  // Alternative local port
    'http://127.0.0.1:3000',  // Alternative localhost
  ];

  // Add frontend URL from environment
  if (env.FRONTEND_URL) {
    origins.push(env.FRONTEND_URL);
  }

  // Add additional origins if specified
  if (env.ALLOWED_ORIGINS) {
    const additionalOrigins = env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    origins.push(...additionalOrigins);
  }

  return origins;
};

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', ],
  optionsSuccessStatus: 204, // For legacy browser support
};

export const corsMiddleware = cors(corsOptions);