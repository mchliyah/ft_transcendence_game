import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils';
import { generateRandomAvatar } from 'src/utils/generate-random-avatar';

@Injectable()
export class Strategy42 extends PassportStrategy(Strategy, '42') {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('UID_42'),
      clientSecret: configService.get('SECRET_42'),
      callbackURL: 'http://localhost:3001/auth/42/callback',
      profileFields: {
        login: 'login',
        email: 'email',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    console.log('validate called');
    const { login, email } = profile;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    let payload: User;
    if (!user) {
      const avatar = generateRandomAvatar(this.configService);
      payload = await this.prisma.user.create({
        data: {
          email,
          login,
          isPasswordRequired: true,
          isEmailConfirmed: true,
          avatar,
        },
      });
    } else {
      payload = await this.prisma.user.update({
        where: { email },
        data: {
          login,
          isEmailConfirmed: true,
        },
      });
    }
    payload = exclude(payload, 'hash');
    payload = exclude(payload, 'twoFaSecret');

    return payload;
  }
}
