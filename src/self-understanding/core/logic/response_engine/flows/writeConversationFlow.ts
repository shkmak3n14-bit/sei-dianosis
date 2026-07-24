// response_engine/flows/writeConversationFlow.ts
// 会話フェーズ：tone（soft / calm / voice）で3通りに切り替え

import { detectTone, type ToneType } from '../tone_detector';
import type { UserEnneagramProfile } from '../types';

export function writeConversationFlow(
  userInput: string,
  _profile: UserEnneagramProfile,
  tone?: ToneType
): string {
  const resolvedTone = tone ?? detectTone(userInput);

  switch (resolvedTone) {
    case 'soft':
      return [
        `そう感じたんだね。まずはそのまま話してくれて大丈夫だよ。`,
        `ちょっと戸惑いがあったのかなって思ったよ。`,
        `どのあたりが一番ひっかかった？`,
      ].join('\n');

    case 'voice':
      return [
        `そっか、そう感じたんだね。話してくれてありがとう。`,
        `その気持ち、まずはそのままでいいんだよ。`,
        `どこが気になったのか、少しだけ教えてほしいな。`,
      ].join('\n');

    case 'calm':
    default:
      return [
        `なるほど、そう感じたんだね。話してくれてありがとう。`,
        `その印象には何か理由がありそうだなって思ったよ。`,
        `まずは気になったところを一つだけ教えてほしいな。`,
      ].join('\n');
  }
}
