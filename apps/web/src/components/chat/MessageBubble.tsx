import { Message } from '../../types/message.types';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div className={`message-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
      {!isSent && (
        <span className="message-sender-name">
          {message.senderName}
          <span className="message-sender-id"> ({message.senderId})</span>
        </span>
      )}
      <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
        <p className="message-content">{message.content}</p>
        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ opacity: 0.8, flexShrink: 0 }}>
            <path d="M1 5L4.5 8.5L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L8.5 8.5L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isSent && (
        <div className="message-status-row">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5L4.5 8.5L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L8.5 8.5L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sent
        </div>
      )}
    </div>
  );
}
