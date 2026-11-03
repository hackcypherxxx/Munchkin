import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// 🔥 wipe old admin
await Admin.deleteMany({});

const plainPassword = "admin123";

const hashedPassword = await bcrypt.hash(plainPassword, 10);

console.log("NEW HASH:", hashedPassword);

await Admin.create({
  email: process.env.ADMIN_EMAIL || "info@munchkinkittie.com",
  password: hashedPassword,
});

console.log("✅ Admin reset with password:", plainPassword);

process.exit();