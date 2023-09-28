import { Module } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [JwtModule.register({}), MailerModule],
  providers: [ConfirmationService],
  exports: [ConfirmationService],
})
export class ConfirmationModule {}
