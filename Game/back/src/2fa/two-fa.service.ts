import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFaService {
  constructor(private conf: ConfigService) {}
  async generateSecret() {
    const secret = authenticator.generateSecret();

    return secret;
  }
  async generateQRCode(secret: string, email: string, res: Response) {
    const otpAuthUrl = authenticator.keyuri(
      email,
      this.conf.get('AUTH_APP_NAME'),
      secret,
    );

    return toFileStream(res, otpAuthUrl);
  }
  async verifyToken(token: string, secret: string) {
    console.log(token, secret, 'token, secret');
    const isValid = authenticator.verify({ token, secret });
    console.log(isValid, 'isValid');

    return isValid;
  }
}
