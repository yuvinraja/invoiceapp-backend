// Express app configuration
// This file sets up the Express application with middleware and routes.
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import statsRoutes from "./routes/statsRoutes";

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Invoice App API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

export default app;
