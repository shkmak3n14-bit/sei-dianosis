// response_engine/generate.ts

import {
  BASE_TYPES,
  CENTER_INSIGHTS,
  WING_TYPES,
  getEnneagramBehaviorEntry,
  getEnneagramInsightEntry,
  getEnneagramInstinctEntry,
} from '../../data/enneagram';
import { classify } from '../classifier';
import { getTemplate } from '../template_engine';
import { writeAdviceFlow } from './flows/writeAdviceFlow';
import { writeConversationFlow } from './flows/writeConversationFlow';
import { writeDeepeningFlow } from './flows/writeDeepeningFlow';
import type { ConversationPhase } from './phase_detector';
import { detectPhaseLLM } from './phase/detectPhaseLLM';
import { detectToneLLM } from './tone/detectToneLLM';
import type {
  GeneratedResponse,
  UserEnneagramProfile,
} from './types';

export type GenerateResponseResult = {
  text: string;
  phase: ConversationPhase;
};

/**
 * response_engine のメイン処理。
 * フェーズ・トーンを LLM で判定し、各 flow へ振り分ける。
 */
export async function generateResponse(
  userInput: string,
  profile: UserEnneagramProfile
): Promise<GenerateResponseResult> {
  const phase = await detectPhaseLLM(userInput);
  const tone = await detectToneLLM(userInput);

  let text: string;
  switch (phase) {
    case 'conversation':
      text = writeConversationFlow(userInput, profile, tone);
      break;

    case 'deepening':
      text = writeDeepeningFlow(userInput, profile, tone);
      break;

    case 'advice':
      text = writeAdviceFlow(profile, userInput, tone);
      break;

    default:
      text = writeConversationFlow(userInput, profile, tone);
      break;
  }

  return { text, phase };
}

/**
 * 多段テンプレート用の設計図（type / flow / persona context）。
 * 文章化はしない。
 */
export function buildResponsePlan(
  userInput: string,
  userProfile: UserEnneagramProfile
): GeneratedResponse {
  const type = classify(userInput);
  const template = getTemplate(type);

  const center = CENTER_INSIGHTS[userProfile.center];
  const baseType = BASE_TYPES[userProfile.type];
  const wing = userProfile.wing ? (WING_TYPES[userProfile.wing] ?? null) : null;
  const behavior = getEnneagramBehaviorEntry(userProfile.type);
  const instinct = userProfile.instinct
    ? getEnneagramInstinctEntry(userProfile.instinct)
    : null;

  const insightKey = userProfile.wing || userProfile.type;
  const persona = wing ?? baseType ?? null;

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
