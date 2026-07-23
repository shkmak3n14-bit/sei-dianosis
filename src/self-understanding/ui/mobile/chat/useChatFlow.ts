// useChatFlow.ts
import { useState } from 'react';
import { generateAdvice } from '../../../core/logic/advice_engine';
import {
  EMPTY_PSYCHO_STRUCTURE,
  extractPsychoStructure,
  mergePsychoStructure,
  type PsychoStructure,
} from '../../../core/logic/psycho_extractor';
import { generateFollowUp } from '../../../core/logic/psycho_followup';
import { routeResponse } from '../../../core/logic/response_router';
import { writeResponse } from '../../../core/logic/response_writer';
import { selfUnderstandingMock } from '../mocks/selfUnderstandingMock';

export type ChatFlowMessage = {
  sender: 'user' | 'sie';
  text: string;
};

type ConversationContext = {
  type: string | null;
  label: string | null;
  remainingSteps: string[];
  /** 対話中に蓄積する心理構造 */
  psychology: PsychoStructure;
  /** flow 完了後の助言をすでに出したか */
  adviceDelivered: boolean;
};

export type UseChatFlowOptions = {
  /** 診断結果（例: 9w8）。未指定時はモックの wingCode を使う */
  enneagramType?: string;
};

export function useChatFlow(options: UseChatFlowOptions = {}) {
  const userEnneagramType =
    options.enneagramType ?? selfUnderstandingMock.resultCard.wingCode;

  const [messages, setMessages] = useState<ChatFlowMessage[]>([]);
  const [context, setContext] = useState<ConversationContext>({
    type: null,
    label: null,
    remainingSteps: [],
    psychology: { ...EMPTY_PSYCHO_STRUCTURE },
    adviceDelivered: false,
  });

  const sendMessage = async (text: string) => {
    // ① ユーザーの発言を追加
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    // ② flow が残っている間は flow を優先
    if (context.type && context.remainingSteps.length > 0) {
      const nextStep = context.remainingSteps[0];
      const sieReply = writeResponse(context.type, nextStep, text);

      setMessages((prev) => [...prev, { sender: 'sie', text: sieReply }]);
      setContext((prev) => ({
        ...prev,
        remainingSteps: prev.remainingSteps.slice(1),
      }));

      return;
    }

    // ③ flow が全部終わったら psychology を使って advice
    if (context.type && !context.adviceDelivered) {
      const advice = generateAdvice(context.psychology, userEnneagramType);
      setMessages((prev) => [...prev, { sender: 'sie', text: advice }]);
      setContext((prev) => ({
        ...prev,
        adviceDelivered: true,
      }));
      return;
    }

    // ④ 新規相談（または助言後の次トピック）: 心理構造を抽出・蓄積
    const basePsychology = context.adviceDelivered
      ? { ...EMPTY_PSYCHO_STRUCTURE }
      : context.psychology;

    const extracted = await extractPsychoStructure(text, {
      wingCode: userEnneagramType,
    });
    const psychology = mergePsychoStructure(basePsychology, extracted);

    const followUp = generateFollowUp(psychology);

    if (followUp) {
      setContext((prev) => ({
        ...prev,
        type: null,
        label: null,
        remainingSteps: [],
        psychology,
        adviceDelivered: false,
      }));
      setMessages((prev) => [...prev, { sender: 'sie', text: followUp }]);
      return;
    }

    // ⑤ 心理構造が揃った → flow 開始（ここでは advice しない）
    const result = routeResponse(text);
    const [firstStep, ...remaining] = result.steps;

    if (firstStep) {
      const sieReply = writeResponse(result.type, firstStep, text);
      setMessages((prev) => [...prev, { sender: 'sie', text: sieReply }]);
    }

    setContext((prev) => ({
      ...prev,
      type: result.type,
      label: result.label ?? null,
      remainingSteps: remaining,
      psychology,
      adviceDelivered: false,
    }));
  };

  return { messages, sendMessage, context };
}
