'use client';
import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import attachIcon from '../../icons/Monotone add1.svg';
import micIcon from '../../icons/Monotone add.svg';
import sendIcon from '../../icons/Button Icon.svg';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-bar">
      <div className="message-input-container">
        {/* Attach — Figma: Monotone add1.svg, 24×24, #94A3B8 */}
        <button className="message-input-bar__attach" title="Attach">
          <Image src={attachIcon} alt="Attach" width={24} height={24} />
        </button>
        <textarea
          className="message-input-bar__input"
          placeholder="Write your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        {/* Mic — Figma: Monotone add.svg, 24×24, #94A3B8 */}
        <button className="message-input-bar__mic" title="Voice message">
          <Image src={micIcon} alt="Mic" width={24} height={24} />
        </button>
        {/* Send — Figma: Button Icon.svg, 40×40, purple circle bg + white icon */}
        <button
          className="message-input-bar__send"
          onClick={handleSend}
          disabled={!value.trim()}
          title="Send message"
        >
          <Image src={sendIcon} alt="Send" width={40} height={40} />
        </button>
      </div>
    </div>
  );
}
