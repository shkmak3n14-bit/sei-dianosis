// speech_summarizer.ts
// 長文（テキスト）を「音声向けの短く・聞きやすい形」に変換するモジュール

export function toSpeechFriendly(text: string): string {
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return text;

  const scored = sentences.map((s) => ({
    sentence: s.trim(),
    score: scoreSentence(s),
  }));

  // 重要な文を最大5つまで抽出
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => softenForSpeech(s.sentence));

  const reordered = reorderForSpeech(topSentences);

  // 音声向けなので、文ごとに改行して「間」を作る
  return reordered.join('\n');
}

/** シンプルな文分割（。！？で区切る） */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？\?])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 文の重要度スコアリング */
function scoreSentence(s: string): number {
  let score = 0;

  // タイプの核
  if (containsAny(s, ['恐れ', 'coreFear'])) score += 3;
  if (containsAny(s, ['願望', 'coreDesire'])) score += 3;

  // 自動反応・盲点・成長方向
  if (containsAny(s, ['衝突スタイル', 'conflictStyle'])) score += 2;
  if (containsAny(s, ['盲点', 'blindSpot'])) score += 2;
  if (containsAny(s, ['成長方向', 'growthDirection'])) score += 2;

  // ストレス・仕事・関係性などの具体的な場面
  if (containsAny(s, ['ストレス', '仕事', '関係', '行動'])) score += 1;

  return score;
}

function containsAny(s: string, keywords: string[]): boolean {
  return keywords.some((k) => s.includes(k));
}

/** 音声向けに語尾を柔らかくする */
function softenForSpeech(s: string): string {
  let out = s;

  out = out.replace(/です。/g, 'だよ。');
  out = out.replace(/ます。/g, 'るよ。');
  out = out.replace(/です/g, 'なんだよ');
  out = out.replace(/ます/g, 'るよ');
  out = out.replace(/〜/g, ''); // 変な波線があれば軽く削る

  return out;
}

/** 結論 → 理由 → 補足 の順に並べ替える（簡易版） */
function reorderForSpeech(sentences: string[]): string[] {
  return sentences.sort((a, b) => {
    const aScore = speechOrderScore(a);
    const bScore = speechOrderScore(b);
    return bScore - aScore;
  });
}

function speechOrderScore(s: string): number {
  if (s.includes('成長')) return 3; // 結論寄り
  if (s.includes('恐れ') || s.includes('願望')) return 2; // 核となる理由
  return 1; // 補足
}
