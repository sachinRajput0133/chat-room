'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetMessagesQuery } from '../../store/api/messagesApi';
import { setRoomMessages } from '../../store/slices/messagesSlice';
import { RootState } from '../../store';
import { Room } from '../../types/room.types';
import RoomListItem from './RoomListItem';

interface RoomPreviewProps {
  room: Room;
  isActive: boolean;
  onClick: () => void;
}

export default function RoomPreview({ room, isActive, onClick }: RoomPreviewProps) {
  const dispatch = useDispatch();

  // Fetch REST history once for initial sidebar preview
  const { data: restMessages = [] } = useGetMessagesQuery(room.id, {
    refetchOnMountOrArgChange: false,
  });

  // Real-time messages land here via useSocketAllRooms → addMessage
  const storeMessages = useSelector(
    (state: RootState) => state.messages.byRoom[room.id],
  );

  // Seed Redux from REST on first load so addMessage has a base to append to
  useEffect(() => {
    if (restMessages.length > 0 && !storeMessages) {
      dispatch(setRoomMessages({ roomId: room.id, messages: restMessages }));
    }
  }, [restMessages, storeMessages, room.id, dispatch]);

  const unreadCount = useSelector(
    (state: RootState) => state.messages.unreadCounts[room.id] ?? 0,
  );

  // Prefer Redux store (has real-time socket messages) over bare REST cache
  const messages = storeMessages ?? restMessages;
  const lastMessage = messages[messages.length - 1];

  return (
    <RoomListItem
      room={room}
      lastMessage={lastMessage}
      unreadCount={unreadCount}
      isActive={isActive}
      onClick={onClick}
    />
  );
}
