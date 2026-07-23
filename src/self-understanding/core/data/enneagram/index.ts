/**
 * エニアグラム辞書の公開エントリ
 * center / types / wings をまとめて export する
 */

export type {
  EnneagramCenterEntry,
  EnneagramInsightEntry,
  EnneagramTypeEntry,
} from './schema';

export { gutCenter } from './center/gut';
export { heartCenter } from './center/heart';
export { headCenter } from './center/head';

export { type1 } from './types/type1';
export { type2 } from './types/type2';
export { type3 } from './types/type3';
export { type4 } from './types/type4';
export { type5 } from './types/type5';
export { type6 } from './types/type6';
export { type7 } from './types/type7';
export { type8 } from './types/type8';
export { type9 } from './types/type9';

export { type1w9 } from './wings/type1w9';
export { type1w2 } from './wings/type1w2';
export { type2w1 } from './wings/type2w1';
export { type2w3 } from './wings/type2w3';
export { type3w2 } from './wings/type3w2';
export { type3w4 } from './wings/type3w4';
export { type4w3 } from './wings/type4w3';
export { type4w5 } from './wings/type4w5';
export { type5w4 } from './wings/type5w4';
export { type5w6 } from './wings/type5w6';
export { type6w5 } from './wings/type6w5';
export { type6w7 } from './wings/type6w7';
export { type7w6 } from './wings/type7w6';
export { type7w8 } from './wings/type7w8';
export { type8w7 } from './wings/type8w7';
export { type8w9 } from './wings/type8w9';
export { type9w1 } from './wings/type9w1';
export { type9w8 } from './wings/type9w8';

import type {
  EnneagramCenterEntry,
  EnneagramInsightEntry,
  EnneagramTypeEntry,
} from './schema';
import { gutCenter } from './center/gut';
import { heartCenter } from './center/heart';
import { headCenter } from './center/head';
import { type1 } from './types/type1';
import { type2 } from './types/type2';
import { type3 } from './types/type3';
import { type4 } from './types/type4';
import { type5 } from './types/type5';
import { type6 } from './types/type6';
import { type7 } from './types/type7';
import { type8 } from './types/type8';
import { type9 } from './types/type9';
import { type1w2 } from './wings/type1w2';
import { type1w9 } from './wings/type1w9';
import { type2w1 } from './wings/type2w1';
import { type2w3 } from './wings/type2w3';
import { type3w2 } from './wings/type3w2';
import { type3w4 } from './wings/type3w4';
import { type4w3 } from './wings/type4w3';
import { type4w5 } from './wings/type4w5';
import { type5w4 } from './wings/type5w4';
import { type5w6 } from './wings/type5w6';
import { type6w5 } from './wings/type6w5';
import { type6w7 } from './wings/type6w7';
import { type7w6 } from './wings/type7w6';
import { type7w8 } from './wings/type7w8';
import { type8w7 } from './wings/type8w7';
import { type8w9 } from './wings/type8w9';
import { type9w1 } from './wings/type9w1';
import { type9w8 } from './wings/type9w8';

/** 純タイプ（1〜9） */
export const BASE_TYPES: Record<string, EnneagramTypeEntry> = {
  '1': type1,
  '2': type2,
  '3': type3,
  '4': type4,
  '5': type5,
  '6': type6,
  '7': type7,
  '8': type8,
  '9': type9,
};

/** ウイング（18種） */
export const WING_TYPES: Record<string, EnneagramTypeEntry> = {
  '1w2': type1w2,
  '1w9': type1w9,
  '2w1': type2w1,
  '2w3': type2w3,
  '3w2': type3w2,
  '3w4': type3w4,
  '4w3': type4w3,
  '4w5': type4w5,
  '5w4': type5w4,
  '5w6': type5w6,
  '6w5': type6w5,
  '6w7': type6w7,
  '7w6': type7w6,
  '7w8': type7w8,
  '8w7': type8w7,
  '8w9': type8w9,
  '9w1': type9w1,
  '9w8': type9w8,
};

/** センター辞書 */
export const CENTER_INSIGHTS: Record<string, EnneagramCenterEntry> = {
  Gut: gutCenter,
  Heart: heartCenter,
  Head: headCenter,
};

const DEFAULT_INSIGHT =
  'あなたのタイプの特性が、fear・desire・motive・action の動きに影響しています。';

function formatTypeInsight(entry: EnneagramTypeEntry): string {
  return [
    `恐れ：${entry.coreFear}`,
    `願望：${entry.coreDesire}`,
    `ストレス時：${entry.stressPattern}`,
    `成長方向：${entry.growthDirection}`,
    `衝突スタイル：${entry.conflictStyle}`,
    `盲点：${entry.blindSpot}`,
  ].join('\n');
}

/** ウイング優先 → 純タイプ → デフォルト */
export function getEnneagramInsight(type: string): string {
  const normalized = type.trim();

  if (WING_TYPES[normalized]) {
    return formatTypeInsight(WING_TYPES[normalized]);
  }

  const base = normalized.charAt(0);
  if (BASE_TYPES[base]) {
    return formatTypeInsight(BASE_TYPES[base]);
  }

  return DEFAULT_INSIGHT;
}

/** 文字列 insight が必要な呼び出し向け */
export function getEnneagramInsightEntry(type: string): EnneagramInsightEntry {
  const normalized = type.trim();
  return {
    code: normalized || 'unknown',
    label: normalized || '未分類',
    insight: getEnneagramInsight(normalized),
  };
}

export function getEnneagramTypeEntry(type: string): EnneagramTypeEntry | null {
  const normalized = type.trim();
  if (WING_TYPES[normalized]) {
    return WING_TYPES[normalized];
  }
  if (BASE_TYPES[normalized]) {
    return BASE_TYPES[normalized];
  }
  const base = normalized.charAt(0);
  return BASE_TYPES[base] ?? null;
}
