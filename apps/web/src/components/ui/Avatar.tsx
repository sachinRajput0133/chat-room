import { CSSProperties } from 'react';

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
  src?: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, size = 40, online, src }: AvatarProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: getColor(name),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 600,
    color: '#fff',
    flexShrink: 0,
    position: 'relative',
    overflow: src ? 'hidden' : 'visible',
  };

  return (
    <div style={style} className="avatar">
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      {online !== undefined && (
        <span
          className={`avatar-status ${online ? 'online' : 'offline'}`}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '1.5px solid #ffffff',
            backgroundColor: online ? '#22C55E' : '#D9D8ED',
          }}
        />
      )}
    </div>
  );
}
