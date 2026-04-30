import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// --- SHARED STYLES ---
const BRAND_COLOR = "#09090b";
const TEXT_MUTED = "#6b7280";
const BORDER_RADIUS = "24px";
const ACCENT_GREEN = "#10b981";

// Base template now includes a hidden preview‑text div
const baseTemplate = (content, previewText = "") => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 24px 12px !important; }
        .email-card { padding: 32px 20px !important; border-radius: 20px !important; }
        .heading-xl { font-size: 32px !important; letter-spacing: -1px !important; }
        .heading-lg { font-size: 26px !important; }
        .body-text { font-size: 14px !important; }
        .button { padding: 14px 24px !important; font-size: 11px !important; letter-spacing: 1.5px !important; }
        .logo { width: 36px !important; height: 36px !important; font-size: 18px !important; }
        .footer-text { font-size: 9px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f9fafb;">
    <!-- Hidden preheader text -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; color:#f9fafb;">
      ${previewText}
    </div>

    <div class="email-wrapper" style="background-color:#f9fafb; padding:48px 24px; font-family:'Inter', Arial, sans-serif; color:${BRAND_COLOR};">
      <div class="email-card" style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:${BORDER_RADIUS}; padding:48px; box-shadow:0 4px 24px rgba(0,0,0,0.03);">

        <!-- LOGO / HEADER -->
        <div style="margin-bottom:40px; border-bottom:1px solid #e5e7eb; padding-bottom:24px; display:flex; align-items:center;">
          <div class="logo" style="background:${BRAND_COLOR}; color:#fff; width:44px; height:44px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:900; font-style:italic; font-size:22px; line-height:1;">M</div>
          <div style="margin-left:16px;">
            <h1 style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:3px; font-weight:900; color:${BRAND_COLOR};">Munchkin Kittie</h1>
            <p style="margin:6px 0 0; font-size:9px; text-transform:uppercase; letter-spacing:2px; color:${TEXT_MUTED}; font-style:italic;">Status: Operational</p>
          </div>
        </div>

        <!-- BODY -->
        ${content}

        <!-- FOOTER -->
        <div style="margin-top:64px; padding-top:32px; border-top:1px solid #e5e7eb; font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:${TEXT_MUTED}; line-height:2.2;">
          <strong>Munchkin Nursery HQ</strong><br/>
          Ethical Breeding • Health Certified • Registry Verified<br/>
          <a href="https://munchkinkittie.com" style="color:${BRAND_COLOR}; text-decoration:none;">munchkinkittie.com</a>
        </div>

      </div>
    </div>
  </body>
  </html>
`;

// 1. THANKS FOR REVIEW
export const sendReviewEmail = async (toEmail) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; font-style:italic; text-transform:uppercase; margin:0 0 24px; color:${BRAND_COLOR};">
      Registry:<br/>Feedback Logged
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Your testimony has been successfully committed to our system. We appreciate the transparency and support for our breeding program.
    </p>
    <a href="https://munchkinkittie.com" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      View Community Hub
    </a>
  `;
  await resend.emails.send({
    from: "Munchkin Nursery <info@munchkinkittie.com>",
    to: toEmail,
    subject: "Registry: Feedback Logged ❤️",
    html: baseTemplate(content, "Your review has been logged. Thank you for supporting ethical breeding.")
  });
};

// 2. ADMIN CONTACT NOTIFICATION
export const sendContactEmail = async (data) => {
  const { name, email, inquiryType, message } = data;
  const content = `
    <h2 class="heading-lg" style="font-size:30px; font-weight:900; text-transform:uppercase; letter-spacing:-1px; margin-bottom:32px; color:${BRAND_COLOR};">
      New System Inquiry
    </h2>
    <div style="background:#f8fafc; padding:32px; border-radius:16px; border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Origin</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${name} (${email})</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Classification</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${inquiryType}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Payload</p>
      <p style="margin:0; line-height:1.7; font-size:15px; color:#1e293b;">${message}</p>
    </div>
  `;
  await resend.emails.send({
    from: "System Alert <info@munchkinkittie.com>",
    to: "info@munchkinkittie.com",
    subject: `[INQUIRY] ${inquiryType} - ${name}`,
    html: baseTemplate(content, `New inquiry from ${name} regarding ${inquiryType}`)
  });
};

// 3. ADMIN MESSAGE TO USER
export const sendAdminEmail = async ({ to, subject, message }) => {
  const content = `
    <h2 class="heading-xl" style="font-size:38px; font-weight:900; text-transform:uppercase; letter-spacing:-1.5px; margin-bottom:24px; color:${BRAND_COLOR};">
      Admin Transmission
    </h2>
    <div class="body-text" style="font-size:16px; line-height:1.8; color:#3f3f46; margin-bottom:40px;">
      ${message}
    </div>
    <a href="https://munchkinkittie.com" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      Open Nursery Dashboard
    </a>
  `;
  await resend.emails.send({
    from: "Munchkin Nursery <info@munchkinkittie.com>",
    to,
    subject: `Transmission: ${subject}`,
    html: baseTemplate(content, subject)
  });
};

// 4. APPLICATION RECEIVED
export const sendApplicationReceived = async (email, name) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; text-transform:uppercase; margin-bottom:24px; color:${BRAND_COLOR};">
      Protocol:<br/>App Logged
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Greetings ${name}, we have received your adoption application. Our team is currently reviewing your profile against our registry standards.
    </p>
    <div style="display:inline-block; padding:12px 24px; border:2px solid ${BRAND_COLOR}; border-radius:14px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:${BRAND_COLOR};">
      Status: In Review
    </div>
  `;
  await resend.emails.send({
    from: "Nursery Registry <info@munchkinkittie.com>",
    to: email,
    subject: "Protocol: Application Logged 🐾",
    html: baseTemplate(content, `Application received. We’ll be in touch soon, ${name}.`)
  });
};

// 5. APPLICATION APPROVED
export const sendApplicationApproved = async (email, name) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; text-transform:uppercase; margin-bottom:24px; color:${ACCENT_GREEN};">
      Access:<br/>Approved
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Congratulations ${name}, your application has been verified. You are now authorized to proceed with the adoption process.
    </p>
    <a href="https://munchkinkittie.com" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      Complete Adoption
    </a>
  `;
  await resend.emails.send({
    from: "Nursery Registry <info@munchkinkittie.com>",
    to: email,
    subject: "Access Granted: Adoption Approved 🎉",
    html: baseTemplate(content, `${name}, your adoption application has been approved!`)
  });
};

// 6. APPLICATION REJECTED
export const sendApplicationRejected = async (email, name) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; text-transform:uppercase; margin-bottom:24px; color:${BRAND_COLOR};">
      System Update
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Hello ${name}, thank you for your interest. At this time, we are unable to proceed with your request. We appreciate your understanding of our selection process.
    </p>
  `;
  await resend.emails.send({
    from: "Nursery Registry <info@munchkinkittie.com>",
    to: email,
    subject: "Update: Application Registry",
    html: baseTemplate(content, `A status update regarding your application, ${name}.`)
  });
};