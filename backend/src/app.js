import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import atsRouter from "./routes/ats.routes.js";
import jobRouter from "./routes/job.routes.js";
import roadmapRouter from "./routes/roadmap.routes.js";
import progressRouter from "./routes/progress.routes.js";
import adminRouter from "./routes/admin.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));// these are middleware jo r
//har request aa rahi hain unpe chalenge

app.use(express.urlencoded({ extended: true, limit: "16kb" }));//forms data extract

app.use(express.static("public"));

app.use(cookieParser());
app.use("/api/v1/health", healthcheckRouter);
app.use(errorHandler);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/ats", atsRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/roadmap", roadmapRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/admin",adminRouter);
export default app;
// Browser

// ↓

// GET /login

// ↓

// Route

// ↓

// Controller

// ↓

// Database

// ↓

// Error

// ↓

// asyncHandler

// ↓

// next(error)

// ↓

// Error Middleware

// ↓

// Client