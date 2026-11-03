import Contact from "../models/Contact.js";
import { sendContactEmail } from "../utils/sendEmail.js";

function generateEnquiryReference() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MK-ENQ-${year}-${rand}`;
}

// ➕ CREATE CONTACT (Public)
export const createContact = async (req, res) => {
  try {
    let { name, email, phone, inquiryType, message } = req.body;

    email = (email || "").toLowerCase().trim();
    inquiryType = (inquiryType || "").trim();
    message = (message || "").trim();

    if (!name || !email || !inquiryType || !message) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const enquiryReference = generateEnquiryReference();

    const contact = await Contact.create({
      enquiryReference,
      name,
      email,
      phone: phone || "",
      inquiryType,
      message,
      status: "New",
    });

    sendContactEmail(contact).catch((err) =>
      console.error("Email failed:", err)
    );

    res.status(201).json({
      message: "Your message has been sent successfully",
      enquiryReference,
      contact,
    });
  } catch (error) {
    console.error("🔥 CONTACT ERROR:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// 👑 ADMIN: GET ALL CUSTOMER ENQUIRIES
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer enquiries" });
  }
};

// 👑 ADMIN: UPDATE ENQUIRY STATUS / NOTES
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Enquiry not found" });
    }
    if (req.body.status !== undefined) contact.status = req.body.status;
    if (req.body.adminNotes !== undefined) {
      contact.adminNotes = req.body.adminNotes;
    }
    const saved = await contact.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to update enquiry" });
  }
};

// 👑 ADMIN: DELETE ENQUIRY
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Enquiry deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};
