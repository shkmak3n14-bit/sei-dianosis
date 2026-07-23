// response_writer.ts
// 人格モデル（center / type / wing / behavior / instinct / insight）を使って文章化する

import type { ResponsePersonaContext } from './response_engine';

export type WriterContext = ResponsePersonaContext;

function typeName(ctx: WriterContext): string {
  return ctx.typeLabel || ctx.insight.code || 'あなたのタイプ';
}

function fear(ctx: WriterContext): string {
  return (
    ctx.persona?.coreFear ??
    ctx.center?.coreFear ??
    '不安や喪失'
  );
}

function desire(ctx: WriterContext): string {
  return (
    ctx.persona?.coreDesire ??
    ctx.center?.coreDesire ??
    '安定や充足'
  );
}

function stress(ctx: WriterContext): string {
  return (
    ctx.persona?.stressPattern ??
    ctx.behavior?.stressReaction ??
    ctx.center?.stressPattern ??
    '防衛的な反応が強まる'
  );
}

function growth(ctx: WriterContext): string {
  return (
    ctx.persona?.growthDirection ??
    ctx.center?.growthDirection ??
    '自分の本音に沿った選択を増やす'
  );
}

function conflict(ctx: WriterContext): string {
  return (
    ctx.persona?.conflictStyle ??
    ctx.behavior?.conflictPattern ??
    '衝突を避けたり、過剰に防衛したりする'
  );
}

function blindSpot(ctx: WriterContext): string {
  return (
    ctx.persona?.blindSpot ??
    ctx.instinct?.blindSpot ??
    ctx.center?.blindSpot ??
    '自分の自動反応に気づきにくい'
  );
}

function workStyle(ctx: WriterContext): string {
  return ctx.behavior?.workStyle ?? '自分なりのペースで進めようとする';
}

function communication(ctx: WriterContext): string {
  return ctx.behavior?.communication ?? '状況に合わせて伝え方を調整する';
}

function decision(ctx: WriterContext): string {
  return ctx.behavior?.decisionPattern ?? '慎重さと勢いのバランスで決める';
}

/**
 * ステップ名と人格モデル context から文章を生成する。
 * （旧 type 引数は context.flowType に移した）
 */
export function writeResponse(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (context.flowType) {
    case 'typeBoundary':
      return writeTypeBoundary(step, context, userInput);

    case 'diagnosisDoubt':
      return writeDiagnosisDoubt(step, context, userInput);

    case 'episodeAnalysis':
      return writeEpisodeAnalysis(step, context, userInput);

    case 'angerUnknown':
      return writeAngerUnknown(step, context, userInput);

    case 'abstractWordUnknown':
      return writeAbstractWordUnknown(step, context, userInput);

    case 'fallbackExpert':
      return writeFallbackExpert(step, context, userInput);

    case 'relationshipIssue':
      return writeRelationshipIssue(step, context, userInput);

    case 'selfConflict':
      return writeSelfConflict(step, context, userInput);

    case 'stressPattern':
      return writeStressPattern(step, context, userInput);

    case 'questionHowToAsk':
      return writeQuestionHowToAsk(step, context, userInput);

    case 'needRediagnosis':
      return writeNeedRediagnosis(step, context, userInput);

    case 'behaviorReason':
      return writeBehaviorReason(step, context, userInput);

    case 'emotionMovement':
      return writeEmotionMovement(step, context, userInput);

    case 'guiltUnknown':
      return writeGuiltUnknown(step, context, userInput);

    default:
      return step;
  }
}

/** どっちのタイプ？ — 文章化 */
function writeTypeBoundary(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '迷っているタイプを要約する':
      return `「${userInput}」という相談ですね。あなたのタイプは ${typeName(context)} で、${fear(context)} を恐れやすい傾向があります。`;

    case 'その2タイプが似ている理由を説明する':
      return `${typeName(context)} は「${desire(context)}」を軸に動くため、近接タイプと境界や主張の出方が似て見えることがあります。`;

    case '違いが出るポイントを比較する（3〜5項目）':
      return `ただし現れ方は違います。あなたの場合は「${conflict(context)}」という衝突スタイルが差を生むポイントです。`;

    case 'ユーザーの特徴（9w8）と照合する':
      return `あなたの場合は、まず「${desire(context)}」が先に来やすいです。これは ${typeName(context)} の特徴です。`;

    case '判断材料を提示する':
      return `もし『${desire(context)}』が強いなら ${typeName(context)} 寄り、別の動機が先に立つなら近接タイプの可能性を検討できます。`;

    case 'まとめ':
      return `つまり、似た力でも“目的”が違います。${typeName(context)} では「${desire(context)}」が判断の軸になります。`;

    case '必要なら追加質問':
      return '最近の出来事で、どちらの傾向が出ましたか？';

    default:
      return step;
  }
}

/** 診断結果に違和感 — 文章化 */
function writeDiagnosisDoubt(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '違和感の内容を要約する':
    case '疑っている理由を要約する':
      return `「${userInput}」ということは、${typeName(context)} の診断結果にしっくり来ていないということですね。`;

    case '違和感が生まれる典型理由を説明する':
    case '診断が揺れる典型パターンを説明する':
      return `診断が揺れるときは、ストレス状態・役割期待・環境要因が強く影響していることが多いです。${typeName(context)} では特に「${stress(context)}」が出やすいです。`;

    case 'タイプ9w8の境界が揺れやすいポイントを説明する':
    case 'ユーザーの特徴と照合する':
      return `あなたの場合は、普段の行動と診断結果のズレが気になっているように見えます。盲点は「${blindSpot(context)}」です。`;

    case '他タイプの可能性を簡単に提示する':
    case '再診断の導線を提示する':
    case '追加情報を求める（2〜3問）':
    case '判断材料を提示する':
      return `『普段の自分』と『ストレス下の自分』を分けて考えると、診断のブレが整理されやすいです。ストレス時は「${stress(context)}」を手がかりにしてください。`;

    case 'まとめ':
      return `診断は“固定のラベル”ではなく“傾向の地図”です。${typeName(context)} としての「${desire(context)}」を軸に見直すと揺れが整理しやすくなります。`;

    case '必要なら追加質問':
      return 'どの部分が特にしっくり来ていませんか？';

    default:
      return step;
  }
}

/** エピソード分析 — 文章化 */
function writeEpisodeAnalysis(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case 'ユーザーのエピソードを要約する':
    case 'エピソードの要点を要約する':
      return `「${userInput}」という幼少期のエピソードについて、まず内容を整理しますね。`;

    case 'エピソード分析の観点を説明する':
    case '4核分析（動機・願望・恐れ・行動）で分解する':
    case '感情の核を抽出する':
      return 'この出来事であなたが感じた感情は、一次感情（本音）と二次感情（反応）に分けて考えると整理しやすいです。';

    case 'タイプ9w8の構造と照合する':
    case '行動パターンを抽出する':
      return `その場面であなたが取った行動には、${typeName(context)} の自動反応「${conflict(context)}」が表れている可能性があります。`;

    case '価値観の形成につながる部分を説明する':
      return `幼少期の経験は、現在の価値観の土台になりやすいです。${typeName(context)} では「${desire(context)}」が価値観の核になりがちです。`;

    case '恐れ・欲求との関連を説明する':
      return `このエピソードは、あなたの根底にある恐れ「${fear(context)}」や欲求「${desire(context)}」と強く結びついている可能性があります。`;

    case 'タイプの補正ポイントを提示する':
      return `この出来事の解釈から、タイプ判定の補正ができます。特に“何を守ろうとしていたか”が重要で、${typeName(context)} なら「${desire(context)}」が鍵です。`;

    case 'まとめ（そのエピソードが何を示すか）':
    case 'まとめ':
      return `幼少期のエピソードは、現在の性格の“根っこ”を理解する手がかりです。${typeName(context)} の傾向と照らし合わせながら、さらに深めていきましょう。`;

    case '必要なら追加のエピソードを求める':
    case '必要なら追加質問':
      return 'この出来事の中で、特に印象に残っている感情や場面はどこですか？';

    default:
      return step;
  }
}

/** 怒りがわからない — 文章化 */
function writeAngerUnknown(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '怒りの疑問を要約する':
    case '怒りの原因を要約する':
      return `「${userInput}」ということは、怒りの理由が自分でも分からない状態ですね。`;

    case '怒りがわかりづらい理由（9の傾向）を説明する':
    case '怒りが分からなくなる典型パターンを説明する':
      return `怒りが分からなくなるときは、感情が一次感情ではなく二次感情として出ていることが多いです。${typeName(context)} では「${conflict(context)}」が怒りを覆いやすいです。`;

    case '9w8の怒りの構造（境界線・瞬間的反応）を説明する':
    case 'ユーザーの特徴と照合する':
      return `あなたの場合は、まず「${desire(context)}」を守ろうとするため、怒りが後から出てくる可能性があります。`;

    case '体感の例を提示する':
    case '判断材料を提示する':
      return `『本当に怒っている対象』と『表面上の怒り』を分けて考えると整理しやすいです。ストレス時は「${stress(context)}」が出やすい点も手がかりです。`;

    case 'まとめ':
      return '怒りが分からないのは“感情が混ざっている”サインです。ゆっくり分解していきましょう。';

    case '次の質問':
    case '必要なら追加質問':
      return '最近、どんな場面で怒りを感じましたか？';

    default:
      return step;
  }
}

/** 抽象語がわからない — 文章化 */
function writeAbstractWordUnknown(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case 'ユーザーの疑問を短く要約する':
      return `「${userInput}」という言葉の意味を、あなた向けに整理してみましょう。`;

    case '抽象語が理解しづらい理由を説明する（概念が広い／文脈依存）':
    case '抽象語の意味が人によって違うことを説明する':
      return `「${userInput}」という言葉は、人によって意味が大きく変わる“抽象語”です。まずはその前提を共有しますね。`;

    case '例え話で具体化する':
    case '一般的な意味をざっくり提示する':
      return '抽象語は辞書的な意味よりも、実際の体験や価値観によって形づくられます。一般的な説明はできますが、それだけでは本質に届きません。';

    case 'タイプ9w8に合わせて意味を噛み砕く':
    case '具体例（Aさんのケース）を提示する':
      return `例えば、${typeName(context)} の人にとってはこの言葉が「${desire(context)}」や境界の感覚と結びつくことがあります。人によってまったく違う使われ方をします。`;

    case '必要なら4核分析で補足する':
    case 'ユーザー自身の具体例を尋ねる':
      return 'あなたの場合、この言葉はどんな場面で出てきましたか？具体的な状況を教えてもらえると、あなたにとっての意味を一緒に特定できます。';

    case '動機・願望・恐れの観点で整理する意図を説明する':
      return `抽象語の本当の意味は、“動機・願望・恐れ・行動”の4つから整理すると明確になります。${typeName(context)} なら恐れは「${fear(context)}」、願望は「${desire(context)}」が起点になりやすいです。`;

    case 'まとめ（その言葉が9w8にどう関係するか）':
    case 'まとめ':
      return `抽象語は“あなたにとっての意味”を特定することが大切です。${typeName(context)} の心理構造に沿って具体化できます。`;

    case '次の質問を提示する':
    case '必要なら追加質問':
      return 'その言葉が出てきた場面を、思い出せる範囲で教えてください。';

    default:
      return step;
  }
}

/** 専門家モード — 文章化 */
function writeFallbackExpert(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case 'ユーザーの質問を専門家として受け止める':
      return `ご質問ありがとうございます。専門家の立場から「${userInput}」について整理します。`;

    case '問題の背景を構造的に説明する':
      return `まず、このテーマがどのような心理構造やタイプ論に関係するのかを明確にします。あなたの基準タイプは ${typeName(context)} です。`;

    case '専門的な観点から核心を提示する':
      return '本質的なポイントは、表面的な行動ではなく、その背後にある動機・恐れ・欲求の構造です。';

    case 'タイプ論・心理構造の観点から分析する':
      return `エニアグラムの観点では、中心となる恐れ「${fear(context)}」、自動反応「${conflict(context)}」、盲点「${blindSpot(context)}」の3つから説明できます。`;

    case 'ユーザーの状況に当てはめて具体化する':
      return `あなたのケースでは、仕事スタイル「${workStyle(context)}」や意思決定「${decision(context)}」に特有の傾向が見られます。`;

    case '改善の方向性・理解のポイントを示す':
      return `理解を深めるためには、自動反応を認識し、成長方向「${growth(context)}」に沿って動機を扱うことが重要です。`;

    case '必要なら追加質問を提示する':
      return 'もしよければ、最近このテーマに関連する出来事があれば教えてください。さらに深く分析できます。';

    default:
      return step;
  }
}

/** 対人関係の悩み — 文章化 */
function writeRelationshipIssue(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '悩みを受け止める':
      return `対人関係に関するご相談ですね。「${userInput}」について丁寧に整理していきます。`;

    case '状況の構造を明確化する':
      return 'まず、現在の状況を「事実」「相手の反応」「自分の内的反応」の3つに分けて理解します。';

    case '相手の心理構造を推測する':
      return '相手の行動や反応には、タイプ特有の動機や恐れが影響している可能性があります。';

    case '自分側の心理構造を整理する':
      return `あなた自身の反応には、${typeName(context)} 固有の「${conflict(context)}」やコミュニケーション傾向「${communication(context)}」が表れやすいです。`;

    case '関係性の相互作用を分析する':
      return `対人関係では、双方の自動反応が噛み合うことで問題が大きくなることがあります。あなたの側の盲点は「${blindSpot(context)}」です。`;

    case '改善の方向性を提示する':
      return `改善の鍵は、相手の動機を理解しつつ、成長方向「${growth(context)}」に沿って自分の反応を少しずつ調整することです。`;

    case '具体的な行動案を示す':
      return `具体的には、相手のニーズを確認する質問や、「${communication(context)}」を意識した境界の伝え方が有効です。`;

    case '追加の状況確認を行う':
      return 'もし差し支えなければ、最近その相手とのやり取りで印象的だった場面を教えてください。さらに深く分析できます。';

    default:
      return step;
  }
}

/** 自己矛盾の整理 — 文章化 */
function writeSelfConflict(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '矛盾を受け止める':
      return `自己矛盾についてのご相談ですね。「${userInput}」にどのような内的構造があるのか整理していきます。`;

    case '矛盾の表層を明確化する':
      return 'まず、表面上どのような矛盾が起きているのかを、行動・感情・思考の3つに分けて確認します。';

    case '矛盾の深層構造を特定する':
      return `自己矛盾は、多くの場合『欲求』『恐れ』『自動反応』の三層構造が衝突することで生じます。${typeName(context)} では恐れ「${fear(context)}」と願望「${desire(context)}」がぶつかりやすいです。`;

    case 'タイプ固有の葛藤ポイントを説明する':
      return `エニアグラムでは、タイプごとに特有の葛藤ポイントがあります。${typeName(context)} では「${conflict(context)}」が矛盾を生みやすい構造です。`;

    case '矛盾の両側にある動機を言語化する':
      return `矛盾の両側には、それぞれ守りたい価値や満たしたい欲求が存在します。あなたの軸は「${desire(context)}」です。`;

    case '衝突している認知パターンを整理する':
      return `次に、どの認知パターンが衝突しているのかを特定します。盲点「${blindSpot(context)}」が自動反応側に入りやすいです。`;

    case '感情の流れを構造化する':
      return "矛盾が生じると、感情は『抑圧 → 反発 → 回避 → 固定化』の順で流れやすく、その流れを把握することが重要です。";

    case '行動パターンへの影響を説明する':
      return `この内的衝突は、行動の遅延・過剰適応・過剰防衛などの形で表面化することがあります。仕事面では「${workStyle(context)}」に影響しやすいです。`;

    case '統合の方向性を提示する':
      return `統合の鍵は、矛盾の両側を否定せず、成長方向「${growth(context)}」に沿って価値を使い分けることです。`;

    case '追加の深掘り質問を提示する':
      return 'もしよければ、この矛盾が最も強く出た具体的な場面を教えてください。さらに精密に構造化できます。';

    default:
      return step;
  }
}

/** ストレス時の行動パターン — 文章化 */
function writeStressPattern(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case 'ストレスの訴えを受け止める':
      return `ストレスに関するご相談ですね。「${userInput}」がどのような反応パターンを生むのか整理していきます。`;

    case 'ストレスの入力源を特定する':
      return 'まず、ストレスの入力源を「外的要因」「内的要因」「関係性要因」のどこにあるかを明確にします。';

    case '認知の歪みや自動反応を確認する':
      return `ストレスがかかると、認知は自動反応を起こしやすくなります。${typeName(context)} では「${conflict(context)}」が出やすいです。`;

    case '感情の流れを把握する':
      return "次に、感情がどのように流れているかを確認します。多くの場合、ストレス時は『不安 → 緊張 → 防衛 → 固定化』の順で強まります。";

    case '行動パターンの変化を特定する':
      return `ストレスは行動に影響し、回避・過剰努力・過剰防衛・衝動的行動などの形で表れます。あなたの反応は「${stress(context)}」に寄りやすいです。`;

    case 'タイプ固有のストレス反応を説明する':
      return `エニアグラムでは、タイプごとにストレス時の典型反応があります。${typeName(context)} では「${stress(context)}」が中心になります。`;

    case '悪循環のループを構造化する':
      return "ストレス反応は『認知 → 感情 → 行動 → 結果 → 再ストレス』というループを形成し、放置すると固定化します。";

    case 'ループを断ち切るポイントを提示する':
      return `改善の鍵は、ループのどこで介入するかを見極めることです。成長方向「${growth(context)}」を介入軸にすると整理しやすいです。`;

    case '具体的な対処案を示す':
      return `具体的には、状況の再評価、境界線の設定、負荷の分散、短期的なクールダウンなどが有効です。意思決定では「${decision(context)}」を意識してください。`;

    case '追加の状況確認を行う':
      return 'もしよければ、最近ストレスが強く出た場面を教えてください。さらに精密に分析できます。';

    default:
      return step;
  }
}

function writeQuestionHowToAsk(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case 'ユーザーの迷いを要約する':
      return `「${userInput}」について、どう質問すればよいか迷っていますね。`;
    case '質問が難しい理由を説明する（抽象度／構造化の難しさ）':
      return `質問が難しくなるのは、抽象語と具体エピソードが混ざるからです。${typeName(context)} では恐れ「${fear(context)}」が質問を曖昧にしやすいです。`;
    case '質問テンプレートを提示する（3〜5個）':
      return '例: 「その場面で何を守りたかった？」「本当は何が怖かった？」「体はどう反応した？」';
    case 'ユーザーの状況に合わせて使い方を説明する':
      return `まず1つの場面だけ選び、上のテンプレートを順番に当てると精度が上がります。${typeName(context)} なら「${desire(context)}」を最初の軸にすると進めやすいです。`;
    case 'まとめ（質問の精度が上がる理由）':
      return '質問を構造化すると、感情と行動のつながりが見えやすくなります。';
    case '次の質問を促す':
      return '最近の1場面を1つ挙げて、最初の質問から試してみますか？';
    default:
      return step;
  }
}

function writeNeedRediagnosis(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '迷っている理由を要約する':
      return `再診断すべきか迷っているのですね。「${userInput}」は自然な迷いです。現在の仮説は ${typeName(context)} です。`;
    case '再診断が必要になる典型ケースを説明する':
      return `環境変化が大きい時期や、回答時のストレスが強かった場合は再診断が有効です。${typeName(context)} では「${stress(context)}」の影響で回答が揺れやすいです。`;
    case '現状の情報で判断できるポイントを提示する':
      return `普段の反応とストレス時の反応を分けて見られるかが判断ポイントです。普段は「${desire(context)}」、ストレス時は「${stress(context)}」を比較してください。`;
    case '追加で必要な情報を質問する':
      return '最近繰り返している反応パターンを1つ教えてください。';
    case '再診断の導線を提示する':
      return '情報が揃ったら、再診断前に仮説を立ててから進めると精度が上がります。';
    case 'まとめ':
      return `再診断は「やり直し」ではなく、現在地を再確認する作業です。${typeName(context)} という地図を更新するイメージです。`;
    default:
      return step;
  }
}

function writeBehaviorReason(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '行動の内容を要約する':
      return `「${userInput}」という行動の理由を整理しましょう。`;
    case 'その行動が起きる心理的背景を説明する':
      return `行動は多くの場合、恐れを避ける反応と、欲求を満たす反応の重なりで起きます。${typeName(context)} では恐れ「${fear(context)}」と願望「${desire(context)}」が同時に働きます。`;
    case '4核分析で分解する':
      return '動機・願望・恐れ・行動の4つに分けると、行動の意味が見えやすくなります。';
    case 'タイプ9w8の構造と照合する':
      return `${typeName(context)} では「${desire(context)}」と「${conflict(context)}」が同時に働くため、行動が揺れて見えることがあります。仕事面では「${workStyle(context)}」としても表れます。`;
    case 'まとめ（その行動が示す性質）':
      return `その行動は弱さではなく、守ろうとしている価値「${desire(context)}」の表れです。`;
    case '次の質問':
      return 'その行動が出る直前、何を一番避けたいと感じていましたか？';
    default:
      return step;
  }
}

function writeEmotionMovement(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '感情の疑問を要約する':
      return `「${userInput}」について、感情の流れがつかみにくい状態ですね。`;
    case '感情がわかりづらい理由を説明する（9の傾向）':
      return `${typeName(context)} の傾向では、「${conflict(context)}」のために感情を後回しにしやすく、気づきが遅れがちです。`;
    case 'タイプ9w8の感情構造を説明する':
      return `${typeName(context)} は普段「${desire(context)}」を優先しても、境界が侵されると「${stress(context)}」として強い反応が出ることがあります。`;
    case '具体例で補足する':
      return '例として「最初は我慢→あとで疲労や怒りとして出る」という流れがよく起こります。';
    case 'まとめ':
      return `感情は「遅れて出る」前提で追うと、実感と一致しやすくなります。成長方向は「${growth(context)}」です。`;
    case '次の質問':
      return '最近、後から感情が出てきた場面はありましたか？';
    default:
      return step;
  }
}

function writeGuiltUnknown(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  switch (step) {
    case '罪悪感の疑問を要約する':
      return `「${userInput}」という罪悪感の扱いが難しいのですね。`;
    case '罪悪感が生まれる心理構造を説明する':
      return `罪悪感は「期待とのズレ」を察知した時に生まれやすい感情です。${typeName(context)} では恐れ「${fear(context)}」がトリガーになりやすいです。`;
    case 'タイプ9w8の罪悪感の特徴を説明する':
      return `${typeName(context)} では「${conflict(context)}」と責任感が重なり、自分の境界より相手優先になりやすいです。盲点は「${blindSpot(context)}」です。`;
    case '具体例で補足する':
      return '断れなかった後に自己否定が強まる、という形で出ることがあります。';
    case 'まとめ':
      return `罪悪感は「悪い証拠」ではなく、価値観のセンサーとして扱うと整理しやすくなります。軸は「${desire(context)}」です。`;
    case '次の質問':
      return '最近、罪悪感が出た直前にどんな場面がありましたか？';
    default:
      return step;
  }
}
