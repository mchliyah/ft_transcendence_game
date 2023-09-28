import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ConfirmationService {
  constructor(
    private jwt: JwtService,
    private mailer: MailerService,
    private conf: ConfigService,
  ) {}
  async sendConfirmationEmail(email: string, subject: string) {
    try {
      const token = this.jwt.sign(
        { email },
        {
          expiresIn: '15m',
          secret: this.conf.get('EMAIL_VERIFICATION_JWT_SECRET'),
        },
      );
      let front_url: string;
      if (subject === 'Confirm your email')
        front_url = this.conf.get('FRONTEND_CONFIRM_EMAIL_URL');
      else front_url = this.conf.get('FRONTEND_SET_PASSWORD_URL');
      console.log(token);
      const url = `${front_url}/?token=${token}`;
      const html = `<a href="${url}">${subject}</a>`;
      console.log(html);
      await this.mailer.sendMail({
        from: this.conf.get('EMAIL_USER'),
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Sending  email failed', 500);
    }
  }
  async confirmEmail(token: string) {
    try {
      const payload = await this.jwt.verify(token, {
        secret: this.conf.get('EMAIL_VERIFICATION_JWT_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email token expired');
      }
      throw new BadRequestException('Bad email token');
    }
  }
}
