import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// --- SHARED STYLES ---
const BRAND_COLOR = "#09090b";
const TEXT_MUTED = "#6b7280";
const BORDER_RADIUS = "24px";
const ACCENT_GREEN = "#10b981";

// Unified base template
const baseTemplate = (content, previewText = "") => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
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
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; color:#f9fafb;">
      ${previewText}
    </div>

    <div class="email-wrapper" style="background-color:#f9fafb; padding:48px 24px; font-family:'Inter', Arial, sans-serif; color:${BRAND_COLOR};">
      <div class="email-card" style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:${BORDER_RADIUS}; padding:48px; box-shadow:0 4px 24px rgba(0,0,0,0.03);">

        <!-- HEADER -->
        <div style="margin-bottom:36px; border-bottom:1px solid #e5e7eb; padding-bottom:20px; display:flex; align-items:center;">
          <div class="logo" style="background:${BRAND_COLOR}; color:#fff; width:44px; height:44px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:900; font-style:italic; font-size:22px; line-height:1;">M</div>
          <div style="margin-left:16px;">
            <h1 style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:3px; font-weight:900; color:${BRAND_COLOR};">Munchkin Kittie</h1>
            <p style="margin:4px 0 0; font-size:9px; text-transform:uppercase; letter-spacing:2px; color:${TEXT_MUTED}; font-style:italic;">Ethical Munchkin Cat Placement</p>
          </div>
        </div>

        <!-- BODY -->
        ${content}

        <!-- FOOTER -->
        <div style="margin-top:64px; padding-top:32px; border-top:1px solid #e5e7eb;">
          <p style="font-size:13px; line-height:1.7; color:${TEXT_MUTED}; margin:0 0 24px;">
            Munchkin Kittie is a trusted network connecting families with healthy, ethically bred Munchkin cats. Every kitten comes from a verified breeder who meets our strict health and care standards. We believe in transparency, love for every short‑legged soul, and matching the right companion with the right home.
          </p>
          <p style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:${TEXT_MUTED}; margin:0 0 8px;">
            <strong>Munchkin Kittie HQ</strong>
          </p>
          <p style="font-size:11px; color:${TEXT_MUTED}; margin:0 0 24px; line-height:1.6;">
            <a href="https://munchkinkittie.com" style="color:${BRAND_COLOR}; text-decoration:underline;">Visit our website</a> &nbsp;|&nbsp;
            <a href="https://munchkinkittie.com/contact" style="color:${BRAND_COLOR}; text-decoration:underline;">Contact us</a>
          </p>
          <p style="font-size:10px; color:${TEXT_MUTED}; margin:0;">
            © ${new Date().getFullYear()} Munchkin Kittie. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
`;

// ------- PAYMENT METHOD HELPER --------
const formatPaymentMethod = (method, otherText) => {
  const labels = {
    "apple pay": "Apple Pay",
    "cash app": "Cash App",
    "zelle": "Zelle",
    "chime": "Chime",
    "giftcard": "Gift Card",
    "other": otherText || "Other (custom)"
  };
  return labels[method?.toLowerCase()] || method;
};

// 1. THANKS FOR REVIEW
export const sendReviewEmail = async (toEmail) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; font-style:italic; margin:0 0 24px; color:${BRAND_COLOR};">
      Thank you for your review!
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Your story helps other families discover the joy of a Munchkin companion. We've added your feedback to our community page — your voice truly matters.
    </p>
    <a href="https://munchkinkittie.com/reviews" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      See community reviews
    </a>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: toEmail,
    subject: "❤️ Thank you for sharing your experience!",
    html: baseTemplate(content, "Your review is live — thanks for helping our community grow.")
  });
};

// 2. ADMIN CONTACT NOTIFICATION
export const sendContactEmail = async (data) => {
  const { name, email, inquiryType, message } = data;
  const content = `
    <h2 class="heading-lg" style="font-size:28px; font-weight:900; margin-bottom:32px; color:${BRAND_COLOR};">
      New message from ${name}
    </h2>
    <div style="background:#f8fafc; padding:32px; border-radius:16px; border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">From</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${name} (${email})</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Regarding</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${inquiryType}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Message</p>
      <p style="margin:0; line-height:1.7; font-size:15px; color:#1e293b;">${message}</p>
    </div>
    <p style="font-size:13px; color:${TEXT_MUTED}; margin-top:24px;">
      <a href="https://munchkinkittie.com/admin-dashboard" style="color:${BRAND_COLOR}; font-weight:700;">Reply in admin dashboard</a>
    </p>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: "info@munchkinkittie.com",
    subject: `📩 ${name} sent an inquiry about ${inquiryType}`,
    html: baseTemplate(content, `${name} is interested in ${inquiryType}.`)
  });
};

// 3. ADMIN MESSAGE TO USER
export const sendAdminEmail = async ({ to, subject, message }) => {
  const content = `
    <div style="margin-bottom:36px;">
      <p style="font-size:13px; text-transform:uppercase; letter-spacing:2px; color:${TEXT_MUTED}; margin:0 0 8px;">A personal note from</p>
      <h2 style="font-size:28px; font-weight:900; margin:0; color:${BRAND_COLOR};">Munchkin Kittie</h2>
    </div>
    <div style="font-size:16px; line-height:1.8; color:#3f3f46; margin-bottom:40px; white-space:pre-wrap;">
      ${message}
    </div>
    <p style="font-size:14px; color:${TEXT_MUTED}; margin-bottom:24px;">
      If you have any questions, just reply to this email — we read every message.
    </p>
    <a href="https://munchkinkittie.com/contact" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      Get in touch
    </a>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to,
    subject: subject,
    html: baseTemplate(content, subject)
  });
};

// 4. APPLICATION RECEIVED
export const sendApplicationReceived = async ({ 
  email, 
  name, 
  paymentMethod, 
  paymentMethodOther, 
  kittenName = "a Munchkin companion"
}) => {
  const paymentDisplay = formatPaymentMethod(paymentMethod, paymentMethodOther);
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; margin:0 0 24px; color:${BRAND_COLOR};">
      We got your application, ${name}!
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Thanks for taking the time to tell us about yourself. Our team is now carefully reviewing your details.
    </p>
    
    <!-- KITTEN REFERENCE -->
    <div style="background:#f8fafc; border-left:4px solid ${BRAND_COLOR}; padding:16px 24px; margin-bottom:24px; border-radius:8px;">
      <p style="margin:0; font-size:14px; color:#3f3f46;">
        <strong>You applied for:</strong><br/>
        <span style="font-size:18px; font-weight:700; color:${BRAND_COLOR};">${kittenName}</span>
      </p>
    </div>

    <!-- PAYMENT METHOD SUMMARY -->
    <div style="background:#f8fafc; border-left:4px solid ${BRAND_COLOR}; padding:16px 24px; margin-bottom:32px; border-radius:8px;">
      <p style="margin:0; font-size:14px; color:#3f3f46;">
        <strong>Your chosen payment method:</strong><br/>
        <span style="font-size:18px; font-weight:700; color:${BRAND_COLOR};">${paymentDisplay}</span>
      </p>
    </div>

    <div style="display:inline-block; padding:12px 24px; border:2px solid ${BRAND_COLOR}; border-radius:14px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:${BRAND_COLOR}; margin-bottom:32px;">
      Status: Under Review
    </div>
    <p style="font-size:13px; color:${TEXT_MUTED};">
      Questions? <a href="https://munchkinkittie.com/contact" style="color:${BRAND_COLOR}; font-weight:700;">Reach out anytime</a>.
    </p>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: email,
    subject: "🐾 We’ve received your adoption application!",
    html: baseTemplate(content, `${name}, your application for ${kittenName} is now being reviewed.`)
  });
};

// 5. APPLICATION APPROVED
export const sendApplicationApproved = async (email, name) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; margin:0 0 24px; color:${ACCENT_GREEN};">
      You’re approved, ${name}! 🎉
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      We’re thrilled to let you know that your application has been accepted. A Munchkin kitten is waiting to meet you! The next step is to finalise the adoption details and schedule a meet‑and‑greet (virtual or in‑person).
    </p>
    <a href="https://munchkinkittie.com/adoption-next-steps" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      Complete your adoption
    </a>
    <p style="font-size:13px; color:${TEXT_MUTED}; margin-top:24px;">
      Not ready yet? <a href="https://munchkinkittie.com/contact" style="color:${BRAND_COLOR}; font-weight:700;">Let us know</a> — we’ll hold your spot.
    </p>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: email,
    subject: "Great news — your adoption is approved! 🎉",
    html: baseTemplate(content, `Congratulations ${name}, you've been approved! Next steps inside.`)
  });
};

// 6. APPLICATION REJECTED
export const sendApplicationRejected = async (email, name) => {
  const content = `
    <h2 class="heading-xl" style="font-size:42px; font-weight:900; letter-spacing:-2px; margin:0 0 24px; color:${BRAND_COLOR};">
      A note from us, ${name}
    </h2>
    <p class="body-text" style="font-size:16px; line-height:1.7; margin-bottom:32px; color:#3f3f46;">
      Thank you so much for your interest in giving a Munchkin cat a loving home. After careful consideration, we've decided not to move forward this time. This isn't a reflection of you as a pet parent — sometimes the match just needs different timing or circumstances.
    </p>
    <p style="font-size:16px; line-height:1.7; color:#3f3f46; margin-bottom:32px;">
      We encourage you to keep in touch if your situation changes, or if you'd like advice on other breeds that might suit you wonderfully.
    </p>
    <a href="https://munchkinkittie.com/available-kittens" class="button" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:16px 32px; border-radius:16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; text-decoration:none;">
      See other cats waiting
    </a>
  `;
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: email,
    subject: "Update on your adoption application",
    html: baseTemplate(content, `${name}, here's a personal update about your application.`)
  });
};

// 7. ADMIN NOTIFICATION – LOCATION REMOVED, DASHBOARD LINK UPDATED
export const sendApplicationAdminNotification = async (applicationData) => {
  const {
    fullName,
    email,
    phone,
    paymentMethod,
    paymentMethodOther,
    applicationType,
    homeDescription,
    hasPets,
    experience,
    kittenName = "Not specified"
  } = applicationData;

  const paymentDisplay = formatPaymentMethod(paymentMethod, paymentMethodOther);

  const content = `
    <h2 class="heading-lg" style="font-size:28px; font-weight:900; margin-bottom:32px; color:${BRAND_COLOR};">
      New adoption application
    </h2>
    <div style="background:#f8fafc; padding:32px; border-radius:16px; border:1px solid #e2e8f0;">
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Applicant</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${fullName} (${email}) ${phone ? `– ${phone}` : ""}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Application Type</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${applicationType}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Applying for</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${kittenName}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Payment Method</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${paymentDisplay}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Home Description</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${homeDescription}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Has Pets?</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${hasPets ? "Yes" : "No"}</p>
      
      <p style="margin:0 0 12px; font-size:10px; text-transform:uppercase; font-weight:900; color:${TEXT_MUTED}; letter-spacing:1.5px;">Experience</p>
      <p style="margin:0 0 24px; font-weight:700; font-size:15px;">${experience || "None given"}</p>
    </div>
    <p style="font-size:13px; color:${TEXT_MUTED}; margin-top:24px;">
      <a href="https://munchkinkittie.com/admin-dashboard" style="color:${BRAND_COLOR}; font-weight:700;">Review in admin dashboard</a>
    </p>
  `;
  
  await resend.emails.send({
    from: "Munchkin Kittie <info@munchkinkittie.com>",
    to: "info@munchkinkittie.com",
    subject: `📋 New application from ${fullName} for ${kittenName}`,
    html: baseTemplate(content, `${fullName} just applied for ${kittenName}.`)
  });
};