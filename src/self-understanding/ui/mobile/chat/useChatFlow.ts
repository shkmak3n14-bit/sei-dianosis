import { useState } from 'react';
import { routeResponse } from '../../../core/logic/response_router';

export function useChatFlow() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text: string) => {
    // ユーザーの発言を追加
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    // サイの返答を生成
    const result = routeResponse(text);

    // flow の各ステップを順番に追加
    result.messages.forEach((msg) => {
      setMessages((prev) => [...prev, { sender: 'sie', text: msg }]);
    });
  };

  return { messages, sendMessage };
}
