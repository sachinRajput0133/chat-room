'use client';
import ChatLayout from '../../../../components/chat/ChatLayout';
import '../../../../styles/chat.css';

interface Props {
  params: { roomId: string };
}

export default function ChatRoomPage({ params }: Props) {
  return <ChatLayout activeRoomId={params.roomId} />;
}
