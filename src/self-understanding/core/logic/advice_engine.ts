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
import type { UserEnneagramProfile } from './response_engine';

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
 * を統合して「タイプ別の助言」を生成する。
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
    'ここまでの対話を踏まえて、あなたのタイプ構造に沿った助言をまとめました。\n',
    `【仕事】\n${advice.work}`,
    `【ストレス】\n${advice.stress}`,
    `【成長】\n${advice.growth}`,
  ].join('\n\n');
}

/** 仕事の助言（work） */
function buildWorkAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null
): string {
  const lines: string[] = [];

  if (behavior) {
    lines.push(`あなたの仕事スタイルは「${behavior.workStyle}」です。`);
  }
  if (instinct) {
    lines.push(
      `本能スタック（${instinct.name}）の影響で「${instinct.focus}」を優先しやすい傾向があります。`
    );
  }
  if (behavior) {
    lines.push(
      `そのため、仕事では「${behavior.decisionPattern}」という意思決定パターンが出やすいです。`
    );
  }
  if (type && lines.length === 0) {
    lines.push(`タイプの特性として「${type.coreDesire}」が仕事観に影響しやすいです。`);
  }

  return lines.join('\n') || '仕事面の助言を組み立てるには、タイプ情報が必要です。';
}

/** ストレス時の助言（stress） */
function buildStressAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null
): string {
  const lines: string[] = [];

  if (behavior) {
    lines.push(
      `ストレス時には「${behavior.stressReaction}」が強まりやすいです。`
    );
  }
  if (instinct) {
    lines.push(
      `本能スタックの影響で「${instinct.stressPattern}」が加わり、反応が増幅されることがあります。`
    );
  }
  if (type) {
    lines.push(
      `この状態では「${type.stressPattern}」というタイプ固有の反応が出やすくなります。`
    );
  }

  return lines.join('\n') || 'ストレス面の助言を組み立てるには、タイプ情報が必要です。';
}

/** 成長方向の助言（growth） */
function buildGrowthAdvice(
  type: EnneagramTypeEntry | null,
  behavior: EnneagramBehaviorEntry | null,
  instinct: EnneagramInstinctEntry | null,
  center: EnneagramCenterEntry | undefined
): string {
  const lines: string[] = [];

  if (type) {
    lines.push(`あなたの成長方向は「${type.growthDirection}」です。`);
  }
  if (center) {
    lines.push(
      `センター（${center.name}）の影響で「${center.growthDirection}」が基盤になります。`
    );
  }
  if (behavior) {
    lines.push(
      `行動面では「${behavior.communication}」を意識すると、成長が加速します。`
    );
  }
  if (instinct) {
    lines.push(
      `本能スタックの盲点「${instinct.blindSpot}」に注意すると、安定した成長が可能です。`
    );
  }

  return lines.join('\n') || '成長面の助言を組み立てるには、タイプ情報が必要です。';
}
