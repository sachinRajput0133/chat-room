import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MessagesService } from '../modules/messages/messages.service';
import { RoomsService } from '../modules/rooms/rooms.service';
import { JwtPayload } from '../types/auth.types';

interface AuthenticatedSocket extends Socket {
  user: JwtPayload;
}

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
    private readonly roomsService: RoomsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.headers?.authorization?.replace('Bearer ', '') ?? '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      client.user = payload;
      this.logger.log(
        `Client connected: ${client.id} | User: ${payload.email}`,
        'ChatGateway',
      );
    } catch {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`, 'ChatGateway');
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(
      `Client disconnected: ${client.id}`,
      'ChatGateway',
    );
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string },
  ) {
    try {
      const room = await this.roomsService.findById(payload.roomId);
      if (!room) {
        throw new WsException('Room not found');
      }

      client.join(payload.roomId);

      this.server.to(payload.roomId).emit('user_joined', {
        userId: client.user.sub,
        name: `${client.user.firstName} ${client.user.lastName}`,
        roomId: payload.roomId,
      });

      this.logger.log(
        `User ${client.user.email} joined room ${payload.roomId}`,
        'ChatGateway',
      );
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.leave(payload.roomId);

    this.server.to(payload.roomId).emit('user_left', {
      userId: client.user.sub,
      name: `${client.user.firstName} ${client.user.lastName}`,
      roomId: payload.roomId,
    });

    this.logger.log(
      `User ${client.user.email} left room ${payload.roomId}`,
      'ChatGateway',
    );
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string; content: string },
  ) {
    try {
      if (!payload.content?.trim()) {
        throw new WsException('Message content cannot be empty');
      }

      const senderName = `${client.user.firstName} ${client.user.lastName}`;
      const message = await this.messagesService.create({
        roomId: payload.roomId,
        senderId: client.user.sub,
        senderName,
        content: payload.content.trim(),
      });

      this.server.to(payload.roomId).emit('new_message', message);
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }
}
