import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

/* -------------------- MAIL TRANSPORTER -------------------- */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

/* -------------------- AUTH CONFIG -------------------- */
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
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

    /* -------------------- EMAIL VERIFICATION -------------------- */
    emailVerification: {
        sendOnSignUp: true,

        sendVerificationEmail: async ({ user, token }) => {
            try {
                const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;

                const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Email Verification</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
  }
  .wrapper {
    width: 100%;
    padding: 40px 0;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  }
  .header {
    background: #020817;
    color: #ffffff;
    padding: 20px;
    text-align: center;
  }
  .content {
    padding: 30px;
    color: #111827;
  }
  .content p {
    font-size: 15px;
    line-height: 1.6;
    color: #374151;
  }
  .btn {
    display: inline-block;
    margin: 25px 0;
    padding: 12px 24px;
    background: #2563eb;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
  }
  .footer {
    background: #f9fafb;
    padding: 15px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
  }
</style>
</head>

<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Prisma Blog</h1>
      </div>

      <div class="content">
        <h2>Hello ${user?.name || "there"} 👋</h2>

        <p>
          Thanks for signing up for <strong>Prisma Blog</strong>.
          Please verify your email address by clicking the button below.
        </p>

        <a href="${verificationURL}" class="btn">
          Verify Email
        </a>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; color:#2563eb;">
          ${verificationURL}
        </p>

        <p style="font-size:13px; margin-top:30px;">
          If you didn’t create an account, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

                const info = await transporter.sendMail({
                    from: '"Prisma Blog APP" <prismaBlog@ph.com>',
                    to: user.email,
                    subject: "Verify your email address",
                    html: emailTemplate,
                });

                console.log("Verification email sent:", info.messageId);
            } catch (error) {
                console.error("Failed to send verification email:", error);
                throw new Error("Email verification failed");
            }
        },
    },

    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
