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
  const name = typeName(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);

  switch (step) {
    case '迷っているタイプを要約する':
      return `「${userInput}」という相談ですね。今は、どのタイプが自分に一番しっくり来るのかを確かめたい状態だと思います。今の仮説タイプは ${name} です。`;

    case 'その2タイプが似ている理由を説明する':
      return `${name} は、根っこに「${coreDesire}」を満たしたいという動きがあり、近いタイプ同士だとその願望の方向性が似て見えやすくなります。`;

    case '違いが出るポイントを比較する（3〜5項目）':
      return `ただ、似ているからこそ違いが出るポイントもあります。特に「${conflictStyle}」のような衝突の仕方や、守ろうとするものの優先順位に差が出やすいです。`;

    case 'ユーザーの特徴（9w8）と照合する':
      return `あなたの話を聞いていると、まず「${coreDesire}」を守ろうとする動きが先に立っているように感じます。これは ${name} の特徴とよく重なっています。`;

    case '判断材料を提示する':
      return `もし『${coreDesire}』を優先する場面が多いなら ${name} 寄りの可能性が高く、別の願望や動機がいつも前に出るなら、近接タイプも候補に入れて考えてみる価値があります。`;

    case 'まとめ':
      return `つまり、タイプの違いは「どんな力を使うか」だけでなく、「その力を何のために使っているか」という目的の差として現れます。${name} の場合は「${coreDesire}」がその軸になりやすいタイプです。`;

    case '必要なら追加質問':
      return '最近の出来事で、「あ、これは自分のタイプっぽいな」と感じた場面があれば、1つ教えてもらえますか？';

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
  const name = typeName(context);
  const coreDesire = desire(context);
  const stressPattern = stress(context);
  const blind = blindSpot(context);

  switch (step) {
    case '違和感の内容を要約する':
    case '疑っている理由を要約する':
      return `「${userInput}」ということは、今のタイプ（${name}）に少し違和感がある状態なんですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '違和感が生まれる典型理由を説明する':
    case '診断が揺れる典型パターンを説明する':
      return `タイプ診断が揺れるときは、ストレス状態や役割期待、環境の影響が強く出ていることが多いです。特に ${name} の人は、ストレスがかかると「${stressPattern}」が表に出やすく、普段の自分と違って見えることがあります。`;

    case 'タイプ9w8の境界が揺れやすいポイントを説明する':
    case 'ユーザーの特徴と照合する':
      return `あなたの場合、普段の行動と診断結果のズレが気になっているように見えます。盲点になりやすいのは「${blind}」で、ここが違和感の原因になっている可能性があります。`;

    case '他タイプの可能性を簡単に提示する':
    case '再診断の導線を提示する':
    case '追加情報を求める（2〜3問）':
    case '判断材料を提示する':
      return `診断を整理するときは、「普段の自分」と「ストレス下の自分」を分けて見るのがとても有効です。ストレス時の反応「${stressPattern}」がどれくらい出ているかが、判断材料になります。`;

    case 'まとめ':
      return `タイプ診断は“固定のラベル”ではなく、自分の傾向を理解するための地図です。${name} の軸である「${coreDesire}」を手がかりにすると、違和感の正体が見えやすくなります。`;

    case '必要なら追加質問':
      return 'どの部分が特にしっくり来ていないと感じていますか？';

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
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);

  switch (step) {
    case 'ユーザーのエピソードを要約する':
    case 'エピソードの要点を要約する':
      return `「${userInput}」という幼少期のエピソードについて、まずは状況を丁寧に整理していきますね。`;

    case 'エピソード分析の観点を説明する':
    case '4核分析（動機・願望・恐れ・行動）で分解する':
    case '感情の核を抽出する':
      return `この出来事を理解するには、当時の「動機」「願望」「恐れ」「行動」を分けて見ると、感情の流れがとても分かりやすくなります。`;

    case 'タイプ9w8の構造と照合する':
    case '行動パターンを抽出する':
      return `その場面であなたが取った行動には、${name} の自動反応である「${conflictStyle}」が自然に表れていた可能性があります。これはタイプ特有の反応パターンです。`;

    case '価値観の形成につながる部分を説明する':
      return `幼少期の経験は、現在の価値観や“こうあるべき”という信念の土台になりやすいです。${name} の場合は「${coreDesire}」が価値観の中心になりやすい傾向があります。`;

    case '恐れ・欲求との関連を説明する':
      return `このエピソードは、あなたの根底にある恐れ「${coreFear}」や、満たしたい願望「${coreDesire}」と結びついている可能性があります。幼少期はその構造が最も素直に表れやすい時期です。`;

    case 'タイプの補正ポイントを提示する':
      return `この出来事の解釈から、タイプ判定の補正ができます。特に“何を守ろうとしていたか”が重要で、${name} なら「${coreDesire}」が鍵になります。`;

    case 'まとめ（そのエピソードが何を示すか）':
    case 'まとめ':
      return `幼少期のエピソードは、現在の性格の“根っこ”を理解するための大切な手がかりです。${name} の傾向と照らし合わせながら、さらに深めていきましょう。`;

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
  const name = typeName(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);
  const stressPattern = stress(context);

  switch (step) {
    case '怒りの疑問を要約する':
    case '怒りの原因を要約する':
      return `「${userInput}」ということは、怒りの理由が自分でもつかみにくい状態なんですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '怒りがわかりづらい理由（9の傾向）を説明する':
    case '怒りが分からなくなる典型パターンを説明する':
      return `怒りが分からなくなるときは、一次感情（本音）がすぐに出ず、二次感情として別の形で表れることが多いです。${name} の人は「${conflictStyle}」が先に働きやすく、怒りが後ろに隠れやすい傾向があります。`;

    case '9w8の怒りの構造（境界線・瞬間的反応）を説明する':
    case 'ユーザーの特徴と照合する':
      return `あなたの場合、まず「${coreDesire}」を守ろうとする動きが強く出るため、怒りがその場では抑えられ、あとから出てくることがあります。これは ${name} の人に自然に起こりやすい反応です。`;

    case '体感の例を提示する':
    case '判断材料を提示する':
      return `『本当に怒っている対象』と『表面上の怒り』がズレていることもあります。ストレスがかかると「${stressPattern}」が出やすくなるので、怒りの方向が分かりづらくなることがあります。`;

    case 'まとめ':
      return `怒りが分からないのは、感情が混ざっているサインです。ゆっくり分解していくと、本音の部分が見えやすくなります。`;

    case '次の質問':
    case '必要なら追加質問':
      return '最近、どんな場面で「後から怒りが出てきた」と感じましたか？';

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
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);

  switch (step) {
    case 'ユーザーの疑問を短く要約する':
      return `「${userInput}」という言葉について、まずはあなたにとっての意味を一緒に整理していきましょう。`;

    case '抽象語が理解しづらい理由を説明する（概念が広い／文脈依存）':
    case '抽象語の意味が人によって違うことを説明する':
      return `「${userInput}」のような抽象語は、使う人や状況によって意味が大きく変わります。辞書的な意味よりも、文脈や体験のほうが影響しやすい言葉なんです。`;

    case '例え話で具体化する':
    case '一般的な意味をざっくり提示する':
      return `抽象語は、一般的な説明だけだと本質に届きにくいことがあります。実際には、その人の価値観や経験によって形が変わる“ゆらぎのある言葉”なんです。`;

    case 'タイプ9w8に合わせて意味を噛み砕く':
    case '具体例（Aさんのケース）を提示する':
      return `${name} の人の場合、この言葉が「${coreDesire}」や境界の感覚と結びつくことがあります。もちろん人によって違いますが、価値観の軸が反映されやすい言葉です。`;

    case '必要なら4核分析で補足する':
    case 'ユーザー自身の具体例を尋ねる':
      return `あなた自身は、この言葉をどんな場面で耳にしましたか？具体的な状況を教えてもらえると、あなたの心理構造に沿って意味を特定できます。`;

    case '動機・願望・恐れの観点で整理する意図を説明する':
      return `抽象語の本当の意味をつかむには、“動機・願望・恐れ・行動”の4つの観点から整理すると分かりやすくなります。${name} の場合、恐れは「${coreFear}」、願望は「${coreDesire}」が起点になりやすいです。`;

    case 'まとめ（その言葉が9w8にどう関係するか）':
    case 'まとめ':
      return `抽象語は“あなたにとっての意味”を特定することが大切です。${name} の心理構造に沿って具体化すると、理解が深まりやすくなります。`;

    case '次の質問を提示する':
    case '必要なら追加質問':
      return 'その言葉が出てきた場面を、思い出せる範囲で教えてください。そこから一緒に意味を特定していきましょう。';

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
  const name = typeName(context);
  const coreFear = fear(context);
  const conflictStyle = conflict(context);
  const blind = blindSpot(context);
  const work = workStyle(context);
  const decisionStyle = decision(context);
  const growthDir = growth(context);

  switch (step) {
    case 'ユーザーの質問を専門家として受け止める':
      return `ご質問ありがとうございます。「${userInput}」について、専門的な観点から丁寧に整理していきますね。`;

    case '問題の背景を構造的に説明する':
      return `まず、このテーマがどのような心理構造やタイプ論に関係しているのかを明確にします。あなたの基準タイプは ${name} で、ここが理解の土台になります。`;

    case '専門的な観点から核心を提示する':
      return `本質的なポイントは、表面的な行動ではなく、その背後にある「動機」「恐れ」「欲求」の構造です。これらがどのように組み合わさって反応を生んでいるかを見ていきます。`;

    case 'タイプ論・心理構造の観点から分析する':
      return `エニアグラムの観点では、中心となる恐れ「${coreFear}」、自動反応「${conflictStyle}」、そして盲点「${blind}」の3つが、あなたの反応パターンを形づくっています。`;

    case 'ユーザーの状況に当てはめて具体化する':
      return `あなたのケースでは、仕事の進め方「${work}」や意思決定の傾向「${decisionStyle}」に、タイプ特有の構造が自然に表れています。これらは性格の“癖”ではなく、心理構造の一貫した流れです。`;

    case '改善の方向性・理解のポイントを示す':
      return `理解を深めるためには、自動反応を認識しつつ、成長方向である「${growthDir}」を少しずつ選択に取り入れていくことが大切です。これがタイプの統合に向かう動きになります。`;

    case '必要なら追加質問を提示する':
      return 'もしよければ、最近このテーマに関連する出来事があれば教えてください。さらに精密に分析できます。';

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
  const name = typeName(context);
  const conflictStyle = conflict(context);
  const communicationStyle = communication(context);
  const blind = blindSpot(context);
  const growthDir = growth(context);

  switch (step) {
    case '悩みを受け止める':
      return `対人関係についてのご相談ですね。「${userInput}」という状況を、まずはあなた自身の反応の構造から丁寧に整理していきましょう。`;

    case '状況の構造を明確化する':
      return `対人関係の悩みは、「事実」「自分の内的反応」「自分の行動」の3つに分けて見ると理解しやすくなります。まずはあなたの側の構造を見ていきますね。`;

    case '相手の心理構造を推測する':
      return `ここでは相手のタイプや心理構造は扱わず、あなた自身の反応の流れに焦点を当てます。相手の理解が必要になったら、他者理解モジュールで扱うことができます。`;

    case '自分側の心理構造を整理する':
      return `あなたの反応には、${name} の傾向である「${conflictStyle}」や、コミュニケーションの癖である「${communicationStyle}」が自然に表れやすいです。これは性格の癖ではなく、心理構造の流れです。`;

    case '関係性の相互作用を分析する':
      return `対人関係のズレは、あなたの自動反応と盲点「${blind}」が影響している可能性があります。まずは自分の反応のパターンを理解することが、関係改善の第一歩になります。`;

    case '改善の方向性を提示する':
      return `改善の鍵は、自分の反応を少しずつ調整することです。特に、成長方向である「${growthDir}」を意識すると、関係の流れが穏やかになりやすいです。`;

    case '具体的な行動案を示す':
      return `具体的には、「自分が何を感じているか」を少し丁寧に言語化したり、「${communicationStyle}」を意識して境界線を伝えると、関係の負荷が軽くなりやすいです。`;

    case '追加の状況確認を行う':
      return 'もし差し支えなければ、最近のやり取りで「自分の反応が強く出た」と感じた場面を教えてください。そこからさらに精密に整理できます。';

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
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);
  const blind = blindSpot(context);
  const work = workStyle(context);
  const growthDir = growth(context);

  switch (step) {
    case '矛盾を受け止める':
      return `自己矛盾についてのご相談ですね。「${userInput}」という状態を、まずはあなた自身の内側の構造から丁寧に整理していきます。`;

    case '矛盾の表層を明確化する':
      return `自己矛盾は、表面では「行動」「感情」「思考」が噛み合っていないように見えることがあります。まずはどこでズレが起きているのかを確認していきましょう。`;

    case '矛盾の深層構造を特定する':
      return `内側で矛盾が生じるときは、「欲求」「恐れ」「自動反応」の三層がぶつかっていることが多いです。${name} の場合、恐れ「${coreFear}」と願望「${coreDesire}」が同時に働きやすい傾向があります。`;

    case 'タイプ固有の葛藤ポイントを説明する':
      return `タイプごとに葛藤が生まれやすいポイントがあります。${name} の場合は「${conflictStyle}」が強く出ると、内側の動きがぶつかりやすくなります。`;

    case '矛盾の両側にある動機を言語化する':
      return `矛盾の両側には、それぞれ守りたい価値や満たしたい願望があります。あなたの軸は「${coreDesire}」で、ここがどのように働いているかを見ていくと整理しやすくなります。`;

    case '衝突している認知パターンを整理する':
      return `認知のズレは、盲点「${blind}」が影響している可能性があります。自動反応側に盲点が入りやすいので、気づきにくい衝突が起きやすいんです。`;

    case '感情の流れを構造化する':
      return `矛盾が強くなると、感情は「抑圧 → 反発 → 回避 → 固定化」という流れで動きやすくなります。この流れを把握すると、感情の扱いが楽になります。`;

    case '行動パターンへの影響を説明する':
      return `内的な衝突は、行動の遅延・過剰適応・防衛的な反応として表面化することがあります。仕事面では「${work}」に影響が出ることもあります。`;

    case '統合の方向性を提示する':
      return `統合の鍵は、矛盾の両側を否定せず、成長方向である「${growthDir}」を少しずつ選択に取り入れることです。これが内側の流れを整える助けになります。`;

    case '追加の深掘り質問を提示する':
      return 'もしよければ、この矛盾が最も強く出た具体的な場面を教えてください。そこからさらに精密に整理できます。';

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
  const name = typeName(context);
  const stressPattern = stress(context);
  const conflictStyle = conflict(context);
  const decisionStyle = decision(context);
  const growthDir = growth(context);

  switch (step) {
    case 'ストレスの訴えを受け止める':
      return `ストレスについてのご相談ですね。「${userInput}」という状態を、まずはあなた自身の内側の反応から丁寧に整理していきます。`;

    case 'ストレスの入力源を特定する':
      return `ストレスは「外的要因」「内的要因」「関係性の要因」のどこから入ってきているかで、反応の出方が大きく変わります。まずはどこが一番負荷になっているのかを見ていきましょう。`;

    case '認知の歪みや自動反応を確認する':
      return `ストレスが強くなると、認知は自動反応に引っ張られやすくなります。${name} の場合は「${conflictStyle}」が先に働き、判断が偏ったり、感情が後ろに隠れたりすることがあります。`;

    case '感情の流れを把握する':
      return `ストレス時の感情は「不安 → 緊張 → 防衛 → 固定化」という流れで強まりやすいです。この流れを理解しておくと、感情の扱いが少し楽になります。`;

    case '行動パターンの変化を特定する':
      return `ストレスは行動にも影響し、回避・過剰努力・防衛的な反応などの形で表れます。あなたの場合は「${stressPattern}」が出やすく、普段の自分とは違う行動になることがあります。`;

    case 'タイプ固有のストレス反応を説明する':
      return `${name} のストレス反応は、「${stressPattern}」が中心になります。これは弱さではなく、心理構造が負荷に反応している自然な動きです。`;

    case '悪循環のループを構造化する':
      return `ストレス反応は「認知 → 感情 → 行動 → 結果 → 再ストレス」というループを作りやすく、放置すると固定化します。どこでループが始まっているかを見極めることが大切です。`;

    case 'ループを断ち切るポイントを提示する':
      return `改善の鍵は、ループのどこで介入するかです。特に、成長方向である「${growthDir}」を小さく取り入れると、ループがゆっくりほどけていきます。`;

    case '具体的な対処案を示す':
      return `具体的には、状況の再評価、境界線の調整、負荷の分散、短期的なクールダウンなどが有効です。意思決定の場面では「${decisionStyle}」を意識すると、ストレスに引っ張られにくくなります。`;

    case '追加の状況確認を行う':
      return '最近、ストレスが強く出た場面があれば教えてください。そこからさらに精密に整理できます。';

    default:
      return step;
  }
}

function writeQuestionHowToAsk(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);

  switch (step) {
    case 'ユーザーの迷いを要約する':
      return `「${userInput}」について、どう質問すれば自分の内側が整理できるのか迷っている状態ですね。まずはその迷いを丁寧に扱っていきます。`;

    case '質問が難しい理由を説明する（抽象度／構造化の難しさ）':
      return `質問が難しくなるのは、抽象的な言葉と具体的な場面が混ざってしまうからです。${name} の場合、恐れである「${coreFear}」が働くと、質問がぼやけやすい傾向があります。`;

    case '質問テンプレートを提示する（3〜5個）':
      return `質問を構造化すると、自分の内側が見えやすくなります。例えば次のような質問が役立ちます。
- その場面で、何を一番守りたかった？
- 本当は何が怖かった？
- 体はどう反応していた？
- どの瞬間から違和感が始まった？
- その後、どんな選択をしようとしていた？`;

    case 'ユーザーの状況に合わせて使い方を説明する':
      return `まずは最近の出来事を1つだけ選び、上の質問を順番に当ててみると、自分の反応の流れが見えやすくなります。${name} の場合は、願望である「${coreDesire}」を最初の軸にすると整理が進みやすいです。`;

    case 'まとめ（質問の精度が上がる理由）':
      return `質問を構造化すると、感情・思考・行動のつながりが自然に見えてきます。これは自己理解の精度を上げるための大切なステップです。`;

    case '次の質問を促す':
      return '最近の出来事を1つ挙げて、最初の質問から一緒に整理してみましょう。';

    default:
      return step;
  }
}

function writeNeedRediagnosis(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const stressPattern = stress(context);
  const blind = blindSpot(context);

  switch (step) {
    case '再診断の迷いを受け止める':
      return `「${userInput}」ということは、今のタイプ（${name}）に少し迷いが出ている状態ですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '迷いが生まれる典型理由を説明する':
      return `タイプ診断に迷いが出るのは自然なことで、ストレス状態・役割期待・環境の影響が強く出ていると、普段の自分と違って見えることがあります。特に「${stressPattern}」が出ていると、タイプが揺れやすくなります。`;

    case 'タイプの核（恐れ・願望）を再確認する':
      return `タイプを見直すときは、行動よりも「恐れ」「願望」を確認するのが一番確実です。あなたの核となる恐れは「${coreFear}」、願望は「${coreDesire}」です。ここがブレていないかを見ていきましょう。`;

    case '迷いの原因を構造化する':
      return `迷いの原因は、盲点「${blind}」が影響している可能性があります。盲点が働くと、自分の反応の“本当の理由”が見えづらくなり、タイプが違うように感じることがあります。`;

    case '再診断が必要かどうかの判断基準を提示する':
      return `再診断が必要かどうかは、「普段の自分」と「ストレス下の自分」を分けて見たときに、核となる願望がどちらでも同じかどうかで判断できます。願望が変わらないなら、タイプは大きくズレていません。`;

    case '再診断の進め方を提案する':
      return `もし再診断を進めるなら、最近の出来事を3つほど選び、それぞれで「何を守ろうとしたか」「何が怖かったか」を確認すると、タイプの軸が自然に浮かび上がります。`;

    case 'まとめ（迷いの扱い方）':
      return `タイプの迷いは、自己理解が深まっているサインでもあります。焦らず、核となる恐れと願望を手がかりに整理していけば、自然と輪郭がはっきりしてきます。`;

    case '追加質問':
      return '最近「この反応はタイプと違うかも」と感じた場面があれば、1つ教えてください。そこから一緒に整理できます。';

    default:
      return step;
  }
}

function writeBehaviorReason(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);
  const blind = blindSpot(context);
  const work = workStyle(context);

  switch (step) {
    case '行動理由の疑問を受け止める':
      return `「${userInput}」という行動について、なぜそうしたのか自分でも分からない状態なんですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '行動の表層を整理する':
      return `行動には必ず「表に見える理由」と「内側で働いていた理由」があります。まずは表層の行動をそのまま整理してみますね。`;

    case '行動の深層構造を説明する':
      return `深層では、恐れ「${coreFear}」や願望「${coreDesire}」が同時に働いていた可能性があります。行動はこの2つの力のバランスで決まることが多いです。`;

    case '自動反応の影響を説明する':
      return `その場面では、${name} の自動反応である「${conflictStyle}」が先に働き、行動が瞬間的に決まった可能性があります。これは性格の癖ではなく、心理構造の自然な動きです。`;

    case '盲点が行動理由を隠すことを説明する':
      return `行動理由が分からなくなるのは、盲点「${blind}」が影響していることがあります。盲点が働くと、行動の“本当の動機”が自分でも見えづらくなるんです。`;

    case '行動の目的を言語化する':
      return `行動の裏側には、必ず守りたい価値や満たしたい願望があります。あなたの場合は「${coreDesire}」を守るための選択だった可能性が高いです。`;

    case '行動パターンの傾向を説明する':
      return `行動の傾向は、仕事の進め方「${work}」にも自然に表れます。これは性格の癖ではなく、心理構造の一貫した流れです。`;

    case 'まとめ（行動理由の扱い方）':
      return `行動理由が分からないときは、表層ではなく深層の「恐れ・願望・自動反応」を見ていくと、自然に輪郭がはっきりしてきます。これは自己理解を深める大切なステップです。`;

    case '追加質問':
      return 'この行動の前後で、どんな気持ちや違和感がありましたか？そこからさらに精密に整理できます。';

    default:
      return step;
  }
}

function writeEmotionMovement(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);
  const stressPattern = stress(context);
  const blind = blindSpot(context);

  switch (step) {
    case '感情の疑問を受け止める':
      return `「${userInput}」という感情の動きについて、なぜそう感じたのか分からない状態なんですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '感情の表層を整理する':
      return `感情には「表に出ている感情」と「内側で先に動いていた感情」があります。まずは表層の感情をそのまま整理してみますね。`;

    case '感情の深層構造を説明する':
      return `深層では、恐れ「${coreFear}」や願望「${coreDesire}」が同時に働いていた可能性があります。感情はこの2つの力のバランスで揺れやすいんです。`;

    case '自動反応の影響を説明する':
      return `その場面では、${name} の自動反応である「${conflictStyle}」が先に働き、感情が一気に動いた可能性があります。これは性格の癖ではなく、心理構造の自然な動きです。`;

    case '感情の流れを段階として説明する':
      return `感情は「刺激 → 内的反応 → 認知の揺れ → 行動衝動 → 表出」という流れで動きます。ストレスが強いと「${stressPattern}」が入り、流れが速くなったり、途中で歪んだりします。`;

    case '盲点が感情の理解を妨げることを説明する':
      return `感情の理由が分からなくなるのは、盲点「${blind}」が影響していることがあります。盲点が働くと、感情の“最初の動き”が自分でも見えづらくなるんです。`;

    case '感情の目的を言語化する':
      return `感情の裏側には、必ず守りたい価値や満たしたい願望があります。あなたの場合は「${coreDesire}」を守るために感情が動いた可能性が高いです。`;

    case '感情と行動のつながりを説明する':
      return `感情の動きは行動にも影響し、回避・反発・沈黙・過剰適応などの形で表れます。これは弱さではなく、心理構造の自然な反応です。`;

    case 'まとめ（感情の扱い方）':
      return `感情の動きが分からないときは、表層ではなく深層の「恐れ・願望・自動反応」を見ていくと、自然に輪郭がはっきりしてきます。これは自己理解を深める大切なステップです。`;

    case '追加質問':
      return 'この感情が動いた場面で、最初に体がどう反応したか覚えていますか？そこからさらに精密に整理できます。';

    default:
      return step;
  }
}

function writeGuiltUnknown(
  step: string,
  context: WriterContext,
  userInput: string
): string {
  const name = typeName(context);
  const coreFear = fear(context);
  const coreDesire = desire(context);
  const conflictStyle = conflict(context);
  const blind = blindSpot(context);
  const stressPattern = stress(context);

  switch (step) {
    case '罪悪感の疑問を受け止める':
      return `「${userInput}」という罪悪感について、なぜそう感じたのか自分でも分からない状態なんですね。まずはその感覚を丁寧に扱っていきましょう。`;

    case '罪悪感の表層を整理する':
      return `罪悪感には「表に出ている理由」と「内側で先に動いていた理由」があります。まずは表層の感情をそのまま整理してみますね。`;

    case '罪悪感の深層構造を説明する':
      return `深層では、恐れ「${coreFear}」や願望「${coreDesire}」が同時に働いていた可能性があります。罪悪感はこの2つの力がぶつかったときに生まれやすいんです。`;

    case '自動反応の影響を説明する':
      return `その場面では、${name} の自動反応である「${conflictStyle}」が先に働き、罪悪感が一気に強まった可能性があります。これは性格の癖ではなく、心理構造の自然な動きです。`;

    case '罪悪感の流れを段階として説明する':
      return `罪悪感は「刺激 → 内的反応 → 認知の揺れ → 自責 → 固定化」という流れで強まりやすいです。ストレスが強いと「${stressPattern}」が入り、流れが速くなったり、途中で歪んだりします。`;

    case '盲点が罪悪感の理解を妨げることを説明する':
      return `罪悪感の理由が分からなくなるのは、盲点「${blind}」が影響していることがあります。盲点が働くと、罪悪感の“最初の動機”が自分でも見えづらくなるんです。`;

    case '罪悪感の目的を言語化する':
      return `罪悪感の裏側には、必ず守りたい価値や満たしたい願望があります。あなたの場合は「${coreDesire}」を守るために罪悪感が動いた可能性が高いです。`;

    case '罪悪感と行動のつながりを説明する':
      return `罪悪感は行動にも影響し、過剰な責任感・謝罪・回避・自己抑制などの形で表れます。これは弱さではなく、心理構造の自然な反応です。`;

    case 'まとめ（罪悪感の扱い方）':
      return `罪悪感の理由が分からないときは、表層ではなく深層の「恐れ・願望・自動反応」を見ていくと、自然に輪郭がはっきりしてきます。これは自己理解を深める大切なステップです。`;

    case '追加質問':
      return 'この罪悪感が生まれた場面で、最初にどんな違和感がありましたか？そこからさらに精密に整理できます。';

    default:
      return step;
  }
}
