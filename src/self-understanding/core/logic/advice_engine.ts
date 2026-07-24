// advice_engine.ts

import {
  CENTER_INSIGHTS,
  getEnneagramBehaviorEntry,
  getEnneagramInstinctEntry,
  getEnneagramTypeEntry,
  type EnneagramBehaviorEntry,
  type EnneagramCenterEntry,
  type EnneagramInstinctEntry,
  type EnneagramTypeEntry,
} from '../data/enneagram';
import type { UserEnneagramProfile } from './response_engine/types';

export type GeneratedAdvice = {
  work: string;
  stress: string;
  growth: string;
};

/**
 * サイの助言エンジン（advice_engine）
 *
 * - 行動辞書（behavior）
 * - 本能辞書（instincts）
 * - タイプ辞書（type）
 * - センター辞書（center）
 *
 * を統合して「タイプ構造の自然な説明」を生成する。
 */
export function generateAdvice(
  userProfile: UserEnneagramProfile
): GeneratedAdvice {
  const typeKey = userProfile.wing || userProfile.type;
  const type = getEnneagramTypeEntry(typeKey);
  const behavior = getEnneagramBehaviorEntry(userProfile.type);
  // behavior は wing の影響を受けないため、type を使う
  const instinct = userProfile.instinct
    ? getEnneagramInstinctEntry(userProfile.instinct)
    : null;
  const center = CENTER_INSIGHTS[userProfile.center];

  return {
    work: buildWorkAdvice(type, behavior, instinct),
    stress: buildStressAdvice(type, behavior, instinct),
    growth: buildGrowthAdvice(type, behavior, instinct, center),
  };
}

/** チャット表示用に work / stress / growth を1本の文章にする */
export function formatAdviceMessage(advice: GeneratedAdvice): string {
  return [
    'ここまでの対話を踏まえて、あなたの内側で起きやすい動きを、タイプ構造に沿って整理してみました。\n',
    `【仕事の場面】\n${advice.work}`,
    `【負荷がかかったとき】\n${advice.stress}`,
    `【これから少しずつ整えられる方向】\n${advice.growth}`,
  ].join('\n\n');
}

/** 仕事の場面での構造説明 */
function buildWorkAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null
): string {
  const lines: string[] = [];

  if (type) {
    lines.push(
      `仕事の場面では、根っこにある願望「${type.coreDesire}」が、進め方や判断の軸になりやすいです。`
    );
  }
  if (behavior) {
    lines.push(
      `そのうえで、あなたの仕事の進め方は「${behavior.workStyle}」として表れやすいです。`
    );
    lines.push(
      `決めるときの流れも、「${behavior.decisionPattern}」になりやすい傾向があります。`
    );
  }
  if (instinct) {
    lines.push(
      `そこに、${instinct.name} の本能が加わると、「${instinct.focus}」を先に大切にしたくなりやすいです。これは性格の癖ではなく、内側の自然な優先順位です。`
    );
  }
  if (type && !behavior && !instinct) {
    lines.push(
      `恐れ「${type.coreFear}」が刺激されると、仕事のペースや関わり方が揺れやすくなることもあります。`
    );
  }

  return (
    lines.join('\n') ||
    '仕事の場面の構造を整理するには、タイプ情報がもう少し必要です。'
  );
}

/** 負荷がかかったときの構造説明 */
function buildStressAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null
): string {
  const lines: string[] = [];

  if (type) {
    lines.push(
      `負荷がかかると、まず恐れ「${type.coreFear}」が動きやすくなります。そのとき「${type.stressPattern}」という流れが出てくることがあります。`
    );
  }
  if (behavior) {
    lines.push(
      `行動面では、「${behavior.stressReaction}」が少し強まりやすいです。これは弱さではなく、内側が自分を守ろうとしている自然な反応です。`
    );
  }
  if (instinct) {
    lines.push(
      `${instinct.name} の本能が働いていると、「${instinct.stressPattern}」が加わり、普段より反応が大きく感じられることがあります。`
    );
  }

  return (
    lines.join('\n') ||
    '負荷がかかったときの構造を整理するには、タイプ情報がもう少し必要です。'
  );
}

/** これから少しずつ整えられる方向の説明 */
function buildGrowthAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null,
  center: EnneagramCenterEntry | undefined
): string {
  const lines: string[] = [];

  if (type) {
    lines.push(
      `これから少しずつ整えられる方向は、「${type.growthDirection}」です。願望「${type.coreDesire}」を大切にしつつ、恐れ「${type.coreFear}」に引っ張られすぎない選択を増やすイメージです。`
    );
  }
  if (center) {
    lines.push(
      `${center.name} センターの土台としては、「${center.growthDirection}」が支えになります。`
    );
  }
  if (behavior) {
    lines.push(
      `日々の関わりでは、「${behavior.communication}」を少し意識するだけで、内側の流れが穏やかになりやすいです。`
    );
  }
  if (instinct) {
    lines.push(
      `${instinct.name} の本能では、「${instinct.blindSpot}」が見えにくくなりやすいので、ここだけやさしく気にかけておくと、整えやすくなります。`
    );
  }

  return (
    lines.join('\n') ||
    '整え方の構造を整理するには、タイプ情報がもう少し必要です。'
  );
}
