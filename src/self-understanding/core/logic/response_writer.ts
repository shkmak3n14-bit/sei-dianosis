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

/** 診断結果に違和感 — 文章化 */
function writeDiagnosisDoubt(step: string, userInput: string): string {
  switch (step) {
    case '疑っている理由を要約する':
      return `「${userInput}」ということは、診断結果にしっくり来ていないということですね。`;

    case '診断が揺れる典型パターンを説明する':
      return '診断が揺れるときは、ストレス状態・役割期待・環境要因が強く影響していることが多いです。';

    case 'ユーザーの特徴と照合する':
      return 'あなたの場合は、普段の行動と診断結果のズレが気になっているように見えます。';

    case '判断材料を提示する':
      return "『普段の自分』と『ストレス下の自分』を分けて考えると、診断のブレが整理されやすいです。";

    case 'まとめ':
      return '診断は“固定のラベル”ではなく“傾向の地図”です。揺れること自体が自然なんです。';

    case '必要なら追加質問':
      return 'どの部分が特にしっくり来ていませんか？';

    default:
      return step;
  }
}

/** エピソード分析 — 文章化 */
function writeEpisodeAnalysis(step: string, userInput: string): string {
  switch (step) {
    case 'エピソードの要点を要約する':
      return `「${userInput}」という幼少期のエピソードについて、まず内容を整理しますね。`;

    case '感情の核を抽出する':
      return 'この出来事であなたが感じた感情は、一次感情（本音）と二次感情（反応）に分けて考えると整理しやすいです。';

    case '行動パターンを抽出する':
      return 'その場面であなたが取った行動には、幼少期から続く“自動反応パターン”が表れている可能性があります。';

    case '価値観の形成につながる部分を説明する':
      return '幼少期の経験は、現在の価値観や“こうあるべき”という信念の土台になっていることが多いです。';

    case '恐れ・欲求との関連を説明する':
      return 'このエピソードは、あなたの根底にある恐れ（避けたいもの）や欲求（求めたいもの）と強く結びついている可能性があります。';

    case 'タイプの補正ポイントを提示する':
      return 'この出来事の解釈から、タイプ判定の補正ができます。特に“何を守ろうとしていたか”が重要な判断材料になります。';

    case 'まとめ':
      return '幼少期のエピソードは、現在の性格の“根っこ”を理解するための重要な手がかりです。今のあなたの傾向と照らし合わせながら、さらに深めていきましょう。';

    case '必要なら追加質問':
      return 'この出来事の中で、特に印象に残っている感情や場面はどこですか？';

    default:
      return step;
  }
}
