import { Resend } from 'resend';
import { logger } from '@/utils/logger';

class EmailService {
  constructor(
    private resend: Resend
  ) {}

  async send(
    to: Email,
    subject: string,
    html: string
  ) {
    const { error } = await this.resend.emails.send({
      from: process.env.RESEND_FROM!,
      to,
      subject,
      html
    });

    if (error) {
      logger.error({
        service: 'resend',
        cause: error
      }, 'Failed to send email');
    }
  }
}

export const emailService = new EmailService(
  new Resend(process.env.RESEND_API_KEY)
);
