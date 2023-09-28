import { Module } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';

@Module({
  imports: [],
  providers: [TwoFaService],
  exports: [TwoFaService],
})
export class TwoFaModule {}
