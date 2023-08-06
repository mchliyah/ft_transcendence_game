import { Get, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetwayModule } from './getway/getway.modules';

@Module({
  imports: [GetwayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
