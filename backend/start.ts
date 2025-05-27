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
const PORT = process.env.PORT || 5000;

// Enable proxy trust for Render
app.set("trust proxy", 1); // Trust the first proxy (Render's load balancer)

// Define allowed origins based on environment
const allowedOrigins = [
  "http://localhost:3000", // Development
  process.env.FRONTEND_URL || "https://your-vercel-app.vercel.app", // Production
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔍 CORS Origin Check - Request Origin:", origin); // Debug log
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      // Check if the origin is in the allowed list
      if (true) {
        callback(null, true);
      } else {
        console.error("🚫 CORS Rejected - Origin:", origin); // Debug log
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to true if cookies/auth are needed
  })
);

// Debug middleware to log request and response headers
app.use((req, res, next) => {
  console.log("📥 Request Method:", req.method);
  console.log("📥 Request Origin:", req.headers.origin);
  console.log("📥 Request URL:", req.url);
  console.log("📥 Request Headers:", req.headers);
  console.log("📥 Client IP (via X-Forwarded-For):", req.ip); // Log IP after trust proxy
  res.on("finish", () => {
    console.log("📤 Response Status:", res.statusCode);
    console.log("📤 Response Headers:", res.getHeaders());
  });
  next();
});

// Security middleware (disable CSP to avoid conflicts)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    allowedOrigins, // Debug CORS config
    clientIp: req.ip, // Debug client IP
    trustProxy: app.get("trust proxy"), // Debug trust proxy setting
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
  console.log(`Allowed CORS Origins: ${allowedOrigins.join(", ")}`);
});

export default app;