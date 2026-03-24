import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Room } from '../../types/room.types';
import { Message } from '../../types/message.types';

interface RoomListItemProps {
  room: Room;
  lastMessage?: Message;
  unreadCount?: number;
  isActive: boolean;
  onClick: () => void;
}

function formatTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RoomListItem({
  room,
  lastMessage,
  unreadCount = 0,
  isActive,
  onClick,
}: RoomListItemProps) {
  return (
    <div
      className={`room-list-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <Avatar name={room.roomName} size={48} online={true} />
      <div className="room-list-item__content">
        <div className="room-list-item__top">
          <span className="room-list-item__name">{room.roomName}</span>
          {lastMessage && (
            <span className="room-list-item__time">
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="room-list-item__bottom">
          <span className="room-list-item__preview">
            {lastMessage ? lastMessage.content : 'No messages yet'}
          </span>
          <Badge count={unreadCount} />
        </div>
      </div>
    </div>
  );
}
