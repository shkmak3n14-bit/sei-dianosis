// advice_engine.ts

import { getEnneagramInsight } from '../data/enneagram';
import type { PsychoStructure } from './psycho_extractor';

export function generateAdvice(
  structure: PsychoStructure,
  enneagramType?: string // 例: "9w8"（任意）
): string {
  const { fear, desire, motive, action } = structure;

  // ① 状況の要点整理
  let advice = '今の状況を整理すると、あなたの内側では次のような動きが起きています。\n\n';

  // ② fear / desire / motive / action の解釈
  if (fear) {
    advice += `● 恐れ（fear）：${fear}\n`;
  }
  if (desire) {
    advice += `● 願望（desire）：${desire}\n`;
  }
  if (motive) {
    advice += `● 動機（motive）：${motive}\n`;
  }
  if (action) {
    advice += `● 行動パターン（action）：${action}\n`;
  }

  advice += '\n';

  // ③ エニアグラムタイプの反映（任意）— insight 辞書を参照
  if (enneagramType) {
    advice += `あなたは ${enneagramType} の傾向を持っているため、これらの心理構造は特に強く働きやすいです。\n`;
    advice += getEnneagramInsight(enneagramType);
    advice += '\n';
  }

  // ④ 行動の選択肢
  advice += 'ここから選べる行動の選択肢は、次の3つです。\n\n';
  advice +=
    '1. 恐れを避ける行動を続ける（短期的には楽だが、長期的には負荷が残る）\n';
  advice +=
    '2. 願望に沿った行動を小さく試す（負荷はあるが、自己効力感が上がる）\n';
  advice +=
    '3. 動機を再定義し、行動パターンを調整する（最も長期的な変化につながる）\n\n';

  // ⑤ 誇りある選択を促す一言
  advice +=
    "どれを選ぶかはあなたの自由ですが、あなたが『誇りを持てる選択』をすることが一番大切です。";

  return advice;
}
