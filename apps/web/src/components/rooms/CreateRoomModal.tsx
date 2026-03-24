'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRoomMutation } from '../../store/api/roomsApi';

interface CreateRoomModalProps {
  onClose: () => void;
}

export default function CreateRoomModal({ onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = roomName.trim();
    if (trimmed.length < 2) {
      setError('Room name must be at least 2 characters.');
      return;
    }
    try {
      const room = await createRoom({ roomName: trimmed }).unwrap();
      onClose();
      router.push(`/chats/${room.id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'Failed to create room');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Create New Room</h3>
          <button className="modal__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="modal__error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="roomName">Room Name</label>
            <input
              id="roomName"
              className="form-input"
              type="text"
              placeholder="e.g. General Discussion"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              autoFocus
            />
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
