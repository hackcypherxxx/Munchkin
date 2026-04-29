import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReviewEmail = async (toEmail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Munchkin Nursery <info@munchkinkittie.com>",
      to: toEmail,
      subject: "Thanks for your review ❤️",
      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f9fafb; padding:40px 20px;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <h2 style="margin:0; font-size:24px; color:#111827; font-weight:700;">
              Munchkin Nursery
            </h2>
            <p style="margin:4px 0 24px; font-size:12px; color:#6b7280; letter-spacing:1px; text-transform:uppercase;">
              Verified Breeding Program
            </p>

            <div style="height:1px; background:#f1f5f9; margin:20px 0;"></div>

            <!-- Body -->
            <h3 style="font-size:20px; color:#111827; margin-bottom:16px;">
              Thank you for your review 🐾
            </h3>

            <p style="font-size:15px; color:#4b5563; line-height:1.6; margin-bottom:16px;">
              We truly appreciate you taking the time to share your experience with us.
              Your feedback helps maintain the integrity and transparency of our nursery.
            </p>

            <p style="font-size:15px; color:#4b5563; line-height:1.6; margin-bottom:16px;">
              Our team will carefully review your submission before it is published to ensure it aligns with our standards.
            </p>

            <p style="font-size:15px; color:#4b5563; line-height:1.6; margin-bottom:24px;">
              We look forward to hearing from you again in the future.
            </p>

            <!-- CTA -->
            <div style="margin:30px 0;">
              <a href="https://yourwebsite.com"
                 style="display:inline-block; padding:12px 24px; background:#111827; color:#ffffff; text-decoration:none; border-radius:999px; font-size:12px; letter-spacing:1px; text-transform:uppercase;">
                Visit Our Nursery
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top:40px; font-size:12px; color:#9ca3af; line-height:1.6;">
              <p style="margin:0;">
                Munchkin Nursery<br/>
                Ethical Breeding • Health Certified • Registry Verified
              </p>
              <p style="margin-top:8px;">
                This message was sent regarding your recent interaction with our nursery.
              </p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
    } else {
      console.log("✅ Email sent:", data);
    }

  } catch (err) {
    console.error("🔥 Email crash:", err);
  }
};  


export const sendContactEmail = async (data) => {
  try {
    const { name, email, inquiryType, message } = data;

    const { data: resData, error } = await resend.emails.send({
      from: "Munchkin Nursery <info@munchkinkittie.com>",
      to: "info@munchkinkittie.com", // 🔥 YOUR ADMIN EMAIL
      subject: `New Inquiry - ${inquiryType}`,
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>New Contact Inquiry</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${inquiryType}</p>

          <hr/>

          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Contact email error:", error);
    } else {
      console.log("✅ Contact email sent:", resData);
    }

  } catch (err) {
    console.error("🔥 Contact email crash:", err);
  }
};

export const sendAdminEmail = async ({ to, subject, message }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Munchkin Nursery <info@munchkinkittie.com>",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">

            <!-- Header -->
            <h2 style="margin:0; font-size:24px; color:#111827; font-weight:700;">
              Munchkin Nursery
            </h2>
            <p style="margin:4px 0 24px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">
              Verified Breeding Program
            </p>

            <div style="height:1px; background:#f1f5f9; margin:20px 0;"></div>

            <!-- Message -->
            <div style="font-size:15px; color:#374151; line-height:1.7;">
              ${message}
            </div>

            <!-- CTA -->
            <div style="margin:30px 0;">
              <a href="https://yourwebsite.com"
                style="display:inline-block; padding:12px 24px; background:#111827; color:#fff; border-radius:999px; text-decoration:none; font-size:12px; text-transform:uppercase;">
                Visit Nursery
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top:40px; font-size:12px; color:#9ca3af;">
              <p>Munchkin Nursery</p>
              <p>Ethical Breeding • Health Certified • Registry Verified</p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Admin email error:", error);
    } else {
      console.log("✅ Admin email sent:", data);
    }

  } catch (err) {
    console.error("🔥 Email crash:", err);
  }
};

export const sendApplicationReceived = async (email, name) => {
  await resend.emails.send({
    from: "Munchkin Nursery <info@munchkinkittie.com>",
    to: email,
    subject: "Application Received 🐾",
    html: `
      <h2>Hello ${name},</h2>
      <p>We’ve received your adoption application.</p>
      <p>Our team will review it carefully and get back to you shortly.</p>
    `,
  });
};

export const sendApplicationApproved = async (email, name) => {
  await resend.emails.send({
    from: "Munchkin Nursery <info@munchkinkittie.com>",
    to: email,
    subject: "Application Approved 🎉",
    html: `
      <h2>Congratulations ${name},</h2>
      <p>Your application has been approved!</p>
      <p>We will contact you shortly to proceed with the adoption.</p>
    `,
  });
};

export const sendApplicationRejected = async (email, name) => {
  await resend.emails.send({
    from: "Munchkin Nursery <info@munchkinkittie.com>",
    to: email,
    subject: "Application Update",
    html: `
      <p>Hello ${name},</p>
      <p>Thank you for your interest. Unfortunately, we cannot proceed at this time.</p>
      <p>We appreciate your understanding.</p>
    `,
  });
};