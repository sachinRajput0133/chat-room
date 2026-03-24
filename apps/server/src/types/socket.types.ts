import { MessageResponse } from './message.types';

export interface ServerToClientEvents {
  new_message: (message: MessageResponse) => void;
  user_joined: (payload: { userId: string; name: string; roomId: string }) => void;
  user_left: (payload: { userId: string; name: string; roomId: string }) => void;
  error: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (payload: { roomId: string }) => void;
  leave_room: (payload: { roomId: string }) => void;
  send_message: (payload: { roomId: string; content: string }) => void;
}
