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

dotenv.config();

const app = express();

// 🔌 Connect DB
connectDB();


// 🌍 CORS CONFIG (FIXED + CLEAN)
const allowedOrigins = [
  process.env.FRONTEND_URL, // from .env (Vercel frontend)
  "https://www.munchkinkittie.com",
  "https://munchkinkittie.com",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      // Match allowed origins
      if (allowedOrigins.some((o) => origin === o)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// 🧩 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 🔥 GLOBAL LOGGER (helps debugging on Railway)
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


// 🧪 Health Check Route (IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("API running...");
});


// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked this request" });
  }

  res.status(500).json({ error: "Server error" });
});


// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});