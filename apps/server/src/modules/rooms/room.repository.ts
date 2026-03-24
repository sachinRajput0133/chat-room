import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './room.schema';

/** Shared $lookup + $addFields pipeline to join createdBy and participants from users */
const WITH_USERS_PIPELINE = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdByUser',
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'participants',
      foreignField: '_id',
      as: 'participantUsers',
    },
  },
  {
    $addFields: {
      createdBy: { $arrayElemAt: ['$createdByUser', 0] },
      participants: '$participantUsers',
    },
  },
  { $unset: ['createdByUser', 'participantUsers'] },
];

@Injectable()
export class RoomRepository {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(data: { roomName: string; createdBy: string }): Promise<RoomDocument> {
    const room = new this.roomModel({
      roomName: data.roomName,
      createdBy: new Types.ObjectId(data.createdBy),
      participants: [new Types.ObjectId(data.createdBy)],
    });
    return room.save();
  }

  async findAll(): Promise<any[]> {
    return this.roomModel
      .aggregate([
        { $sort: { createdAt: -1 } },
        ...WITH_USERS_PIPELINE,
      ])
      .exec();
  }

  async findById(id: string): Promise<any | null> {
    const results = await this.roomModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        ...WITH_USERS_PIPELINE,
      ])
      .exec();
    return results[0] ?? null;
  }

  async addParticipant(roomId: string, userId: string): Promise<any | null> {
    await this.roomModel
      .findByIdAndUpdate(
        roomId,
        { $addToSet: { participants: new Types.ObjectId(userId) } },
      )
      .exec();
    return this.findById(roomId);
  }

  async removeParticipant(roomId: string, userId: string): Promise<any | null> {
    await this.roomModel
      .findByIdAndUpdate(
        roomId,
        { $pull: { participants: new Types.ObjectId(userId) } },
      )
      .exec();
    return this.findById(roomId);
  }
}
