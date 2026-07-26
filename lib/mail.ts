import nodemailer from "nodemailer";
import { env } from "@/lib/env";

export async function sendMail(message: { to: string; subject: string; text: string }) {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.SMTP_FROM) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    ...message,
  });

  return { skipped: false };
}
