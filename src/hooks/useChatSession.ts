import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './useChatMessages';

export const useChatSession = () => {
  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const startNewConversation = () => {
    setMessages([]);
  };

  return {
    messages,
    setMessages,
    sessionId,
    startNewConversation
  };
};
