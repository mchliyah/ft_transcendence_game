import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exclude } from 'src/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService, private conf: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: conf.get('ACCESS_TOKEN_JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }): Promise<User> {
    const id = payload.sub;
    let user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('verify your 2fa first');
    }

    user = exclude(user, 'hash');
    user = exclude(user, 'twoFaSecret');

    return user;
  }
}
