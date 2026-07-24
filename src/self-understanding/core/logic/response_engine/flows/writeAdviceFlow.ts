// response_engine/flows/writeAdviceFlow.ts
// 助言フェーズ：tone（soft / calm / voice）で intro / outro を切り替え

import {
  formatAdviceMessage,
  generateAdvice,
} from '../../advice_engine';
import { toSpeechFriendly } from '../../speech_summarizer';
import { detectTone, type ToneType } from '../tone_detector';
import type { UserEnneagramProfile } from '../types';

export function writeAdviceFlow(
  profile: UserEnneagramProfile,
  userInput: string,
  tone?: ToneType
): string {
  const resolvedTone = tone ?? detectTone(userInput);

  const advice = generateAdvice(profile);
  const longText = formatAdviceMessage(advice);
  const speechText = toSpeechFriendly(longText);

  let intro = '';
  let outro = '';

  switch (resolvedTone) {
    case 'soft':
      intro = `まずは、ゆっくり整理していこうね。今の気持ちのままで大丈夫だよ。`;
      outro = `もし気になるところがあれば、遠慮なく言ってね。一緒に少しずつ見ていこう。`;
      break;

    case 'voice':
      intro = `じゃあ、ここは少しだけまとめて話すね。聞きやすいように短くするよ。`;
      outro = `続きが気になったら、また話してね。ゆっくりでいいよ。`;
      break;

    case 'calm':
    default:
      intro = `じゃあ、ここからは少し構造的に整理してみるね。`;
      outro = `気になった部分があれば、そこから深めていこう。`;
      break;
  }

  return [intro, speechText, outro].join('\n\n');
}
