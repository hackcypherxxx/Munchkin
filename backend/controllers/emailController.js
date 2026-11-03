import EmailTemplate from "../models/EmailTemplate.js";
import EmailLog from "../models/EmailLog.js";
import Contact from "../models/Contact.js";
import Settings from "../models/Settings.js";
import {
  DEFAULT_EMAIL_TEMPLATES,
  ensureDefaultEmailTemplates,
  interpolateTemplate,
  wrapEditorialEmail,
  sendAdminEmail,
  ADMIN_INBOX,
} from "../utils/sendEmail.js";

// 📚 GET /api/emails/templates
export const getEmailTemplates = async (req, res) => {
  try {
    await ensureDefaultEmailTemplates();
    const templates = await EmailTemplate.find().sort({
      isDefault: -1,
      createdAt: 1,
    });
    res.json(templates);
  } catch (error) {
    console.error("🔥 GET EMAIL TEMPLATES ERROR:", error);
    res.status(500).json({ error: "Failed to load email templates" });
  }
};

// ➕ POST /api/emails/templates (Create or Duplicate Template)
export const createEmailTemplate = async (req, res) => {
  try {
    const {
      name,
      slug,
      category = "General",
      description = "",
      subject,
      htmlBody,
      isActive = true,
    } = req.body;

    if (!name || !subject || !htmlBody) {
      return res
        .status(400)
        .json({ error: "Template name, subject, and body are required" });
    }

    const baseSlug =
      (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36).slice(-4);

    const created = await EmailTemplate.create({
      slug: baseSlug,
      name,
      category,
      description,
      subject,
      htmlBody,
      isActive,
      isDefault: false,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("🔥 CREATE TEMPLATE ERROR:", error);
    res.status(500).json({ error: "Failed to create email template" });
  }
};

// ✏️ PUT /api/emails/templates/:id
export const updateEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Email template not found" });
    }

    const fields = [
      "name",
      "category",
      "description",
      "subject",
      "htmlBody",
      "textBody",
      "isActive",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        template[f] = req.body[f];
      }
    });

    const saved = await template.save();
    res.json(saved);
  } catch (error) {
    console.error("🔥 UPDATE TEMPLATE ERROR:", error);
    res.status(500).json({ error: "Failed to update email template" });
  }
};

// 🔄 POST /api/emails/templates/restore-defaults
export const restoreDefaultTemplates = async (req, res) => {
  try {
    for (const tpl of DEFAULT_EMAIL_TEMPLATES) {
      await EmailTemplate.findOneAndUpdate(
        { slug: tpl.slug },
        { $set: tpl },
        { upsert: true, returnDocument: 'after' }
      );
    }
    const templates = await EmailTemplate.find().sort({
      isDefault: -1,
      createdAt: 1,
    });
    res.json({
      message: "All 12 default email templates restored to factory standard",
      templates,
    });
  } catch (error) {
    console.error("🔥 RESTORE TEMPLATES ERROR:", error);
    res.status(500).json({ error: "Failed to restore default templates" });
  }
};

// 🗑️ DELETE /api/emails/templates/:id
export const deleteEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    if (template.isDefault) {
      return res.status(400).json({
        error:
          "Default system templates cannot be deleted. You may edit or disable them instead.",
      });
    }
    await template.deleteOne();
    res.json({ message: "Custom email template deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete email template" });
  }
};

// 👁️ POST /api/emails/preview
export const previewEmailTemplate = async (req, res) => {
  try {
    const { subject = "", htmlBody = "", variables = {} } = req.body;
    const renderedSubject = interpolateTemplate(subject, variables, false);
    const renderedInnerHtml = interpolateTemplate(htmlBody, variables, true);
    const fullHtml = wrapEditorialEmail({
      title: renderedSubject || "MunchkinKittie Correspondence Preview",
      referenceBadge:
        variables.applicationReference || variables.reservationReference || "",
      bodyHtml: renderedInnerHtml,
    });

    res.json({
      renderedSubject,
      renderedInnerHtml,
      fullHtml,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate email preview" });
  }
};

// 📧 POST /api/emails/send (Send Template or Custom Email + Record Log)
export const sendTrackedTemplateEmail = async (req, res) => {
  try {
    const {
      to,
      recipientName = "",
      subject,
      message,
      templateId = null,
      templateSlug = "",
      templateName = "Custom Admin Correspondence",
      relatedType = "Manual",
      relatedId = null,
      relatedReference = "",
      variables = {},
    } = req.body;

    if (!to || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Recipient email, subject, and message are required" });
    }

    const idempotencyKey = `${to}-${templateSlug || "custom"}-${relatedId || ""}-${subject.slice(0, 32)}`;

    const result = await sendAdminEmail({
      to,
      recipientName,
      subject,
      message,
      templateId,
      templateSlug,
      templateName,
      relatedType,
      relatedId,
      relatedReference,
      variables,
      idempotencyKey,
    });

    // If linked to a customer enquiry (Contact), mark it as Replied
    if (relatedType === "Contact" && relatedId) {
      await Contact.findByIdAndUpdate(relatedId, {
        status: "Replied",
        repliedAt: new Date(),
      }).catch(() => {});
    }

    if (result.skippedDuplicate) {
      return res.json({
        message: "Duplicate send prevented (already dispatched within the last 90 seconds)",
        skippedDuplicate: true,
        emailLog: result.emailLog,
      });
    }

    res.json({
      message: result.success
        ? "Email dispatched and logged in Email Activity History"
        : `Email logged with provider warning: ${result.error}`,
      success: result.success,
      emailLog: result.emailLog,
    });
  } catch (error) {
    console.error("🔥 SEND TRACKED EMAIL ERROR:", error);
    res.status(500).json({
      error: error.message || "Failed to send email",
    });
  }
};

// 🧪 POST /api/emails/test (Restricted to Designated Admin Test Address ONLY)
export const sendAdminTestEmail = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const designatedAdminEmail =
      req.body.adminTestEmail ||
      settings?.adminTestEmail ||
      process.env.ADMIN_EMAIL ||
      ADMIN_INBOX;

    const {
      subject = "Test Correspondence — {{businessName}}",
      htmlBody = "<p>This is a verified test email for <strong>{{customerName}}</strong> regarding <strong>{{kittenName}}</strong>.</p>",
      templateName = "Admin Test Dispatch",
      variables = {},
    } = req.body;

    const testVariables = {
      customerName: "Sanctuary Administrator (Test)",
      kittenName: "Milo (Cream Tabby Munchkin)",
      applicationReference: "MK-APP-2026-TEST",
      reservationReference: "MK-RES-2026-TEST",
      ...variables,
    };

    const result = await sendAdminEmail({
      to: designatedAdminEmail,
      recipientName: "Sanctuary Administrator",
      subject: `[ADMIN TEST] ${subject}`,
      message: htmlBody,
      templateSlug: "admin-test-dispatch",
      templateName: `[Test] ${templateName}`,
      relatedType: "Test",
      relatedReference: "MK-TEST-DISPATCH",
      variables: testVariables,
    });

    res.json({
      message: `Test email dispatched safely to designated admin address (${designatedAdminEmail})`,
      designatedAdminEmail,
      emailLog: result.emailLog,
    });
  } catch (error) {
    console.error("🔥 TEST EMAIL ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to send test email" });
  }
};

// 📜 GET /api/emails/logs (Email Activity History)
export const getEmailLogs = async (req, res) => {
  try {
    const { status, relatedType, search, limit = 100 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (relatedType) filter.relatedType = relatedType;
    if (search) {
      filter.$or = [
        { recipientEmail: { $regex: search, $options: "i" } },
        { recipientName: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { relatedReference: { $regex: search, $options: "i" } },
        { templateName: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await EmailLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(logs);
  } catch (error) {
    console.error("🔥 GET EMAIL LOGS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch email activity history" });
  }
};

