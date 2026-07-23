// response_engine.ts

import { classify } from './classifier';
import { getTemplate } from './template_engine';

export type GeneratedResponse = {
  type: string;
  label: string;
  flow: string[];
};

/**
 * 多段対話対応版 response_engine
 *
 * - ユーザー入力を分類する
 * - 該当テンプレートの flow（ステップ名）を返す
 * - 文章化はしない（useChatFlow が行う）
 */
export function generateResponse(userInput: string): GeneratedResponse {
  // ① 分類
  const type = classify(userInput);

  // ② テンプレート取得
  const template = getTemplate(type);

  // ③ flow（ステップ名の配列）を返す
  // type はテンプレート側を優先（stressChange → stressPattern など）
  return {
    type: template.type,
    label: template.label,
    flow: template.flow, // ← 未文章化のステップ名
  };
}
