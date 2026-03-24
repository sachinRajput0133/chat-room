export interface RoomUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Room {
  id: string;
  roomName: string;
  createdBy: RoomUser | null;
  participants: RoomUser[];
  createdAt: string;
}

export interface CreateRoomRequest {
  roomName: string;
}
