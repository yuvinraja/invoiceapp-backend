import cors from 'cors';
import { env } from '../config/env';

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
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
    
    console.log('Request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('No origin, allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed');
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

export const corsMiddleware = cors(corsOptions);