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

/** どっちのタイプ？ — 文章化 */
function writeTypeBoundary(step: string, userInput: string): string {
  switch (step) {
    case '迷っているタイプを要約する':
      return `「${userInput}」ということは、9w8と8w9の違いを知りたいということですね。`;

    case 'その2タイプが似ている理由を説明する':
      return 'どちらも“8の力”を持つため、境界線の強さや自己主張の瞬発力が似ています。';

    case '違いが出るポイントを比較する（3〜5項目）':
      return 'ただし現れ方は違います。9w8は安定を守るための力、8w9は領域を広げるための力として出ます。';

    case 'ユーザーの特徴（9w8）と照合する':
      return 'あなたの場合は、まず環境の静けさを守りたい気持ちが先に来ています。これは9w8の特徴です。';

    case '判断材料を提示する':
      return "もし『まず場を落ち着かせたい』が強いなら9w8、『まず自分の主導権を握りたい』なら8w9です。";

    case 'まとめ':
      return 'つまり、同じ力でも“目的”が違うんです。ここが9w8と8w9の決定的な差です。';

    case '必要なら追加質問':
      return '最近の出来事で、どちらの傾向が出ましたか？';

    default:
      return step;
  }
}

/** 診断結果に違和感 — 文章化（後で詳細化） */
function writeDiagnosisDoubt(step: string, userInput: string): string {
  return `${step}\n（あなたの入力：「${userInput}」）`;
}

/** エピソード分析 — 文章化（後で詳細化） */
function writeEpisodeAnalysis(step: string, userInput: string): string {
  return `${step}\n（あなたの入力：「${userInput}」）`;
}
