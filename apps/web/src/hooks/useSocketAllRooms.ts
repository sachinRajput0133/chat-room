'use client';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../lib/socket';
import { addMessage, incrementUnread } from '../store/slices/messagesSlice';
import { baseApi } from '../store/api/baseApi';
import { RootState } from '../store';
import { Message } from '../types/message.types';
import { Room } from '../types/room.types';

/**
 * Joins ALL room socket channels so that new_message events from any room
 * update the Redux store — keeping sidebar previews live in real-time.
 * Also listens for room_created so new rooms appear instantly without reload.
 */
export function useSocketAllRooms(token: string | null, rooms: Room[]) {
  const dispatch = useDispatch();
  // Use a ref so the socket listener always reads the latest activeRoomId without stale closure
  const activeRoomIdRef = useRef<string | null>(null);
  activeRoomIdRef.current = useSelector((state: RootState) => state.rooms.activeRoomId);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    const joinAll = () => {
      rooms.forEach((room) => {
        socket.emit('join_room', { roomId: room.id });
      });
    };

    // Listen for new messages across all rooms
    socket.off('new_message');
    socket.on('new_message', (message: Message) => {
      dispatch(addMessage(message));
      // Only increment unread if this message is NOT from the currently open room
      if (message.roomId !== activeRoomIdRef.current) {
        dispatch(incrementUnread(message.roomId));
      }
    });

    // Listen for newly created rooms — add to RTK Query cache instantly
    socket.off('room_created');
    socket.on('room_created', (room: Room) => {
      dispatch(
        baseApi.util.updateQueryData('getRooms', undefined, (draft) => {
          const exists = draft.some((r) => r.id === room.id);
          if (!exists) {
            draft.unshift(room);
          }
        }),
      );
    });

    if (socket.connected) {
      joinAll();
    } else {
      socket.once('connect', joinAll);
    }

    return () => {
      socket.off('new_message');
      socket.off('room_created');
    };
  }, [token, rooms, dispatch]);
}
