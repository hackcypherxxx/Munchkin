import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import kittenRoutes from "./routes/kittenRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import upcomingRoutes from "./routes/upcomingRoutes.js";
import retiredRoutes from "./routes/retiredRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { ensureDefaultEmailTemplates } from "./utils/sendEmail.js";

dotenv.config();

const app = express();

// 🔌 Connect DB & Seed Default Email Templates
connectDB().then(() => {
  ensureDefaultEmailTemplates().catch(() => {});
});

// 🌍 CORS CONFIG
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://www.munchkinkittie.com",
  "https://munchkinkittie.com",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some((o) => origin === o) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 🧩 Middleware
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 🔥 GLOBAL LOGGER
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/kittens", kittenRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upcoming", upcomingRoutes);
app.use("/api/retired", retiredRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/emails", emailRoutes);

// 🧪 Health Check Route
app.get("/", (req, res) => {
  res.send("API running...");
});

// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked this request" });
  }

  res.status(500).json({ error: err.message || "Server error" });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
