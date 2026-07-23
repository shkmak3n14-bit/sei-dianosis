// useChatFlow.ts
import { useState } from 'react';
import { extractPsychoStructure } from '../../../core/logic/psycho_extractor';
import { generateFollowUp } from '../../../core/logic/psycho_followup';
import { routeResponse } from '../../../core/logic/response_router';
import { writeResponse } from '../../../core/logic/response_writer';

export type ChatFlowMessage = {
  sender: 'user' | 'sie';
  text: string;
};

type ConversationContext = {
  type: string | null;
  label: string | null;
  remainingSteps: string[];
};

export function useChatFlow() {
  const [messages, setMessages] = useState<ChatFlowMessage[]>([]);
  const [context, setContext] = useState<ConversationContext>({
    type: null,
    label: null,
    remainingSteps: [],
  });

  const sendMessage = async (text: string) => {
    // ① ユーザーの発言を追加
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    // ② まだ flow が残っている → 次のステップを文章化して返す
    if (context.type && context.remainingSteps.length > 0) {
      const nextStep = context.remainingSteps[0];
      const newRemaining = context.remainingSteps.slice(1);
      const sieReply = writeResponse(context.type, nextStep, text);

      setMessages((prev) => [...prev, { sender: 'sie', text: sieReply }]);
      setContext((prev) => ({
        ...prev,
        remainingSteps: newRemaining,
      }));

      return;
    }

    // ③ 心理構造を抽出し、不足があれば先に確認質問する
    const structure = await extractPsychoStructure(text);
    const followUp = generateFollowUp(structure);

    if (followUp) {
      setMessages((prev) => [...prev, { sender: 'sie', text: followUp }]);
      return;
    }

    // ④ flow が残っていない → 新しい相談として扱う
    const result = routeResponse(text);
    const [firstStep, ...remaining] = result.steps;

    if (!firstStep) {
      return;
    }

    const sieReply = writeResponse(result.type, firstStep, text);

    setMessages((prev) => [...prev, { sender: 'sie', text: sieReply }]);
    setContext({
      type: result.type,
      label: result.label ?? null,
      remainingSteps: remaining,
    });
  };

  return { messages, sendMessage };
}
