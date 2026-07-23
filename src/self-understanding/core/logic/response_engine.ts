// response_engine.ts

import {
  BASE_TYPES,
  CENTER_INSIGHTS,
  WING_TYPES,
  getEnneagramBehaviorEntry,
  getEnneagramInsightEntry,
  getEnneagramInstinctEntry,
  type EnneagramBehaviorEntry,
  type EnneagramCenterEntry,
  type EnneagramInsightEntry,
  type EnneagramInstinctEntry,
  type EnneagramTypeEntry,
} from '../data/enneagram';
import { classify } from './classifier';
import { getTemplate } from './template_engine';

/** 診断結果から渡すユーザーのエニアグラムプロファイル */
export type UserEnneagramProfile = {
  /** Gut / Heart / Head */
  center: 'Gut' | 'Heart' | 'Head';
  /** 純タイプ（例: "9"） */
  type: string;
  /** ウイング（例: "9w8"）。なければ null */
  wing?: string | null;
  /** 本能（sp / so / sx）。なければ null */
  instinct?: string | null;
};

export type ResponsePersonaContext = {
  /** テンプレートのラベル（例: 自己矛盾の整理） */
  label: string;
  /** 表示用タイプコード（例: 9w8） */
  typeLabel: string;
  /** flow 種別（writeResponse のルーティング用） */
  flowType: string;
  center: EnneagramCenterEntry | undefined;
  baseType: EnneagramTypeEntry | undefined;
  wing: EnneagramTypeEntry | null;
  /** wing 優先のタイプ辞書（文章化の主参照） */
  persona: EnneagramTypeEntry | null;
  behavior: EnneagramBehaviorEntry | null;
  instinct: EnneagramInstinctEntry | null;
  insight: EnneagramInsightEntry;
};

export type GeneratedResponse = {
  type: string;
  label: string;
  flow: string[];
  context: ResponsePersonaContext;
};

/**
 * 多段対話対応版 response_engine
 *
 * - ユーザー入力を分類する
 * - 該当テンプレートの flow（ステップ名）を返す
 * - 人格モデル辞書（center / type / wing / behavior / instinct）を付与
 * - 文章化はしない（useChatFlow / response_writer が行う）
 */
export function generateResponse(
  userInput: string,
  userProfile: UserEnneagramProfile
): GeneratedResponse {
  // ① 分類
  const type = classify(userInput);

  // ② テンプレート取得
  const template = getTemplate(type);

  // ③ 人格モデル辞書の読み込み
  const center = CENTER_INSIGHTS[userProfile.center];
  const baseType = BASE_TYPES[userProfile.type];
  const wing = userProfile.wing ? (WING_TYPES[userProfile.wing] ?? null) : null;
  const behavior = getEnneagramBehaviorEntry(userProfile.type);
  const instinct = userProfile.instinct
    ? getEnneagramInstinctEntry(userProfile.instinct)
    : null;

  const insightKey = userProfile.wing || userProfile.type;
  const persona = wing ?? baseType ?? null;

  // ④ flow に人格モデルを渡す（response_writer が使う）
  return {
    type: template.type,
    label: template.label,
    flow: template.flow,
    context: {
      label: template.label,
      typeLabel: insightKey,
      flowType: template.type,
      center,
      baseType,
      wing,
      persona,
      behavior,
      instinct,
      insight: getEnneagramInsightEntry(insightKey),
    },
  };
}

/** wingCode（例: 9w8）からプロファイルを組み立てる */
export function buildUserEnneagramProfile(
  wingCode: string,
  instinct?: string | null
): UserEnneagramProfile {
  const normalized = wingCode.trim();
  const base = normalized.charAt(0);

  return {
    center: resolveCenter(base),
    type: base,
    wing: normalized.includes('w') ? normalized : null,
    instinct: instinct ?? null,
  };
}

function resolveCenter(typeNum: string): 'Gut' | 'Heart' | 'Head' {
  if (typeNum === '8' || typeNum === '9' || typeNum === '1') {
    return 'Gut';
  }
  if (typeNum === '2' || typeNum === '3' || typeNum === '4') {
    return 'Heart';
  }
  return 'Head';
}
