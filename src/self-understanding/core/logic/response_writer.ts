// response_writer.ts

export function writeResponse(type: string, step: string, userInput: string) {
  switch (type) {
    case 'typeBoundary':
      return writeTypeBoundary(step, userInput);

    case 'diagnosisDoubt':
      return writeDiagnosisDoubt(step, userInput);

    case 'episodeAnalysis':
      return writeEpisodeAnalysis(step, userInput);

    // 必要に応じて他のタイプも追加していく
    default:
      return step; // fallback（まだ文章化していないステップ）
  }
}

/** どっちのタイプ？ — 文章化（後で詳細化） */
function writeTypeBoundary(step: string, userInput: string): string {
  return `${step}\n（あなたの入力：「${userInput}」）`;
}

/** 診断結果に違和感 — 文章化（後で詳細化） */
function writeDiagnosisDoubt(step: string, userInput: string): string {
  return `${step}\n（あなたの入力：「${userInput}」）`;
}

/** エピソード分析 — 文章化（後で詳細化） */
function writeEpisodeAnalysis(step: string, userInput: string): string {
  return `${step}\n（あなたの入力：「${userInput}」）`;
}
