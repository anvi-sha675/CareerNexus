import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtp.host || !env.smtp.user) {
    logger.warn(
      "SMTP not configured — emails will be logged instead of sent. Set SMTP_* env vars to enable real delivery.",
    );
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
}

async function send({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    logger.info(
      `[email suppressed — no SMTP configured] To: ${to} | Subject: ${subject}`,
    );
    return { suppressed: true };
  }
  return t.sendMail({ from: env.smtp.from, to, subject, html });
}

const wrap = (title, bodyHtml) => `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color:#1e293b;">
    <h2 style="color:#2563EB; margin-bottom: 4px;">CareerNexus</h2>
    <h3 style="margin-top: 24px;">${title}</h3>
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color:#94a3b8;">— The CareerNexus Team</p>
  </div>`;

export const emailService = {
  sendWelcomeEmail(user) {
    return send({
      to: user.email,
      subject: "Welcome to CareerNexus",
      html: wrap(
        "Welcome aboard!",
        `<p>Hi ${user.name}, your CareerNexus account is ready. Complete your profile to start getting matched with the right opportunities.</p>`,
      ),
    });
  },
  sendVerificationEmail(user, rawToken) {
    const link = `${env.clientUrl}/verify-email?token=${rawToken}`;
    return send({
      to: user.email,
      subject: "Verify your email address",
      html: wrap(
        "Confirm your email",
        `<p>Click the link below to verify your email address:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`,
      ),
    });
  },
  sendPasswordResetEmail(user, rawToken) {
    const link = `${env.clientUrl}/reset-password?token=${rawToken}`;
    return send({
      to: user.email,
      subject: "Reset your password",
      html: wrap(
        "Password reset requested",
        `<p>Click the link below to set a new password. If you didn't request this, you can safely ignore this email.</p><p><a href="${link}">${link}</a></p><p>This link expires in 30 minutes.</p>`,
      ),
    });
  },
  sendApplicationConfirmation(user, job) {
    return send({
      to: user.email,
      subject: `Application received: ${job.title}`,
      html: wrap(
        "Application submitted",
        `<p>Your application for <strong>${job.title}</strong> has been submitted successfully. You can track its status from your dashboard.</p>`,
      ),
    });
  },
  sendInterviewInvitation(user, interview, job) {
    return send({
      to: user.email,
      subject: `Interview scheduled: ${job.title}`,
      html: wrap(
        "You've got an interview!",
        `<p>An interview for <strong>${job.title}</strong> has been scheduled on ${new Date(interview.scheduledDate).toDateString()} at ${interview.time}.</p>`,
      ),
    });
  },
  sendApplicationStatusUpdate(user, job, status) {
    return send({
      to: user.email,
      subject: `Application update: ${job.title}`,
      html: wrap(
        "Your application status changed",
        `<p>Your application for <strong>${job.title}</strong> is now: <strong>${status}</strong>.</p>`,
      ),
    });
  },
};
