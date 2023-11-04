import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface MailSender {
  to: string;
  subject: string;
  template: string;
  context: object;
};

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmail(config: MailSender) {    
        await this.mailerService.sendMail({
          to: config.to,
          subject: config.subject,
          template: config.template,
          context: config.context,
        });
      }
}
