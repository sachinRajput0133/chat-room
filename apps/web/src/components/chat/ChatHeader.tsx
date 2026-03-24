import Avatar from '../ui/Avatar';
import { Room, RoomUser } from '../../types/room.types';
import { useAuth } from '../../hooks/useAuth';

interface ChatHeaderProps {
  room: Room;
}

function fullName(u: RoomUser): string {
  const name = `${u.firstName} ${u.lastName}`.trim();
  return name || u.email || '';
}

export default function ChatHeader({ room }: ChatHeaderProps) {
  const { logout } = useAuth();

  const creatorName = room.createdBy ? (fullName(room.createdBy) || 'Unknown') : 'Unknown';

  const participantNames = room.participants
    .map((u) => `${fullName(u)} (${u.id})`)
    .join(', ');

  return (
    <div className="chat-header">
      <div className="chat-header__left">
        <Avatar name={room.roomName} size={48} />
        <div className="chat-header__info">
          <span className="chat-header__name">{room.roomName}</span>
          <span className="chat-header__participants">
            {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}
            {' · '}Created by {creatorName}
            {room.createdBy && (
              <span className="chat-header__uid"> ({room.createdBy.id})</span>
            )}
          </span>
          {room.participants.length > 0 && (
            <span className="chat-header__members" title={participantNames}>
              {room.participants.map((u, i) => (
                <span key={u.id}>
                  {i > 0 && ', '}
                  {fullName(u)}<span className="chat-header__uid"> ({u.id})</span>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
      <div className="chat-header__actions">
        <button className="chat-header__logout" onClick={logout} title="Sign out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
