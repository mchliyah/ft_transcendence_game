import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TwoFaModule } from './2fa/two-fa.module';
import { ChatModule } from './chat/chat.module';
import { GetwayModule } from './getway/getway.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MailerModule,
    ConfirmationModule,
    TwoFaModule,
    CloudinaryModule,
    ChatModule,
    GetwayModule,
  ],
})
export class AppModule {}
