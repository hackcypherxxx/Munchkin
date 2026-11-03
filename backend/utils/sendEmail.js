import { Resend } from "resend";
import EmailTemplate from "../models/EmailTemplate.js";
import EmailLog from "../models/EmailLog.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const SENDER_ADDRESS = "Munchkin Kittie <info@munchkinkittie.com>";
export const ADMIN_INBOX = "info@munchkinkittie.com";

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlToPlainText(html) {
  if (!html) return "";
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, " • ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Safely interpolate {{variable}} placeholders and strip unresolved tokens
 */
export function interpolateTemplate(templateStr, variables = {}, isHtml = true) {
  if (!templateStr) return "";
  const defaults = {
    customerName: "Valued Guest",
    kittenName: "your selected Munchkin companion",
    applicationReference: "MK-APP-PENDING",
    applicationDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    applicationStatus: "Under Review",
    adminName: "Placement Concierge Team",
    businessName: "MunchkinKittie Sanctuary",
    contactEmail: "info@munchkinkittie.com",
    contactPhone: "+1 (607) 223-4177",
    reservationReference: "MK-RES-CONCIERGE",
    nextSteps:
      "Our placement coordinator will be in touch within 24 hours with your personalized placement itinerary.",
    ...variables,
  };

  return String(templateStr)
    .replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      const val = defaults[key];
      if (val === undefined || val === null || val === "") return "";
      return isHtml ? escapeHtml(val) : String(val);
    })
    // Strip any leftover unresolved {{placeholders}}
    .replace(/\{\{[^}]+\}\}/g, "");
}

/**
 * Warm Editorial Luxury HTML Email Wrapper (Inline CSS for universal email client support)
 */
export function wrapEditorialEmail({
  eyebrow = "MUNCHKINKITTIE • PRIVATE FELINE SANCTUARY",
  title = "Correspondence from Our Cattery",
  referenceBadge = "",
  bodyHtml = "",
  ctaLabel = "Visit MunchkinKittie Sanctuary",
  ctaUrl = "https://www.munchkinkittie.com/available-kittens",
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#181615;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FAF8F5;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background-color:#FFFFFF;border:1px solid #E6E0D6;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(24,22,21,0.05);">
          <!-- Luxury Header Banner -->
          <tr>
            <td style="background-color:#181615;padding:32px 36px;border-bottom:3px solid #9E5A3C;">
              <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#D9B88F;font-weight:600;">
                ${escapeHtml(eyebrow)}
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#FAF8F5;font-weight:600;">
                ${escapeHtml(title)}
              </h1>
              ${
                referenceBadge
                  ? `<div style="margin-top:14px;display:inline-block;background-color:#263B30;color:#FAF8F5;font-size:11px;letter-spacing:1.2px;padding:5px 12px;border-radius:999px;font-family:monospace;">${escapeHtml(
                      referenceBadge
                    )}</div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Main Editorial Body -->
          <tr>
            <td style="padding:36px;font-size:15px;line-height:1.75;color:#3A3532;">
              ${bodyHtml}

              ${
                ctaLabel && ctaUrl
                  ? `<div style="margin:32px 0 12px 0;text-align:left;">
                      <a href="${escapeHtml(
                        ctaUrl
                      )}" style="display:inline-block;background-color:#263B30;color:#FAF8F5;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:0.4px;">
                        ${escapeHtml(ctaLabel)} &rarr;
                      </a>
                    </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Trust & Contact Footer -->
          <tr>
            <td style="background-color:#F3EFEA;padding:26px 36px;border-top:1px solid #E6E0D6;font-size:12px;line-height:1.6;color:#5C554E;">
              <p style="margin:0 0 6px 0;font-weight:600;color:#181615;">
                MunchkinKittie — Ethical Home-Raised Feline Companions
              </p>
              <p style="margin:0 0 6px 0;">
                Direct Concierge Desk: <a href="mailto:info@munchkinkittie.com" style="color:#9E5A3C;text-decoration:none;font-weight:600;">info@munchkinkittie.com</a> &bull; <a href="https://www.munchkinkittie.com" style="color:#263B30;text-decoration:none;">www.munchkinkittie.com</a>
              </p>
              <p style="margin:0;color:#8C837A;font-size:11px;">
                Every MunchkinKittie kitten is raised underfoot with comprehensive veterinary socialization and our 1-Year Genetic Health Guarantee.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * The 12 Required Default Professional Email Templates (Section 10)
 */
export const DEFAULT_EMAIL_TEMPLATES = [
  {
    slug: "thank-you-enquiry",
    name: "1. Thank you for your enquiry",
    category: "Enquiry",
    description: "Warm confirmation sent when a prospective family submits a general or kitten enquiry.",
    subject: "Thank You for Contacting {{businessName}} — Enquiry Received",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you for reaching out to <strong>{{businessName}}</strong>. We are delighted to receive your enquiry regarding <strong>{{kittenName}}</strong>.</p>
<p>Every kitten in our sanctuary is raised in our private family residence with daily socialization and comprehensive veterinary oversight. A member of our {{adminName}} has received your message and will respond personally within 24 hours.</p>
<div style="background-color:#FAF8F5;border-left:3px solid #9E5A3C;padding:16px 20px;margin:20px 0;border-radius:8px;">
  <p style="margin:0;font-size:13px;color:#5C554E;"><strong>Next Steps:</strong> {{nextSteps}}</p>
</div>
<p>Warmest regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "application-received",
    name: "2. Application received",
    category: "Application",
    description: "Official confirmation with unique application reference sent immediately upon adoption application submission.",
    subject: "Adoption Application Received ({{applicationReference}}) — {{kittenName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you for submitting your formal adoption application for <strong>{{kittenName}}</strong> with <strong>{{businessName}}</strong>.</p>
<div style="background-color:#FAF8F5;border:1px solid #E6E0D6;padding:18px 22px;margin:22px 0;border-radius:12px;">
  <p style="margin:0 0 6px 0;font-size:13px;"><strong>Application Reference:</strong> <span style="font-family:monospace;color:#263B30;font-weight:700;">{{applicationReference}}</span></p>
  <p style="margin:0 0 6px 0;font-size:13px;"><strong>Kitten / Litter Applied For:</strong> {{kittenName}}</p>
  <p style="margin:0 0 6px 0;font-size:13px;"><strong>Submission Date:</strong> {{applicationDate}}</p>
  <p style="margin:0;font-size:13px;"><strong>Current Status:</strong> {{applicationStatus}}</p>
</div>
<p>Our placement specialists review every household profile thoughtfully to ensure a harmonious lifelong match. {{nextSteps}}</p>
<p>With appreciation,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "application-under-review",
    name: "3. We are reviewing your application",
    category: "Application",
    description: "Status update letting the applicant know their household profile is actively under review by the breeder.",
    subject: "Update on Your Adoption Application ({{applicationReference}}) — Under Review",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>We are writing to let you know that your adoption application (Reference: <strong>{{applicationReference}}</strong>) for <strong>{{kittenName}}</strong> is now actively <strong>Under Review</strong> by our senior placement coordinator.</p>
<p>During this stage, we evaluate household compatibility, existing pets, and travel or hand-delivery logistics so that <strong>{{kittenName}}</strong> experiences a serene transition.</p>
<p><strong>What to Expect Next:</strong> {{nextSteps}}</p>
<p>Warm regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "additional-info-required",
    name: "4. Additional information required",
    category: "Application",
    description: "Polite request for follow-up details or household clarification regarding an application.",
    subject: "Additional Details Requested for Application {{applicationReference}} — {{kittenName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you again for your adoption application (<strong>{{applicationReference}}</strong>) for <strong>{{kittenName}}</strong>. Our placement team was very pleased to read your submission.</p>
<p>Before we finalize our placement decision, we kindly request a few additional details from you:</p>
<div style="background-color:#FAF8F5;border-left:3px solid #C87D28;padding:16px 20px;margin:20px 0;border-radius:8px;">
  <p style="margin:0;font-size:14px;color:#181615;">{{nextSteps}}</p>
</div>
<p>Please simply reply directly to this email (<a href="mailto:{{contactEmail}}" style="color:#9E5A3C;">{{contactEmail}}</a>) with your response and keep your reference <strong>{{applicationReference}}</strong> in the subject line.</p>
<p>Warmest regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "application-approved",
    name: "5. Your application has been approved",
    category: "Application",
    description: "Celebratory approval notification outlining deposit, reservation, and delivery coordination steps.",
    subject: "Congratulations! Your Adoption Application ({{applicationReference}}) Has Been Approved",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Wonderful news from our nursery — your adoption application (<strong>{{applicationReference}}</strong>) for <strong>{{kittenName}}</strong> has been officially <strong>Approved</strong>!</p>
<p>We believe your home will provide an extraordinary environment for <strong>{{kittenName}}</strong>.</p>
<div style="background-color:#EDF5F0;border:1px solid #2D6A4F;padding:18px 22px;margin:22px 0;border-radius:12px;">
  <p style="margin:0 0 8px 0;font-size:14px;color:#263B30;font-weight:700;">Reservation & Placement Next Steps</p>
  <p style="margin:0;font-size:13px;color:#181615;">{{nextSteps}}</p>
</div>
<p>Please reply directly to this email to confirm your reservation window and preferred handover or Flight Nanny schedule.</p>
<p>Warmest congratulations,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "application-not-approved",
    name: "6. Your application was not approved",
    category: "Application",
    description: "Gracious, respectful notification when a specific kitten placement cannot proceed.",
    subject: "Update Regarding Your Adoption Application ({{applicationReference}})",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you sincerely for the time and care you invested in your application (<strong>{{applicationReference}}</strong>) for <strong>{{kittenName}}</strong>.</p>
<p>After careful evaluation of our current litter needs and household pairings, we are unable to move forward with this specific placement at this time.</p>
<p>{{nextSteps}}</p>
<p>We truly appreciate your love for the Munchkin breed and wish you the very best in welcoming a feline companion into your home.</p>
<p>Sincerely,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "kitten-availability-confirmation",
    name: "7. Kitten availability confirmation",
    category: "Reservation",
    description: "Confirms current availability status, veterinary readiness, and adoption fee details for a specific kitten.",
    subject: "Availability Confirmation for {{kittenName}} — {{businessName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>We are pleased to confirm that <strong>{{kittenName}}</strong> is currently available for placement to an approved home.</p>
<p><strong>Included with {{kittenName}}'s Placement:</strong></p>
<ul>
  <li>Comprehensive veterinary health examination &amp; age-appropriate immunizations</li>
  <li>1-Year Congenital &amp; Hereditary Health Guarantee</li>
  <li>Microchip registration &amp; curated transition starter kit</li>
</ul>
<p><strong>Next Steps:</strong> {{nextSteps}}</p>
<p>Warm regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "reservation-information",
    name: "8. Reservation information",
    category: "Reservation",
    description: "Provides formal reservation reference, deposit terms, and veterinary preparation timeline.",
    subject: "Reservation Details & Deposit Confirmation ({{reservationReference}}) — {{kittenName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Here are your formal reservation details for <strong>{{kittenName}}</strong>:</p>
<div style="background-color:#FAF8F5;border:1px solid #E6E0D6;padding:18px 22px;margin:22px 0;border-radius:12px;">
  <p style="margin:0 0 6px 0;font-size:13px;"><strong>Reservation Reference:</strong> <span style="font-family:monospace;color:#263B30;font-weight:700;">{{reservationReference}}</span></p>
  <p style="margin:0 0 6px 0;font-size:13px;"><strong>Reserved Companion:</strong> {{kittenName}}</p>
  <p style="margin:0;font-size:13px;"><strong>Application ID:</strong> {{applicationReference}}</p>
</div>
<p>{{nextSteps}}</p>
<p>Please reply to <a href="mailto:{{contactEmail}}" style="color:#9E5A3C;">{{contactEmail}}</a> if you have any questions regarding your reservation agreement or travel itinerary.</p>
<p>Warmest regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "follow-up-message",
    name: "9. Follow-up message",
    category: "Follow-Up",
    description: "Gentle follow-up correspondence checking in with an applicant or prospective adopter.",
    subject: "Following Up Regarding {{kittenName}} — {{businessName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>We hope you are having a wonderful week. We are following up regarding your recent interest in <strong>{{kittenName}}</strong> (Reference: <strong>{{applicationReference}}</strong>).</p>
<p>{{nextSteps}}</p>
<p>If you would like to schedule a private video introduction or have any questions about our home-rearing philosophy, simply reply to this email and we will be happy to assist.</p>
<p>Warm regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "thank-you-patience",
    name: "10. Thank you for your patience",
    category: "Follow-Up",
    description: "Courtesy update during high-volume litter evaluations or veterinary checkup windows.",
    subject: "Thank You for Your Patience — Update from {{businessName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you so much for your patience while our nursery team completes our current veterinary checkups and placement evaluations regarding <strong>{{kittenName}}</strong>.</p>
<p>{{nextSteps}}</p>
<p>Your inquiry is important to us, and we will provide a complete update shortly.</p>
<p>With gratitude,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "general-customer-response",
    name: "11. General customer response",
    category: "General",
    description: "Versatile, polished concierge correspondence template for custom administrator replies.",
    subject: "A Personal Note from {{businessName}} Regarding {{kittenName}}",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>Thank you for your correspondence with <strong>{{businessName}}</strong>.</p>
<p>{{nextSteps}}</p>
<p>Should you need any further assistance, please reach out to us at <a href="mailto:{{contactEmail}}" style="color:#9E5A3C;">{{contactEmail}}</a>.</p>
<p>Warmest regards,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
  {
    slug: "welcome-message",
    name: "12. Welcome message",
    category: "General",
    description: "Warm welcome into the MunchkinKittie family with home-transition and care guidance.",
    subject: "Welcome to the {{businessName}} Family, {{customerName}}!",
    htmlBody: `<p>Dear <strong>{{customerName}}</strong>,</p>
<p>On behalf of everyone at <strong>{{businessName}}</strong>, welcome to our extended family of Munchkin guardians!</p>
<p>Preparing for <strong>{{kittenName}}</strong>'s arrival is a joyful milestone. {{nextSteps}}</p>
<p>Remember that our lifetime breeder support desk (<a href="mailto:{{contactEmail}}" style="color:#9E5A3C;">{{contactEmail}}</a>) is always here for nutrition, grooming, and transition guidance.</p>
<p>With warmest wishes,<br/><strong>{{adminName}}</strong><br/>{{businessName}}</p>`,
    isDefault: true,
    isActive: true,
  },
];

/**
 * Seed the 12 default email templates if they do not exist yet
 */
export async function ensureDefaultEmailTemplates() {
  try {
    for (const tpl of DEFAULT_EMAIL_TEMPLATES) {
      await EmailTemplate.findOneAndUpdate(
        { slug: tpl.slug },
        { $setOnInsert: tpl },
        { upsert: true, returnDocument: 'after' }
      );
    }
  } catch (error) {
    console.error("Failed to seed default email templates:", error.message);
  }
}

/**
 * Core Tracked Email Dispatcher — logs every email in EmailLog and protects against duplicate sends
 */
export async function dispatchTrackedEmail({
  to,
  recipientName = "",
  subject,
  html,
  text,
  templateId = null,
  templateSlug = "",
  templateName = "System Transactional",
  relatedType = "Manual",
  relatedId = null,
  relatedReference = "",
  sentBy = "System",
  idempotencyKey = "",
}) {
  const cleanRecipient = String(to || "").toLowerCase().trim();
  if (!cleanRecipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanRecipient)) {
    throw new Error(`Invalid recipient email address: ${to}`);
  }

  // Prevent accidental duplicate sends within 90 seconds if idempotencyKey matches
  if (idempotencyKey) {
    const ninetySecondsAgo = new Date(Date.now() - 90 * 1000);
    const recentDuplicate = await EmailLog.findOne({
      idempotencyKey,
      createdAt: { $gte: ninetySecondsAgo },
      status: { $in: ["Queued", "Accepted by provider", "Delivered"] },
    });
    if (recentDuplicate) {
      return {
        skippedDuplicate: true,
        emailLog: recentDuplicate,
      };
    }
  }

  const plainText = text || htmlToPlainText(html);

  const emailLog = await EmailLog.create({
    recipientEmail: cleanRecipient,
    recipientName,
    subject,
    templateId,
    templateSlug,
    templateName,
    relatedType,
    relatedId,
    relatedReference,
    provider: "Resend",
    status: "Queued",
    sentBy,
    idempotencyKey,
  });

  try {
    const response = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: cleanRecipient,
      subject,
      html,
      text: plainText,
    });

    if (response?.error) {
      emailLog.status = "Failed";
      emailLog.errorMessage =
        response.error.message || JSON.stringify(response.error);
      await emailLog.save();
      return { success: false, emailLog, error: emailLog.errorMessage };
    }

    emailLog.status = "Accepted by provider";
    emailLog.providerMessageId = response?.data?.id || response?.id || "";
    await emailLog.save();
    return { success: true, emailLog };
  } catch (err) {
    emailLog.status = "Failed";
    emailLog.errorMessage = err.message || "Resend dispatch failed";
    await emailLog.save();
    return { success: false, emailLog, error: emailLog.errorMessage };
  }
}

// ======================================================
// TRANSACTIONAL HELPERS (Backward-compatible + Upgraded)
// ======================================================

export const sendReviewEmail = async (review) => {
  const bodyHtml = `
    <p>A new client testimonial has been submitted and is awaiting verification in the Admin Dashboard.</p>
    <div style="background-color:#FAF8F5;border:1px solid #E6E0D6;padding:16px 20px;border-radius:12px;margin:18px 0;">
      <p style="margin:0 0 6px 0;"><strong>Guardian Name:</strong> ${escapeHtml(review.name)}</p>
      <p style="margin:0 0 6px 0;"><strong>Location:</strong> ${escapeHtml(review.location || "Not specified")}</p>
      <p style="margin:0 0 6px 0;"><strong>Rating:</strong> ${"★".repeat(Number(review.rating) || 5)}</p>
      <p style="margin:0;"><strong>Review:</strong> &ldquo;${escapeHtml(review.review)}&rdquo;</p>
    </div>
  `;

  return dispatchTrackedEmail({
    to: ADMIN_INBOX,
    recipientName: "Sanctuary Admin",
    subject: `New Adoption Testimonial Submitted — ${review.name}`,
    html: wrapEditorialEmail({
      title: "New Guardian Testimonial Received",
      bodyHtml,
      ctaLabel: "Review in Admin Sanctuary",
      ctaUrl: "https://www.munchkinkittie.com/admin",
    }),
    templateSlug: "admin-review-notification",
    templateName: "New Review Admin Alert",
    relatedType: "Review",
    relatedId: review._id || null,
  });
};

export const sendContactEmail = async (contact) => {
  const ref = contact.enquiryReference || `MK-ENQ-${String(contact._id || "").slice(-5).toUpperCase()}`;

  // 1. Admin notification
  const adminBody = `
    <p>A new enquiry has been submitted through the MunchkinKittie Concierge Desk.</p>
    <div style="background-color:#FAF8F5;border:1px solid #E6E0D6;padding:18px 22px;border-radius:12px;margin:18px 0;">
      <p style="margin:0 0 6px 0;"><strong>Reference:</strong> ${escapeHtml(ref)}</p>
      <p style="margin:0 0 6px 0;"><strong>From:</strong> ${escapeHtml(contact.name)} (${escapeHtml(contact.email)})</p>
      <p style="margin:0 0 6px 0;"><strong>Topic:</strong> ${escapeHtml(contact.inquiryType)}</p>
      <p style="margin:0;"><strong>Message:</strong><br/>${escapeHtml(contact.message)}</p>
    </div>
  `;

  await dispatchTrackedEmail({
    to: ADMIN_INBOX,
    recipientName: "Sanctuary Admin",
    subject: `New Concierge Enquiry (${ref}) — ${contact.inquiryType}`,
    html: wrapEditorialEmail({
      title: "New Customer Enquiry Received",
      referenceBadge: ref,
      bodyHtml: adminBody,
      ctaLabel: "Reply in Admin Dashboard",
      ctaUrl: "https://www.munchkinkittie.com/admin",
    }),
    templateSlug: "admin-enquiry-alert",
    templateName: "Admin Enquiry Alert",
    relatedType: "Contact",
    relatedId: contact._id || null,
    relatedReference: ref,
  });

  // 2. Customer confirmation using Template #1
  const variables = {
    customerName: contact.name,
    kittenName: contact.inquiryType || "our Munchkin kittens",
    applicationReference: ref,
    nextSteps:
      "Our placement concierge will respond personally to your message within 24 hours.",
  };

  const defaultTpl = DEFAULT_EMAIL_TEMPLATES[0];
  const subject = interpolateTemplate(defaultTpl.subject, variables, false);
  const innerHtml = interpolateTemplate(defaultTpl.htmlBody, variables, true);

  return dispatchTrackedEmail({
    to: contact.email,
    recipientName: contact.name,
    subject,
    html: wrapEditorialEmail({
      title: "Thank You for Contacting MunchkinKittie",
      referenceBadge: ref,
      bodyHtml: innerHtml,
      ctaLabel: "Explore Available Kittens",
      ctaUrl: "https://www.munchkinkittie.com/available-kittens",
    }),
    templateSlug: defaultTpl.slug,
    templateName: defaultTpl.name,
    relatedType: "Contact",
    relatedId: contact._id || null,
    relatedReference: ref,
  });
};

export const sendAdminEmail = async ({
  to,
  recipientName = "",
  subject,
  message,
  templateId = null,
  templateSlug = "manual-admin-email",
  templateName = "Custom Admin Correspondence",
  relatedType = "Manual",
  relatedId = null,
  relatedReference = "",
  variables = {},
  idempotencyKey = "",
}) => {
  const interpolatedSubject = interpolateTemplate(subject, variables, false);
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(message);
  const rawBody = hasHtmlTags
    ? interpolateTemplate(message, variables, true)
    : `<p>${interpolateTemplate(message, variables, true).replace(/\n/g, "<br/>")}</p>`;

  const wrappedHtml = wrapEditorialEmail({
    title: interpolatedSubject,
    referenceBadge: relatedReference || variables.applicationReference || "",
    bodyHtml: rawBody,
    ctaLabel: "Visit MunchkinKittie Sanctuary",
    ctaUrl: "https://www.munchkinkittie.com/available-kittens",
  });

  return dispatchTrackedEmail({
    to,
    recipientName: recipientName || variables.customerName || "",
    subject: interpolatedSubject,
    html: wrappedHtml,
    templateId,
    templateSlug,
    templateName,
    relatedType,
    relatedId,
    relatedReference,
    sentBy: "Administrator",
    idempotencyKey,
  });
};

export const sendApplicationReceived = async ({
  email,
  name,
  paymentMethod,
  paymentMethodOther,
  kittenName,
  applicationReference = "MK-APP-RECEIVED",
  applicationId = null,
}) => {
  const finalPayment =
    paymentMethod === "other" ? paymentMethodOther : paymentMethod;

  const variables = {
    customerName: name,
    kittenName: kittenName || "your selected companion",
    applicationReference,
    applicationStatus: "Received & Queued for Review",
    nextSteps: `Our placement team is reviewing your household profile and preferred payment arrangement (${String(
      finalPayment || "standard"
    ).toUpperCase()}). Expect a personal update within 24 hours.`,
  };

  const tpl = DEFAULT_EMAIL_TEMPLATES[1]; // 2. Application received
  const subject = interpolateTemplate(tpl.subject, variables, false);
  const innerHtml = interpolateTemplate(tpl.htmlBody, variables, true);

  return dispatchTrackedEmail({
    to: email,
    recipientName: name,
    subject,
    html: wrapEditorialEmail({
      title: "Adoption Application Received",
      referenceBadge: applicationReference,
      bodyHtml: innerHtml,
      ctaLabel: "Review Adoption Journey",
      ctaUrl: "https://www.munchkinkittie.com/adoption-process",
    }),
    templateSlug: tpl.slug,
    templateName: tpl.name,
    relatedType: "Application",
    relatedId: applicationId,
    relatedReference: applicationReference,
    idempotencyKey: `app-received-${applicationReference}`,
  });
};

export const sendApplicationStatusEmail = async ({
  application,
  newStatus,
  customNote = "",
}) => {
  if (!application || !application.email) return null;

  const kittenName =
    application.kittenSnapshot?.name ||
    application.itemId?.name ||
    application.itemId?.title ||
    "your selected Munchkin companion";

  const ref =
    application.applicationReference ||
    `MK-APP-${String(application._id).slice(-6).toUpperCase()}`;

  const statusToSlugMap = {
    "Under Review": "application-under-review",
    "More Information Required": "additional-info-required",
    Approved: "application-approved",
    Rejected: "application-not-approved",
    Completed: "welcome-message",
  };

  const slug = statusToSlugMap[newStatus];
  if (!slug) return null;

  const dbTemplate = await EmailTemplate.findOne({ slug });
  const fallbackTemplate =
    DEFAULT_EMAIL_TEMPLATES.find((t) => t.slug === slug) ||
    DEFAULT_EMAIL_TEMPLATES[2];
  const tpl = dbTemplate || fallbackTemplate;

  const defaultNextStepsByStatus = {
    "Under Review":
      customNote ||
      "Our placement coordinator is reviewing your home profile and will follow up within 24 hours.",
    "More Information Required":
      customNote ||
      "Could you kindly share a bit more detail regarding your daily schedule and indoor space preparation?",
    Approved:
      customNote ||
      "To place your kitten on formal hold, please reply to this email to receive your reservation deposit instructions and veterinary departure schedule.",
    Rejected:
      customNote ||
      "You are welcome to remain on our priority notification list for future litters that may be an ideal match.",
    Completed:
      customNote ||
      "Congratulations on completing your adoption! Our concierge desk remains available for lifetime care support.",
  };

  const variables = {
    customerName: application.fullName,
    kittenName,
    applicationReference: ref,
    applicationStatus: newStatus,
    nextSteps: defaultNextStepsByStatus[newStatus],
  };

  const subject = interpolateTemplate(tpl.subject, variables, false);
  const innerHtml = interpolateTemplate(tpl.htmlBody, variables, true);

  return dispatchTrackedEmail({
    to: application.email,
    recipientName: application.fullName,
    subject,
    html: wrapEditorialEmail({
      title: subject,
      referenceBadge: ref,
      bodyHtml: innerHtml,
      ctaLabel:
        newStatus === "Approved"
          ? "Review Health Guarantee & Care Guide"
          : "Visit MunchkinKittie Sanctuary",
      ctaUrl:
        newStatus === "Approved"
          ? "https://www.munchkinkittie.com/health-guarantee"
          : "https://www.munchkinkittie.com/available-kittens",
    }),
    templateId: dbTemplate?._id || null,
    templateSlug: tpl.slug,
    templateName: tpl.name,
    relatedType: "Application",
    relatedId: application._id,
    relatedReference: ref,
    sentBy: "Administrator",
    idempotencyKey: `app-status-${ref}-${newStatus}`,
  });
};

export const sendApplicationApproved = async (
  email,
  name,
  application = null
) => {
  if (application) {
    return sendApplicationStatusEmail({
      application,
      newStatus: "Approved",
    });
  }
  return sendApplicationStatusEmail({
    application: { email, fullName: name, applicationReference: "MK-APP-APPROVED" },
    newStatus: "Approved",
  });
};

export const sendApplicationRejected = async (
  email,
  name,
  application = null
) => {
  if (application) {
    return sendApplicationStatusEmail({
      application,
      newStatus: "Rejected",
    });
  }
  return sendApplicationStatusEmail({
    application: { email, fullName: name, applicationReference: "MK-APP-UPDATE" },
    newStatus: "Rejected",
  });
};

export const sendApplicationAdminNotification = async (data) => {
  const finalPayment =
    data.paymentMethod === "other"
      ? data.paymentMethodOther
      : data.paymentMethod;
  const ref = data.applicationReference || "MK-APP-NEW";

  const bodyHtml = `
    <p>A new adoption application has been submitted and logged in the Sanctuary Dashboard.</p>
    <div style="background-color:#FAF8F5;border:1px solid #E6E0D6;padding:18px 22px;border-radius:12px;margin:18px 0;">
      <p style="margin:0 0 6px 0;"><strong>Reference:</strong> ${escapeHtml(ref)}</p>
      <p style="margin:0 0 6px 0;"><strong>Applicant:</strong> ${escapeHtml(data.fullName)} (${escapeHtml(data.email)})</p>
      <p style="margin:0 0 6px 0;"><strong>Phone &amp; Location:</strong> ${escapeHtml(data.phone || "N/A")} &bull; ${escapeHtml(data.location || "N/A")}</p>
      <p style="margin:0 0 6px 0;"><strong>Kitten / Type:</strong> ${escapeHtml(data.kittenName)} (${escapeHtml(data.applicationType)})</p>
      <p style="margin:0 0 6px 0;"><strong>Preferred Payment:</strong> ${escapeHtml(String(finalPayment || "").toUpperCase())}</p>
      <p style="margin:0 0 6px 0;"><strong>Existing Pets:</strong> ${escapeHtml(data.hasPets || "None")}</p>
      <p style="margin:0 0 6px 0;"><strong>Feline Experience:</strong> ${escapeHtml(data.experience || "Not specified")}</p>
      <p style="margin:0;"><strong>Household Description:</strong><br/>${escapeHtml(data.homeDescription)}</p>
    </div>
  `;

  return dispatchTrackedEmail({
    to: ADMIN_INBOX,
    recipientName: "Sanctuary Admin",
    subject: `New Adoption Application (${ref}) — ${data.fullName} for ${data.kittenName}`,
    html: wrapEditorialEmail({
      title: "New Adoption Application Submitted",
      referenceBadge: ref,
      bodyHtml,
      ctaLabel: "Review Application in Admin Dashboard",
      ctaUrl: "https://www.munchkinkittie.com/admin",
    }),
    templateSlug: "admin-application-alert",
    templateName: "New Application Admin Alert",
    relatedType: "Application",
    relatedId: data.applicationId || null,
    relatedReference: ref,
  });
};
