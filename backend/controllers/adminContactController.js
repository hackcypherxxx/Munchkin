import { sendAdminEmail } from "../utils/sendEmail.js";

// 👑 ADMIN SEND EMAIL
export const sendAdminMessage = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await sendAdminEmail({ to, subject, message });

    res.json({
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};