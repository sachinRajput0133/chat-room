import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageResponse } from '../../types/message.types';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async create(data: {
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
  }): Promise<MessageResponse> {
    const message = await this.messageRepository.create({
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content,
    });

    return {
      id: (message._id as object).toString(),
      roomId: message.roomId.toString(),
      senderId: message.senderId.toString(),
      senderName: data.senderName,
      content: message.content,
      timestamp: message.timestamp,
    };
  }

  async findByRoom(roomId: string, limit = 50): Promise<MessageResponse[]> {
    const messages = await this.messageRepository.findByRoom(roomId, limit);
    return messages.map((m) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sender = m.senderId as any;
      const senderName = sender?.firstName
        ? `${sender.firstName} ${sender.lastName}`
        : sender?.toString() || '';

      return {
        id: (m._id as object).toString(),
        roomId: m.roomId.toString(),
        senderId: sender?._id?.toString() || m.senderId.toString(),
        senderName,
        content: m.content,
        timestamp: m.timestamp,
      };
    });
  }
}
