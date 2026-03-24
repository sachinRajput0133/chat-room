'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../store/api/messagesApi';
import { useGetRoomsQuery } from '../../store/api/roomsApi';
import { setRoomMessages, clearRoomMessages } from '../../store/slices/messagesSlice';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { RootState } from '../../store';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatPanelProps {
  roomId: string;
}

export default function ChatPanel({ roomId }: ChatPanelProps) {
  const dispatch = useDispatch();
  const { user, token } = useAuth();

  // Always refetch on mount so switching rooms shows latest messages
  const { data: messages } = useGetMessagesQuery(roomId, {
    refetchOnMountOrArgChange: true,
  });

  const { data: rooms, isLoading: roomsLoading } = useGetRoomsQuery();
  const room = (rooms ?? []).find((r) => r.id === roomId);
  const { sendMessage } = useSocket(token, roomId);
  const storeMessages = useSelector((state: RootState) => state.messages.byRoom[roomId]);

  // Always seed from REST history when entering a room.
  // Preserve any socket messages that arrived after the REST snapshot.
  useEffect(() => {
    if (messages) {
      const restIds = new Set(messages.map((m) => m.id));
      const socketOnly = (storeMessages || []).filter((m) => !restIds.has(m.id));
      dispatch(setRoomMessages({ roomId, messages: [...messages, ...socketOnly] }));
    }
  // storeMessages intentionally excluded to avoid infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, roomId]);

  // Clear room messages on unmount so next visit always re-seeds fresh from REST
  useEffect(() => {
    return () => {
      dispatch(clearRoomMessages(roomId));
    };
  }, [roomId, dispatch]);

  if (roomsLoading) {
    return (
      <div className="chat-panel chat-panel--loading">
        <p className="chat-panel__loading-text">Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="chat-panel chat-panel--empty">
        <div className="chat-panel__empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Room not found</h3>
          <p>This room may have been deleted or you don&apos;t have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <ChatHeader room={room} />
      <div className="chat-panel__bg">
        <MessageList roomId={roomId} currentUserId={user?.id || ''} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
