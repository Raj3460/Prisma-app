import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// nodemailer transporter setup (for demonstration purposes, using Ethereal Email)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

console.log(process.env.APP_PASS, "**************", process.env.APP_USER);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
 // emailVerification অবজেক্ট
// এখানে ইমেইল ভেরিফিকেশন সংক্রান্ত সব লজিক থাকবে
emailVerification: {
  
  // ইউজারকে ভেরিফিকেশন ইমেইল পাঠানোর ফাংশন
  sendVerificationEmail: async ({ user, token , url }, request) => {

    // ===============================
    // 1️⃣ Verification URL তৈরি
    // ===============================
    // APP_URL = তোমার backend / frontend এর base URL
    // token query হিসেবে পাঠানো হচ্ছে
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

    // ===============================
    // 2️⃣ Nodemailer দিয়ে ইমেইল পাঠানো
    // ===============================
    const info = await transporter.sendMail({

      // ইমেইল কোথা থেকে যাচ্ছে
      from: '"Prisma Blog" <prismabyraj@tmail.com>',

      // যাকে ইমেইল পাঠানো হবে (ডাইনামিক)
      to: user.email,

      // ইমেইলের সাবজেক্ট
      subject: "Verify your email - Prisma Blog",

      // Plain text fallback (HTML না দেখালে কাজে আসবে)
      text: `Verify your email using this link: ${verificationUrl}`,

      // ===============================
      // 3️⃣ HTML Email Template
      // ===============================
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  
  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">

        <!-- Main email container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- ================= Header ================= -->
          <tr>
            <td style="background:#0f172a; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
            </td>
          </tr>

          <!-- ================= Body ================= -->
          <tr>
            <td style="padding:30px; color:#334155;">
              
              <h2 style="margin-top:0;">Verify your email address</h2>

              <!-- User email -->
              <p>
                Hi <strong>${user.email}</strong>,
              </p>

              <!-- Message -->
              <p>
                Thank you for creating an account on Prisma Blog.
                Please verify your email address by clicking the button below.
              </p>

              <!-- ================= Verify Button ================= -->
              <div style="text-align:center; margin:30px 0;">
                <a
                  href="${verificationUrl}"
                  style="
                    background:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <!-- Fallback link -->
              <p>
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; color:#2563eb;">
                ${verificationUrl}
              </p>

              <!-- Expiration notice -->
              <p style="margin-top:30px;">
                This verification link will expire soon for security reasons.
              </p>

              <!-- Signature -->
              <p>
                Thanks,<br />
                <strong>Prisma Blog Team</strong>
              </p>
            </td>
          </tr>

          <!-- ================= Footer ================= -->
          <tr>
            <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#64748b;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`
    });

    // ===============================
    // 4️⃣ সফল হলে Console log
    // ===============================
    console.log("Verification email sent successfully:", info.messageId);
  },
},

});


