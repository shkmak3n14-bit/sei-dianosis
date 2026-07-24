// response_engine/tone_detector.ts

export type ToneType = 'soft' | 'calm' | 'voice';

export function detectTone(userInput: string): ToneType {
  const text = userInput.toLowerCase();

  // 不安・戸惑い系 → soft
  if (
    containsAny(text, [
      'わからない',
      '分からない',
      '違う',
      'モヤモヤ',
      '不安',
      'どうしたら',
    ])
  ) {
    return 'soft';
  }

  // 落ち着いて整理したい系 → calm
  if (containsAny(text, ['なるほど', '気になった', '整理', 'もう少し'])) {
    return 'calm';
  }

  // 音声向けの軽い相談 → voice
  if (containsAny(text, ['うーん', 'そうなんだよね', 'ちょっと'])) {
    return 'voice';
  }

  // デフォルトは calm
  return 'calm';
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}
