import classificationData from './classification.json';

type ClassificationRule = {
  label: string;
  keywords: string[];
  emotion: string[];
  context: string[];
};

type ClassificationResult = {
  type: string;
  score: number;
};

const classification = classificationData.classification as Record<string, ClassificationRule>;

export function classifyUserInput(text: string): string {
  const results: ClassificationResult[] = [];

  for (const [type, rule] of Object.entries(classification)) {
    let score = 0;

    // キーワード判定
    rule.keywords.forEach((keyword) => {
      if (text.includes(keyword)) score += 3;
    });

    // 感情判定（簡易）
    rule.emotion.forEach((em) => {
      if (text.includes(em)) score += 1;
    });

    // 文脈判定（簡易）
    rule.context.forEach((ctx) => {
      if (text.includes(ctx)) score += 1;
    });

    if (score > 0) {
      results.push({ type, score });
    }
  }

  // スコアが高い順にソート
  results.sort((a, b) => b.score - a.score);

  // 最も高いものを返す
  return results.length > 0 ? results[0].type : 'fallbackExpert';
}
