// response_router.ts

import { generateResponse } from './response_engine';

/**
 * 多段対話対応版 response_router
 *
 * 返すのは「未文章化のステップ名（steps）」だけ。
 * 文章化は useChatFlow 側で writeResponse(type, step, userInput) を使って行う。
 */
export function routeResponse(userInput: string) {
  // ① response_engine で返答の設計図を取得
  const result = generateResponse(userInput);
  const { type, label, flow } = result;

  // ② flow は未文章化のステップ名の配列として返す
  return {
    type, // 例: "selfConflict"
    label, // 例: "自己矛盾の整理"
    steps: flow, // ← ここが重要。文章化しない。
  };
}
