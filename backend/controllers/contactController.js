import Contact from "../models/Contact.js";
import { sendContactEmail } from "../utils/sendEmail.js";


// ➕ CREATE CONTACT
export const createContact = async (req, res) => {
  try {
    console.log("📩 BODY RECEIVED:", req.body);

    let { name, email, inquiryType, message } = req.body;

    // normalize + fallback
    email = (email || "").toLowerCase().trim();
    inquiryType = (inquiryType || "").trim();
    message = (message || "").trim();

    // validation
    if (!name || !email || !inquiryType || !message) {
      console.log("❌ Missing fields:", {
        name,
        email,
        inquiryType,
        message,
      });

      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // save to DB
    const contact = await Contact.create({
      name, // ✅ FIXED
      email,
      inquiryType,
      message,
    });

    console.log("✅ Contact saved:", contact._id);

    // 📧 send email (non-blocking)
    sendContactEmail(contact).catch((err) =>
      console.error("Email failed:", err)
    );

    res.status(201).json({
      message: "Your message has been sent successfully",
    });

  } catch (error) {
    console.error("🔥 CONTACT ERROR:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};