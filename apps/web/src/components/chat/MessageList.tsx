'use client';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import MessageBubble from './MessageBubble';
import DateDivider from './DateDivider';
import { Message } from '../../types/message.types';

interface MessageListProps {
  roomId: string;
  currentUserId: string;
}

function groupByDate(messages: Message[]) {
  const groups: { label: string; messages: Message[] }[] = [];
  let currentLabel = '';

  for (const msg of messages) {
    const date = new Date(msg.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (label !== currentLabel) {
      groups.push({ label, messages: [] });
      currentLabel = label;
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
}

export default function MessageList({ roomId, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = useSelector((state: RootState) => state.messages.byRoom[roomId] || []);
  const groups = groupByDate(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="message-list">
      <div className="message-list__inner">
        {groups.length === 0 ? (
          <div className="message-list__empty">
            <p>No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="message-group">
              <DateDivider label={group.label} />
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isSent={msg.senderId === currentUserId}
                />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
