import { Message } from './message.types';
import { Room } from './room.types';

export interface SocketUserEvent {
  userId: string;
  name: string;
  roomId: string;
}

export interface ServerToClientEvents {
  new_message: (message: Message) => void;
  room_created: (room: Room) => void;
  user_joined: (payload: SocketUserEvent) => void;
  user_left: (payload: SocketUserEvent) => void;
  error: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (payload: { roomId: string }) => void;
  leave_room: (payload: { roomId: string }) => void;
  send_message: (payload: { roomId: string; content: string }) => void;
}
