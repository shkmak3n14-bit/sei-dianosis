// response_writer.ts

export function writeResponse(type: string, step: string, userInput: string) {
  switch (type) {
    case 'typeBoundary':
      return writeTypeBoundary(step, userInput);

    case 'diagnosisDoubt':
      return writeDiagnosisDoubt(step, userInput);

    case 'episodeAnalysis':
      return writeEpisodeAnalysis(step, userInput);

    case 'angerUnknown':
      return writeAngerUnknown(step, userInput);

    case 'abstractWordUnknown':
      return writeAbstractWordUnknown(step, userInput);

    case 'fallbackExpert':
      return writeFallbackExpert(step, userInput);

    case 'relationshipIssue':
      return writeRelationshipIssue(step, userInput);

    case 'selfConflict':
      return writeSelfConflict(step, userInput);

    case 'stressPattern':
      return writeStressPattern(step, userInput);

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

/** 怒りがわからない — 文章化 */
function writeAngerUnknown(step: string, userInput: string): string {
  switch (step) {
    case '怒りの原因を要約する':
      return `「${userInput}」ということは、怒りの理由が自分でも分からない状態ですね。`;

    case '怒りが分からなくなる典型パターンを説明する':
      return '怒りが分からなくなるときは、感情が一次感情ではなく二次感情として出ていることが多いです。';

    case 'ユーザーの特徴と照合する':
      return 'あなたの場合は、まず状況を落ち着かせようとする傾向が強いため、怒りが後から出てくる可能性があります。';

    case '判断材料を提示する':
      return "『本当に怒っている対象』と『表面上の怒り』を分けて考えると整理しやすいです。";

    case 'まとめ':
      return '怒りが分からないのは“感情が混ざっている”サインです。ゆっくり分解していきましょう。';

    case '必要なら追加質問':
      return '最近、どんな場面で怒りを感じましたか？';

    default:
      return step;
  }
}

/** 抽象語がわからない — 文章化 */
function writeAbstractWordUnknown(step: string, userInput: string): string {
  switch (step) {
    case '抽象語の意味が人によって違うことを説明する':
      return `「${userInput}」という言葉は、人によって意味が大きく変わる“抽象語”です。まずはその前提を共有しますね。`;

    case '一般的な意味をざっくり提示する':
      return '抽象語は辞書的な意味よりも、実際の体験や価値観によって形づくられます。一般的な説明はできますが、それだけでは本質に届きません。';

    case '具体例（Aさんのケース）を提示する':
      return "例えば Aさんの場合、この言葉は『自分の領域を守るための線引き』という意味で使われていました。人によってまったく違う使われ方をします。";

    case 'ユーザー自身の具体例を尋ねる':
      return 'あなたの場合、この言葉はどんな場面で出てきましたか？具体的な状況を教えてもらえると、あなたにとっての意味を一緒に特定できます。';

    case '動機・願望・恐れの観点で整理する意図を説明する':
      return '抽象語の本当の意味は、状況を聞いたうえで“動機・願望・恐れ・行動”の4つの観点から整理すると明確になります。';

    case 'まとめ':
      return '抽象語は“あなたにとっての意味”を特定することが大切です。状況を教えてもらえれば、あなたの心理構造に沿って具体化できます。';

    case '必要なら追加質問':
      return 'その言葉が出てきた場面を、思い出せる範囲で教えてください。';

    default:
      return step;
  }
}

/** 専門家モード — 文章化 */
function writeFallbackExpert(step: string, userInput: string): string {
  switch (step) {
    case 'ユーザーの質問を専門家として受け止める':
      return `ご質問ありがとうございます。専門家の立場から「${userInput}」について整理します。`;

    case '問題の背景を構造的に説明する':
      return 'まず、このテーマがどのような心理構造やタイプ論に関係するのかを明確にします。';

    case '専門的な観点から核心を提示する':
      return '本質的なポイントは、表面的な行動ではなく、その背後にある動機・恐れ・欲求の構造です。';

    case 'タイプ論・心理構造の観点から分析する':
      return "エニアグラムの観点では、これは主に『中心となる恐れ』『自動反応』『認知のクセ』の3つから説明できます。";

    case 'ユーザーの状況に当てはめて具体化する':
      return 'あなたのケースでは、状況の捉え方や反応のパターンに特有の傾向が見られます。';

    case '改善の方向性・理解のポイントを示す':
      return '理解を深めるためには、まず自分の自動反応を認識し、その背後の動機を丁寧に扱うことが重要です。';

    case '必要なら追加質問を提示する':
      return 'もしよければ、最近このテーマに関連する出来事があれば教えてください。さらに深く分析できます。';

    default:
      return step;
  }
}

/** 対人関係の悩み — 文章化 */
function writeRelationshipIssue(step: string, userInput: string): string {
  switch (step) {
    case '悩みを受け止める':
      return `対人関係に関するご相談ですね。「${userInput}」について丁寧に整理していきます。`;

    case '状況の構造を明確化する':
      return 'まず、現在の状況を「事実」「相手の反応」「自分の内的反応」の3つに分けて理解します。';

    case '相手の心理構造を推測する':
      return '相手の行動や反応には、タイプ特有の動機や恐れが影響している可能性があります。';

    case '自分側の心理構造を整理する':
      return 'あなた自身の反応にも、タイプ固有の自動反応や認知のクセが表れていることがあります。';

    case '関係性の相互作用を分析する':
      return '対人関係では、双方の自動反応が噛み合うことで問題が大きくなることがあります。';

    case '改善の方向性を提示する':
      return '改善の鍵は、相手の動機を理解しつつ、自分の反応パターンを少しずつ調整することです。';

    case '具体的な行動案を示す':
      return '具体的には、相手のニーズを確認する質問や、自分の境界線を丁寧に伝える方法が有効です。';

    case '追加の状況確認を行う':
      return 'もし差し支えなければ、最近その相手とのやり取りで印象的だった場面を教えてください。さらに深く分析できます。';

    default:
      return step;
  }
}

/** 自己矛盾の整理 — 文章化 */
function writeSelfConflict(step: string, userInput: string): string {
  switch (step) {
    case '矛盾を受け止める':
      return `自己矛盾についてのご相談ですね。「${userInput}」にどのような内的構造があるのか整理していきます。`;

    case '矛盾の表層を明確化する':
      return 'まず、表面上どのような矛盾が起きているのかを、行動・感情・思考の3つに分けて確認します。';

    case '矛盾の深層構造を特定する':
      return "自己矛盾は、多くの場合『欲求』『恐れ』『自動反応』の三層構造が衝突することで生じます。";

    case 'タイプ固有の葛藤ポイントを説明する':
      return 'エニアグラムでは、タイプごとに特有の葛藤ポイントがあり、同じ行動でも内的動機が異なるため矛盾が生まれやすくなります。';

    case '矛盾の両側にある動機を言語化する':
      return '矛盾の両側には、それぞれ守りたい価値や満たしたい欲求が存在します。それを丁寧に言語化します。';

    case '衝突している認知パターンを整理する':
      return '次に、どの認知パターンが衝突しているのかを特定し、どちらが自動反応でどちらが本来の意図なのかを区別します。';

    case '感情の流れを構造化する':
      return "矛盾が生じると、感情は『抑圧 → 反発 → 回避 → 固定化』の順で流れやすく、その流れを把握することが重要です。";

    case '行動パターンへの影響を説明する':
      return 'この内的衝突は、行動の遅延・過剰適応・過剰防衛などの形で表面化することがあります。';

    case '統合の方向性を提示する':
      return '統合の鍵は、矛盾の両側を否定せず、それぞれの価値を適切な場面で使い分けることです。';

    case '追加の深掘り質問を提示する':
      return 'もしよければ、この矛盾が最も強く出た具体的な場面を教えてください。さらに精密に構造化できます。';

    default:
      return step;
  }
}

/** ストレス時の行動パターン — 文章化 */
function writeStressPattern(step: string, userInput: string): string {
  switch (step) {
    case 'ストレスの訴えを受け止める':
      return `ストレスに関するご相談ですね。「${userInput}」がどのような反応パターンを生むのか整理していきます。`;

    case 'ストレスの入力源を特定する':
      return 'まず、ストレスの入力源を「外的要因」「内的要因」「関係性要因」のどこにあるかを明確にします。';

    case '認知の歪みや自動反応を確認する':
      return "ストレスがかかると、認知は『過大評価』『過小評価』『二極化』『自己責任化』などの自動反応を起こしやすくなります。";

    case '感情の流れを把握する':
      return "次に、感情がどのように流れているかを確認します。多くの場合、ストレス時は『不安 → 緊張 → 防衛 → 固定化』の順で強まります。";

    case '行動パターンの変化を特定する':
      return 'ストレスは行動に影響し、回避・過剰努力・過剰防衛・衝動的行動などの形で表れます。';

    case 'タイプ固有のストレス反応を説明する':
      return 'エニアグラムでは、タイプごとにストレス時の典型的な反応があり、普段の性質が極端化したり、別タイプの影響が強まることがあります。';

    case '悪循環のループを構造化する':
      return "ストレス反応は『認知 → 感情 → 行動 → 結果 → 再ストレス』というループを形成し、放置すると固定化します。";

    case 'ループを断ち切るポイントを提示する':
      return '改善の鍵は、ループのどこで介入するかを見極め、認知の修正・感情の調整・行動の再選択を行うことです。';

    case '具体的な対処案を示す':
      return '具体的には、状況の再評価、境界線の設定、負荷の分散、短期的なクールダウンなどが有効です。';

    case '追加の状況確認を行う':
      return 'もしよければ、最近ストレスが強く出た場面を教えてください。さらに精密に分析できます。';

    default:
      return step;
  }
}
