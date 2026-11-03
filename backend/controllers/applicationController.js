import mongoose from "mongoose";
import Application from "../models/Application.js";
import {
  sendApplicationReceived,
  sendApplicationApproved,
  sendApplicationRejected,
  sendApplicationAdminNotification,
  sendApplicationStatusEmail,
} from "../utils/sendEmail.js";

function generateApplicationReference() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timePart = Date.now().toString(36).slice(-3).toUpperCase();
  return `MK-APP-${year}-${rand}${timePart}`;
}

// ➕ CREATE APPLICATION (Public)
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
    const cleanedPaymentMethod = paymentMethod.toLowerCase().trim();

    const safeItemId =
      itemId && mongoose.Types.ObjectId.isValid(String(itemId))
        ? String(itemId)
        : null;

    // Duplicate submission protection (within 2 minutes for same email + itemId)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existingRecent = await Application.findOne({
      email,
      applicationType,
      itemId: safeItemId,
      createdAt: { $gte: twoMinutesAgo },
    });

    if (existingRecent) {
      return res.status(200).json({
        message: "Application already received",
        duplicatePrevented: true,
        applicationReference: existingRecent.applicationReference,
        application: existingRecent,
      });
    }

    const modelMap = {
      kitten: "Kitten",
      retired: "RetiredKitten",
      upcoming: "Upcoming",
    };

    const applicationReference = generateApplicationReference();

    const application = await Application.create({
      applicationReference,
      fullName,
      email,
      phone,
      location,
      paymentMethod: cleanedPaymentMethod,
      paymentMethodOther:
        cleanedPaymentMethod === "other" ? paymentMethodOther : undefined,
      applicationType,
      itemId: safeItemId,
      applicationTypeModel: modelMap[applicationType],
      homeDescription,
      hasPets,
      experience,
      status: "New",
      statusHistory: [
        {
          status: "New",
          changedAt: new Date(),
          note: "Application submitted via online concierge portal",
        },
      ],
    });

    let kittenName = "your selected companion";
    if (application.itemId) {
      await application.populate("itemId");
      kittenName =
        application.itemId?.name ||
        application.itemId?.title ||
        application.itemId?.breed ||
        "your selected companion";

      application.kittenSnapshot = {
        name: kittenName,
        breed: application.itemId?.breed || "",
        price: Number(application.itemId?.price) || 0,
        image:
          application.itemId?.images?.[0] ||
          application.itemId?.image ||
          "",
      };
      await application.save();
    }

    // Non-blocking transactional emails (automatically logged in EmailLog)
    sendApplicationReceived({
      email,
      name: fullName,
      paymentMethod: cleanedPaymentMethod,
      paymentMethodOther: paymentMethodOther || null,
      kittenName,
      applicationReference,
      applicationId: application._id,
    }).catch((err) => console.error("Applicant email failed:", err));

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
      applicationReference,
      applicationId: application._id,
    }).catch((err) => console.error("Admin notification failed:", err));

    res.status(201).json({
      message: "Application submitted successfully",
      applicationReference,
      application,
    });
  } catch (error) {
    console.error("❌ CREATE APPLICATION ERROR:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid reference ID" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }

    res.status(500).json({ error: "Failed to submit application" });
  }
};

// 👑 ADMIN: GET ALL APPLICATIONS
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("itemId")
      .sort({ createdAt: -1 });

    // Ensure older records without applicationReference still display a deterministic reference
    const enriched = apps.map((doc) => {
      const obj = doc.toObject();
      if (!obj.applicationReference) {
        obj.applicationReference = `MK-APP-${String(obj._id)
          .slice(-6)
          .toUpperCase()}`;
      }
      return obj;
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// 🔍 GET ONE APPLICATION
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

// 🔄 PUT /api/applications/:id/status (Admin Status & Notes Update)
export const updateApplicationStatus = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("itemId");
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    const {
      status,
      adminNotes,
      note = "",
      sendEmailNotification = true,
    } = req.body;

    const previousStatus = app.status;

    if (adminNotes !== undefined) {
      app.adminNotes = adminNotes;
    }

    if (status && status !== previousStatus) {
      app.status = status;
      app.statusHistory.push({
        status,
        changedAt: new Date(),
        note: note || `Status updated from ${previousStatus} to ${status}`,
      });
    }

    if (!app.applicationReference) {
      app.applicationReference = `MK-APP-${String(app._id)
        .slice(-6)
        .toUpperCase()}`;
    }

    await app.save();

    if (sendEmailNotification && status && status !== previousStatus) {
      sendApplicationStatusEmail({
        application: app,
        newStatus: status,
        customNote: note,
      }).catch((err) =>
        console.error("Application status email failed:", err)
      );
    }

    res.json({
      message: `Application updated (${app.status})`,
      application: app,
    });
  } catch (error) {
    console.error("🔥 UPDATE APPLICATION STATUS ERROR:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
};

// ✅ APPROVE (Legacy + Direct Action)
export const approveApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("itemId");

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    app.status = "Approved";
    if (!app.applicationReference) {
      app.applicationReference = `MK-APP-${String(app._id)
        .slice(-6)
        .toUpperCase()}`;
    }
    app.statusHistory.push({
      status: "Approved",
      changedAt: new Date(),
      note: req.body?.note || "Approved by administrator",
    });
    await app.save();

    sendApplicationApproved(app.email, app.fullName, app).catch((err) =>
      console.error("Approval email failed:", err)
    );

    res.json({ message: "Application approved", application: app });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve" });
  }
};

// ❌ REJECT (Legacy + Direct Action)
export const rejectApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("itemId");

    if (!app) {
      return res.status(404).json({ error: "Not found" });
    }

    app.status = "Rejected";
    if (!app.applicationReference) {
      app.applicationReference = `MK-APP-${String(app._id)
        .slice(-6)
        .toUpperCase()}`;
    }
    app.statusHistory.push({
      status: "Rejected",
      changedAt: new Date(),
      note: req.body?.note || "Declined by administrator",
    });
    await app.save();

    sendApplicationRejected(app.email, app.fullName, app).catch((err) =>
      console.error("Rejection email failed:", err)
    );

    res.json({ message: "Application rejected", application: app });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject" });
  }
};

// 🗑️ DELETE
export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
};
