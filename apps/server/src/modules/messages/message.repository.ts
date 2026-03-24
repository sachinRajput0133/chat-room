import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(data: {
    roomId: string;
    senderId: string;
    content: string;
  }): Promise<MessageDocument> {
    const message = new this.messageModel({
      roomId: new Types.ObjectId(data.roomId),
      senderId: new Types.ObjectId(data.senderId),
      content: data.content,
      timestamp: new Date(),
    });
    return message.save();
  }

  async findByRoom(
    roomId: string,
    limit = 50,
    before?: Date,
  ): Promise<MessageDocument[]> {
    const query: Record<string, unknown> = { roomId: new Types.ObjectId(roomId) };
    if (before) {
      query['timestamp'] = { $lt: before };
    }
    return this.messageModel
      .find(query)
      .populate('senderId', 'firstName lastName email')
      .sort({ timestamp: 1 })
      .limit(limit)
      .exec();
  }
}
