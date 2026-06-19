import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = this.configService.get<string>('APP_URL') || 'http://localhost:5173';
    const resetLink = `${resetUrl}/reset-password?token=${token}`;

    const html = `
      <h1>Reset Password</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    if (this.transporter) {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM') || 'noreply@coderium.com',
        to: email,
        subject: 'Password Reset Request',
        html,
      });
    } else {
      console.log('[EmailService] SMTP not configured. Password reset link:');
      console.log(`  Email: ${email}`);
      console.log(`  Reset Link: ${resetLink}`);
      console.log(`  Token: ${token}`);
    }
  }
}
