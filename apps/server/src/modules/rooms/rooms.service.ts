import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async create(dto: CreateRoomDto, userId: string) {
    const saved = await this.roomRepository.create({
      roomName: dto.roomName,
      createdBy: userId,
    });
    // Re-fetch with $lookup so createdBy/participants have full user objects
    const room = await this.roomRepository.findById(saved._id.toString());
    return this.formatRoom(room);
  }

  async findAll() {
    const rooms = await this.roomRepository.findAll();
    return rooms.map((r) => this.formatRoom(r));
  }

  async join(roomId: string, userId: string) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    const updated = await this.roomRepository.addParticipant(roomId, userId);
    return this.formatRoom(updated!);
  }

  async findById(roomId: string) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatUser(u: any) {
    if (!u) return null;
    // populated document
    if (u._id) {
      const id = u._id.toString() as string;
      const email = (u.email as string | undefined)?.trim() ?? '';
      const rawFirst = (u.firstName as string | undefined)?.trim() ?? '';
      const rawLast = (u.lastName as string | undefined)?.trim() ?? '';
      // Use email local-part or a short ID stub when name fields are blank
      const firstName = rawFirst || email.split('@')[0] || `User-${id.slice(-4)}`;
      const lastName = rawLast;
      return { id, firstName, lastName, email };
    }
    // bare ObjectId — not populated (user document missing)
    const id = u.toString() as string;
    return { id, firstName: `User-${id.slice(-4)}`, lastName: '', email: '' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatRoom(room: any) {
    return {
      id: room._id.toString(),
      roomName: room.roomName,
      createdBy: this.formatUser(room.createdBy),
      participants: (room.participants || []).map((p: any) => this.formatUser(p)),
      createdAt: room.createdAt,
    };
  }
}
