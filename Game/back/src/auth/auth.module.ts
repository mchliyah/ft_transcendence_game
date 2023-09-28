import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, Strategy42 } from '../strategies';
import { ConfirmationModule } from 'src/confirmation/confirmation.module';
import { TwoFaModule } from 'src/2fa/two-fa.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    ConfirmationModule,
    TwoFaModule,
    CloudinaryModule,
  ],
  controllers: [AuthController, SecurityController],
  providers: [AuthService, JwtStrategy, Strategy42, SecurityService],
})
export class AuthModule {}
