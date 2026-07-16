import { useState } from 'react';
import { generateResponse } from '../../../core/logic/response_engine';

export type ChatFlowMessage = {
  sender: 'user' | 'sie';
  text: string;
};

export function useChatFlow() {
  const [messages, setMessages] = useState<ChatFlowMessage[]>([]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    // サイの返答を生成
    const result = generateResponse(trimmed);

    // ユーザー発言 + flow の各ステップをまとめて追加
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: trimmed },
      ...result.flow.map((step) => ({ sender: 'sie' as const, text: step })),
    ]);
  };

  return { messages, sendMessage };
}
