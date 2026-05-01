import Application from "../models/Application.js";
import {
  sendApplicationReceived,
  sendApplicationApproved,
  sendApplicationRejected,
  sendApplicationAdminNotification,
} from "../utils/sendEmail.js";

// ➕ CREATE APPLICATION
export const createApplication = async (req, res) => {
  try {
    let {
      fullName,
      email,
      phone,
      location,
      paymentMethod,
      paymentMethodOther,
      applicationType,
      itemId,
      homeDescription,
      hasPets,
      experience,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !applicationType ||
      !homeDescription ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    email = email.toLowerCase().trim();
    const cleanedPaymentMethod = paymentMethod.toLowerCase();

    let modelMap = {
      kitten: "Kitten",
      retired: "RetiredKitten",
      upcoming: "Upcoming",
    };

    const application = await Application.create({
      fullName,
      email,
      phone,
      location,
      paymentMethod: cleanedPaymentMethod,
      paymentMethodOther:
        cleanedPaymentMethod === "other" ? paymentMethodOther : undefined,
      applicationType,
      itemId,
      applicationTypeModel: modelMap[applicationType],
      homeDescription,
      hasPets,
      experience,
    });

    // 🔍 Populate the referenced item (Kitten, RetiredKitten, or Upcoming)
    await application.populate("itemId");

    // Extract kitten name - adjust field name to match your models
    // Common fields: name, title, or breed. Use optional chaining.
    const kittenName =
      application.itemId?.name ||
      application.itemId?.title ||
      application.itemId?.breed ||
      "your selected companion";

    // 📧 Applicant confirmation – now includes kitten info
    sendApplicationReceived({
      email,
      name: fullName,
      paymentMethod: cleanedPaymentMethod,
      paymentMethodOther: paymentMethodOther || null,
      kittenName,
    });

    // 📧 Admin notification – now includes kitten info
    sendApplicationAdminNotification({
      fullName,
      email,
      phone,
      location,
      paymentMethod: cleanedPaymentMethod,
      paymentMethodOther,
      applicationType,
      homeDescription,
      hasPets,
      experience,
      kittenName,
    });

    res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }
    res.status(500).json({ error: "Failed to submit application" });
  }
};

// ... rest of the controller (unchanged) ...

// 🌍 ADMIN: GET ALL
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("itemId")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// 🔍 GET ONE
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("itemId");

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

// ✅ APPROVE
export const approveApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    app.status = "Approved";
    await app.save();

    sendApplicationApproved(app.email, app.fullName);

    res.json({ message: "Application approved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve" });
  }
};

// ❌ REJECT
export const rejectApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    app.status = "Rejected";
    await app.save();

    sendApplicationRejected(app.email, app.fullName);

    res.json({ message: "Application rejected" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject" });
  }
};

// ❌ DELETE
export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
};