'use client';
import { useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';
import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket.types';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Per-room hook: handles join/leave for the active room and exposes sendMessage.
 * new_message listening is handled globally by useSocketAllRooms.
 */
export function useSocket(token: string | null, roomId: string | null) {
  const socketRef = useRef<AppSocket | null>(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    const joinRoom = () => socket.emit('join_room', { roomId });

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
    }

    return () => {
      socket.emit('leave_room', { roomId });
    };
  }, [token, roomId]);

  const sendMessage = (content: string) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('send_message', { roomId, content });
    }
  };

  return { sendMessage };
}
