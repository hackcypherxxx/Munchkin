import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const loginAdmin = async (req, res) => {
  try {
    // 🔥 DEBUG BODY
    console.log("BODY RECEIVED:", req.body);

    let { email, password } = req.body;

    // validation
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // normalize email
    email = email.toLowerCase().trim();
    console.log("Normalized email:", email);

    // find admin
    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin);

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate token
    const token = generateToken(admin);

    console.log("✅ LOGIN SUCCESS");

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
};