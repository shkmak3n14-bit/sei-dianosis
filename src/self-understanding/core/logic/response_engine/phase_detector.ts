// response_engine/phase_detector.ts

import { PHASE_KEYWORDS } from './phase_keywords';

export type ConversationPhase = 'conversation' | 'deepening' | 'advice';

/**
 * ユーザー入力から会話フェーズを判定する。
 * キーワード → 文脈 → 深まり → 会話 の優先順。
 */
export function detectPhase(userInput: string): ConversationPhase {
  const text = userInput.toLowerCase();

  // ① キーワード判定（既存）
  if (PHASE_KEYWORDS.advice.some((k) => text.includes(k))) {
    return 'advice';
  }

  // ② 文脈判定（新規）
  if (
    containsAny(text, [
      '自分は',
      'いつも',
      'こうなる',
      '理由',
      '傾向',
      'タイプ的',
      'ストレスの時',
      '職場で',
      '人間関係で',
    ])
  ) {
    return 'advice';
  }

  // ③ 深まりフェーズ判定
  if (PHASE_KEYWORDS.deepening.some((k) => text.includes(k))) {
    return 'deepening';
  }

  // ④ 会話フェーズ
  return 'conversation';
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}
