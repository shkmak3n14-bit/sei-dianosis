// response_router.ts

import { generateResponse } from './response_engine';
import { writeResponse } from './response_writer';

/**
 * routeResponse
 *  - ユーザー入力を受け取り
 *  - response_engine で type / label / flow を決定し
 *  - flow の各ステップを response_writer で文章化し
 *  - UI が扱いやすい形式にまとめて返す
 */
export function routeResponse(userInput: string) {
  // ① response_engine で返答の設計図を取得
  const result = generateResponse(userInput);
  const { type, label, flow } = result;

  // ② flow の各ステップを文章化
  const messages = flow.map((step) => {
    return writeResponse(type, step, userInput);
  });

  // ③ UI に返す最終オブジェクト
  return {
    type, // 例: "selfConflict"
    label, // 例: "自己矛盾の整理"
    messages, // 文章化された配列
  };
}
