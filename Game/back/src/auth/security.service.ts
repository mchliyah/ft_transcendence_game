import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { TwoFaService } from 'src/2fa/two-fa.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ConfirmationService } from 'src/confirmation/confirmation.service';
import { TAdd42CredentialsData } from 'src/dto';
import * as argon from 'argon2';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SecurityService {
  constructor(
    private tw: TwoFaService,
    private prisma: PrismaService,
    private confirmationService: ConfirmationService,
    private cloudinary: CloudinaryService,
  ) {}
  async generate2Fa(user: User, res: Response) {
    if (user.is2FaEnabled)
      throw new HttpException('2fa already enabled', HttpStatus.FORBIDDEN);
    const secret = await this.tw.generateSecret();
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        twoFaSecret: secret,
      },
    });
    const qr = await this.tw.generateQRCode(secret, user.email, res);

    return qr;
  }
  async enable2Fa(code: string, jwtUser: User) {
    //get the user from the db to check if 2fa is enabled because the 2fa secret is not returned by the jwt strategy for security reasons
    const user = await this.prisma.user.findUnique({
      where: { email: jwtUser.email },
    });
    if (user.twoFaSecret === null)
      throw new HttpException('generate 2fa qr code', HttpStatus.FORBIDDEN);
    const isValid = await this.tw.verifyToken(code, user.twoFaSecret);
    console.log(isValid);
    if (!isValid) throw new HttpException('invalid code', HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        is2FaEnabled: true,
        is2FaVerified: true,
      },
    });
  }
  async verify2Fa(token: string, user: User) {
    if (!user.is2FaEnabled)
      throw new HttpException('2fa not enabled', HttpStatus.FORBIDDEN);
    console.log(user.twoFaSecret);
    console.log(token);
    const isValid = await this.tw.verifyToken(token, user.twoFaSecret);
    if (!isValid) throw new HttpException('invalid code', HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        is2FaVerified: true,
      },
    });
  }
  async disable2Fa(user: User) {
    if (!user.is2FaEnabled)
      throw new HttpException('2fa already disabled', HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        is2FaEnabled: false,
        is2FaVerified: false,
        twoFaSecret: null,
      },
    });
  }
  async resendEmail(user: User) {
    if (user.isEmailConfirmed) {
      throw new ForbiddenException('email already confirmed');
    }
    this.confirmationService.sendConfirmationEmail(
      user.email,
      'Confirm your email',
    );
  }

  async setNewPasswordUsername(dto: TAdd42CredentialsData, user: User) {
    if (user.isPasswordRequired === false)
      throw new HttpException(
        'user already has a password',
        HttpStatus.FORBIDDEN,
      );
    const hash = await argon.hash(dto.password);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        hash,
        isPasswordRequired: false,
        username: dto.username,
      },
    });
  }
  async uploadAvatar(file: Express.Multer.File, user: User) {
    const result = await this.cloudinary.uploadFile(file);
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        avatar: result,
      },
    });
  }
}
