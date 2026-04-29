import Application from "../models/Application.js";
import {
  sendApplicationReceived,
  sendApplicationApproved,
  sendApplicationRejected,
} from "../utils/sendEmail.js";


// ➕ CREATE APPLICATION
export const createApplication = async (req, res) => {
  try {
    let {
      fullName,
      email,
      phone,
      location,
      applicationType,
      itemId,
      homeDescription,
      hasPets,
      experience,
    } = req.body;

    if (!fullName || !email || !applicationType || !homeDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    email = email.toLowerCase().trim();

    // 🔥 map model dynamically
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
      applicationType,
      itemId,
      applicationTypeModel: modelMap[applicationType],
      homeDescription,
      hasPets,
      experience,
    });

    // 📧 send confirmation
    sendApplicationReceived(email, fullName);

    res.status(201).json({
      message: "Application submitted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};


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