import { useState } from 'react';
import { routeResponse } from '../../../core/logic/response_router';

export type ChatFlowMessage = {
  id: string;
  sender: 'user' | 'sie';
  text: string;
};

function createMessage(sender: ChatFlowMessage['sender'], text: string): ChatFlowMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sender,
    text,
  };
}

export function useChatFlow() {
  const [messages, setMessages] = useState<ChatFlowMessage[]>([]);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, createMessage('user', text)]);

    const result = routeResponse(text);
    result.messages.forEach((msg) => {
      setMessages((prev) => [...prev, createMessage('sie', msg)]);
    });
  };

  return { messages, sendMessage };
}
