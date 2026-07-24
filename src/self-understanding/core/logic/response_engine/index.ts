// response_engine/index.ts
// フェーズ判定 → 会話継続 / 深掘り / advice_engine への振り分け

export type {
  GeneratedResponse,
  ResponsePersonaContext,
  UserEnneagramProfile,
} from './types';
export type { ConversationPhase } from './phase_detector';
export { detectPhase } from './phase_detector';
export { detectPhaseLLM } from './phase/detectPhaseLLM';
export type { ToneType } from './tone_detector';
export { detectTone } from './tone_detector';
export { detectToneLLM } from './tone/detectToneLLM';
export { PHASE_KEYWORDS } from './phase_keywords';
export {
  buildResponsePlan,
  buildUserEnneagramProfile,
  generateResponse,
  type GenerateResponseResult,
} from './generate';

/** @deprecated generateResponse を使ってください */
export { generateResponse as respond } from './generate';
