import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./db/connection";
import leadRoutes from "./routes/leadRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 10000
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// Handle preflight OPTIONS requests for all routes
app.options("*", cors());
// CORS configuration (allow all origins, methods, and headers)
app.use(cors());


// Security middleware (disable CSP to avoid conflicts)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later",
  },
});
app.use(limiter);

// Debug middleware to log request and response headers
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("Response Headers:", res.getHeaders());
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/leads", leadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
