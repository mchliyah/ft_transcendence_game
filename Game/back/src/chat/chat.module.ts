import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { DMService } from './dm.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChannelService } from './channel.service';
import { FriendsService } from './friends.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ChatController],
  providers: [ChatGateway, DMService, ChannelService, FriendsService],
})
export class ChatModule {}
