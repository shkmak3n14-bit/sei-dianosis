// response_engine/phase/detectPhaseLLM.ts
// 会話フェーズ判定（LLM版）

import { callLLM } from '../../../llm/llm_client';
import type { ConversationPhase } from '../phase_detector';

export type { ConversationPhase };

/**
 * ユーザー発話の会話フェーズを LLM で判定する。
 * 失敗時・不正値時は conversation にフォールバック。
 */
export async function detectPhaseLLM(
  userInput: string
): Promise<ConversationPhase> {
  const prompt = `
あなたはユーザーの発話から「会話フェーズ」を判定する分類器です。

フェーズは次の3つだけです：

- conversation：印象・感想・モヤモヤ・軽い話
- deepening：気持ちの整理・違和感の説明・具体的な場面
- advice：改善・成長・ストレス・仕事・構造的助言の要求

判定基準：
- 「どうすれば」「改善」「理由」「傾向」「タイプ的」など助言要求 → advice
- 「気になった」「違和感」「その時」「場面」など具体的説明 → deepening
- 上記以外は conversation

返答は JSON のみで、次の形式にしてください：

{"phase": "conversation"}

余計な文章は一切書かないでください。
`;

  const raw = await callLLM(prompt + `\n\nユーザー発話: ${userInput}`, {
    includePersona: false,
  });

  try {
    const parsed = JSON.parse(extractJson(raw)) as { phase?: string };
    if (
      parsed.phase === 'conversation' ||
      parsed.phase === 'deepening' ||
      parsed.phase === 'advice'
    ) {
      return parsed.phase;
    }
  } catch {
    // JSON parse error → fallback
  }

  return 'conversation';
}

/** 応答に説明文が混ざっても JSON 部分だけ取り出す */
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}
