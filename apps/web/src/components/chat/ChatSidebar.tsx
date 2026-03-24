'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetRoomsQuery, useJoinRoomMutation } from '../../store/api/roomsApi';
import { setSearchQuery } from '../../store/slices/roomsSlice';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { useSocketAllRooms } from '../../hooks/useSocketAllRooms';
import RoomPreview from './RoomPreview';
import CreateRoomModal from '../rooms/CreateRoomModal';
import Image from 'next/image';
import searchIcon from '../../icons/searchIcon.svg';

interface ChatSidebarProps {
  activeRoomId?: string;
}

export default function ChatSidebar({ activeRoomId }: ChatSidebarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const { data: rooms = [], isLoading } = useGetRoomsQuery();
  const [joinRoom] = useJoinRoomMutation();
  const searchQuery = useSelector((state: RootState) => state.rooms.searchQuery);
  const { token } = useAuth();

  // Subscribe to ALL rooms globally so sidebar previews update in real-time
  useSocketAllRooms(token, rooms);

  const filtered = rooms.filter((r) =>
    r.roomName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRoomClick = async (roomId: string) => {
    try {
      await joinRoom(roomId).unwrap();
    } catch {
      // already a participant — that's fine
    }
    router.push(`/chats/${roomId}`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-row">
          <h2 className="sidebar__title">My Chats</h2>
          <button
            className="sidebar__create-btn"
            onClick={() => setShowCreate(true)}
            title="New chat room"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="sidebar__search">
          <Image src={searchIcon} alt="Search" width={20} height={20} className="sidebar__search-icon" />
          <input
            className="sidebar__search-input"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>

      <div className="sidebar__list">
        {isLoading ? (
          <div className="sidebar__loading">Loading chats...</div>
        ) : filtered.length === 0 ? (
          <div className="sidebar__empty">No rooms found</div>
        ) : (
          filtered.map((room) => (
            <RoomPreview
              key={room.id}
              room={room}
              isActive={room.id === activeRoomId}
              onClick={() => handleRoomClick(room.id)}
            />
          ))
        )}
      </div>

      {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
    </aside>
  );
}
