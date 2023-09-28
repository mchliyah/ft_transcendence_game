import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    console.log(
      configService.getOrThrow('EMAIL_PASSWORD'),
      configService.get('EMAIL_USER'),
    );
    this.nodemailerTransport = createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
