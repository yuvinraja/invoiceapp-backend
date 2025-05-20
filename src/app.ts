// Express app configuration
// This file sets up the Express application with middleware and routes.
import express from 'express';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//Routes
app.get('/', (req, res) => {
  res.send("Welcome to the Todo App API");
});

export default app;