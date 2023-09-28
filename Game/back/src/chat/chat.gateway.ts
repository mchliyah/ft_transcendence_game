import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { DMService } from './dm.service';
import { ChannelService } from './channel.service';
import { FriendsService } from './friends.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private dmService: DMService,
    private channelService: ChannelService,
    private friendsService: FriendsService,
  ) {}
  @WebSocketServer() io: Server;
  private connectedUsers: { clientId: string; username: string }[] = [];

  afterInit() {
    console.log('Initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.query.token;
    try {
      const user = await this.dmService.verifyToken(token);
      this.connectedUsers.push({
        clientId: client.id,
        username: user.username,
      });
      console.log(this.connectedUsers);
      const offlineChannels =
        await this.channelService.getOfflineDeletedChannels(user.id);
      if (offlineChannels.length > 0) {
        const socket = this.io.sockets[client.id];
        offlineChannels.forEach((channel) => {
          socket.leave(channel.name);
        });
        this.channelService.leaveOfflineDetetedChannels(
          offlineChannels,
          user.id,
        );
      }
      const offlineMessages = await this.dmService.getOfflineMessages(user.id);
      const offlineInvitations =
        await this.channelService.getOfflineInvitations(user.id);
      const offlineChannelMessages =
        await this.channelService.getOfflineChannelMessages(user.id);
      const offlineFriendRequests =
        await this.dmService.getOfflineFriendRequests(user.id);
      if (offlineChannelMessages.length > 0) {
        client.emit('offline channel messages', offlineChannelMessages);
        this.channelService.deleteOfflineChannelMessages(
          offlineChannelMessages,
        );
      }
      if (offlineMessages.length > 0) {
        client.emit('offline messages', offlineMessages);
        this.dmService.changeOfflineMessagesStatus(offlineMessages);
      }
      if (offlineInvitations.length > 0) {
        client.emit('offline invitations', offlineInvitations);
        this.channelService.changeOfflineInvitationsStatus(offlineInvitations);
      }
      if (offlineFriendRequests.length > 0) {
        client.emit('offline friend requests', offlineFriendRequests);
        this.dmService.changeOfflineFriendRequestsStatus(offlineFriendRequests);
      }
    } catch (err) {
      client.disconnect();
      console.error('Authentication failed:', err.message);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.clientId !== client.id,
    );
    console.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('private message')
  async handlePrivateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const sender = this.connectedUsers.find(
      (user) => user.clientId === client.id,
    );
    const receiver = this.connectedUsers.find(
      (user) => user.username === data.to,
    );
    const sentAt = new Date();
    let isPending = true;
    if (receiver) isPending = false;
    await this.dmService.saveMessage({
      sender: sender.username,
      receiver: receiver.username,
      message: data.message,
      date: sentAt,
      isPending,
    });
    if (receiver) {
      this.io.to(receiver.clientId).emit('private message', {
        from: sender.username,
        message: data.message,
      });
    }
  }
  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (data.type === 'protected' && !data.password) {
        throw new Error('password is required for protected rooms');
      }
      const owner = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      );
      await this.channelService.createChannel(
        data.room,
        owner.username,
        data.type,
        data.password ? data.password : null,
      );
      client.join(data.room);
      this.io.to(data.room).emit('roomCreated', { room: data.room });

      return { event: 'roomCreated', room: data.room };
    } catch (err) {
      return { event: 'roomCreationError', error: err.message };
    }
  }
  @SubscribeMessage('sendRoomInvitation')
  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      if (data.type === 'protected' && !data.password) {
        throw new Error('password is required for protected rooms');
      }
      const user = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      );
      await this.channelService.joinChannel(
        data.room,
        user.username,
        data.type,
        data.password ? data.password : null,
      );
      client.join(data.room);
      this.io.to(data.room).emit('roomJoined', `${user.username} joined`);
    } catch (err) {
      return { event: 'roomJoinError', error: err.message };
    }
  }

  @SubscribeMessage('sendRoomMessage')
  async sendRoomMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const sender = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      );
      const sentAt = new Date();
      await this.channelService.saveMessagetoChannel({
        sender: sender.username,
        room: data.room,
        message: data.message,
        date: sentAt,
      });
      await this.channelService.createOfflineChannelMessages(
        this.connectedUsers,
        data.room,
        data.message,
        sender.username,
        sentAt,
      );
      this.io.to(data.room).emit('roomMessage', {
        from: sender.username,
        message: data.message,
        room: data.room,
      });
    } catch (err) {
      return { event: 'roomMessageError', error: err.message };
    }
  }

  async sendRoomInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const sender = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      );
      const receiver = this.connectedUsers.find(
        (user) => user.username === data.to,
      );
      let isReceiverOnline = false;
      await this.channelService.saveInvitation({
        sender: sender.username,
        receiver: data.to,
        room: data.room,
        isReceiverOnline,
      });
      if (receiver) {
        isReceiverOnline = true;
        this.io.to(receiver.clientId).emit('room invitation', {
          from: sender.username,
          room: data.room,
        });
      }
    } catch (err) {
      return { event: 'roomInvitationError', error: err.message };
    }
  }
  @SubscribeMessage('handleRoomInvitation')
  async handleRoomInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.handleChannelInvitation({
        sender: data.from,
        receiver: clientUsername,
        room: data.room,
        isAccepted: data.isAccepted,
      });
      if (data.isAccepted) {
        client.join(data.room);
        this.io
          .to(data.room)
          .emit('roomJoined', `${clientUsername} joind ${data.room}`);
      } else {
        client
          .to(data.room)
          .emit('roomInvitationDeclined', { room: data.room });
      }
    } catch (err) {
      return { event: 'roomInvitationError', error: err.message };
    }
  }
  @SubscribeMessage('leaveRoom')
  async leaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.leaveChannel(data, clientUsername);
      client.leave(data.room);
      this.io.to(data.room).emit('roomLeft', `${clientUsername} left`);
    } catch (err) {
      return { event: 'roomLeaveError', error: err.message };
    }
  }
  @SubscribeMessage('kickUser')
  async kickUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.kickUser(
        data.room,
        clientUsername,
        data.target,
      );
      client.leave(data.room);
      this.io.to(data.room).emit('userKicked', `${data.user} kicked`);
    } catch (err) {
      return { event: 'userKickError', error: err.message };
    }
  }
  @SubscribeMessage('addAdmin')
  async addAdmin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.addAdmin(
        data.room,
        clientUsername,
        data.target,
      );
      this.io.to(data.room).emit('adminAdded', `${data.target} is admin now`);
    } catch (err) {
      return { event: 'adminAddError', error: err.message };
    }
  }
  @SubscribeMessage('banneUser')
  async banneUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.banUser(data.room, clientUsername, data.target);
      client.leave(data.room);
      this.io.to(data.room).emit('userBanned', `${data.target} banned`);
    } catch (err) {
      return { event: 'userBanError', error: err.message };
    }
  }
  @SubscribeMessage('unbanUser')
  async unbanUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.unbanUser(
        data.room,
        clientUsername,
        data.target,
      );
      this.io.to(data.room).emit('userUnbanned', `${data.target} unbanned`);
    } catch (err) {
      return { event: 'userUnbanError', error: err.message };
    }
  }
  @SubscribeMessage('muteUser')
  async muteUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const clientUsername = this.connectedUsers.find(
      (user) => user.clientId === client.id,
    ).username;
    await this.channelService.muteUser(data.room, clientUsername, data.target);
    this.io.to(data.room).emit('userMuted', `${data.target} muted`);
  }
  catch(err: Error) {
    return { event: 'userMuteError', error: err.message };
  }
  @SubscribeMessage('unmuteUser')
  async unmuteUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.channelService.unmuteUser(
        data.room,
        clientUsername,
        data.target,
      );
      this.io.to(data.room).emit('userUnmuted', `${data.target} unmuted`);
    } catch (err) {
      return { event: 'userUnmuteError', error: err.message };
    }
  }
  @SubscribeMessage('sendFriendRequest')
  async addFriend(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      const receiver = this.connectedUsers.find(
        (user) => user.username === data.target,
      );
      let isOnline = false;
      if (receiver) isOnline = true;
      await this.dmService.sendFriendRequest(
        clientUsername,
        data.target,
        isOnline,
      );
      if (receiver) {
        this.io.to(receiver.clientId).emit('frienRequest', {
          from: clientUsername,
        });
      }
    } catch (err) {
      return { event: 'friendRequestError', error: err.message };
    }
  }
  @SubscribeMessage('handleFriendRequest')
  async handleFriendRequest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      const receiver = this.connectedUsers.find(
        (user) => user.username === data.from,
      );
      let isOnline = false;
      if (receiver) isOnline = true;
      await this.friendsService.handleFriendRequest(
        clientUsername,
        data.from,
        data.isAccepted,
        isOnline,
      );
      if (receiver) {
        if (data.isAccepted) {
          this.io.to(receiver.clientId).emit('friendRequestAccepted', {
            from: clientUsername,
          });
        } else {
          this.io.to(receiver.clientId).emit('friendRequestDeclined', {
            from: clientUsername,
          });
        }
      }
    } catch (err) {
      return { event: 'friendRequestError', error: err.message };
    }
  }
  @SubscribeMessage('removeFriend')
  async removeFriend(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.friendsService.removeFriend(clientUsername, data.target);
      this.io.to(client.id).emit('friendRemoved');
    } catch (err) {
      return { event: 'friendRemoveError', error: err.message };
    }
  }
  @SubscribeMessage('blockUser')
  async blockUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.friendsService.blockUser(clientUsername, data.target);
      this.io.to(client.id).emit('userBlocked');
    } catch (err) {
      return { event: 'userBlockError', error: err.message };
    }
  }
  @SubscribeMessage('unblockUser')
  async unblockUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      await this.friendsService.unblockUser(clientUsername, data.target);
      this.io.to(client.id).emit('userUnblocked');
    } catch (err) {
      return { event: 'userUnblockError', error: err.message };
    }
  }
  @SubscribeMessage('deleteChannel')
  async deleteChannel(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientUsername = this.connectedUsers.find(
        (user) => user.clientId === client.id,
      ).username;
      this.io.to(data.room).emit('channelDeleted');
      await this.channelService.deleteChannel(
        data.room,
        clientUsername,
        this.io,
        this.connectedUsers,
      );
      //leave room for all online participants
    } catch (err) {
      return { event: 'channelDeleteError', error: err.message };
    }
  }
}
