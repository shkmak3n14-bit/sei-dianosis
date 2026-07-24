// response_engine/types.ts

import type {
  EnneagramBehaviorEntry,
  EnneagramCenterEntry,
  EnneagramInsightEntry,
  EnneagramInstinctEntry,
  EnneagramTypeEntry,
} from '../../data/enneagram';

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
