'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveRoom } from '../../store/slices/roomsSlice';
import { clearUnread } from '../../store/slices/messagesSlice';
import ChatSidebar from './ChatSidebar';
import ChatPanel from './ChatPanel';

interface ChatLayoutProps {
  activeRoomId?: string;
}

export default function ChatLayout({ activeRoomId }: ChatLayoutProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveRoom(activeRoomId ?? null));
    if (activeRoomId) {
      dispatch(clearUnread(activeRoomId));
    }
    return () => {
      dispatch(setActiveRoom(null));
    };
  }, [activeRoomId, dispatch]);

  return (
    <div className="chat-layout">
      <ChatSidebar activeRoomId={activeRoomId} />
      {activeRoomId ? (
        <ChatPanel roomId={activeRoomId} />
      ) : (
        <div className="chat-panel chat-panel--empty">
          <div className="chat-panel__empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Select a chat to start messaging</h3>
            <p>Choose from your existing conversations or create a new room.</p>
          </div>
        </div>
      )}
    </div>
  );
}
