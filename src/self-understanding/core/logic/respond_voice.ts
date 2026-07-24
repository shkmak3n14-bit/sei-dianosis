// respond_voice.ts
// 音声入力専用の入口

import { generateResponse } from './response_engine/generate';
import type { UserEnneagramProfile } from './response_engine/types';
import { speechToText, type SpeechAudioInput } from './speech_to_text';

/**
 * 音声を受け取り、テキスト化 → generateResponse まで一気に行う。
 * audio は Blob（Web）またはローカル URI（Expo）を受け付ける。
 */
export async function respondVoiceInput(
  audio: SpeechAudioInput,
  profile: UserEnneagramProfile
) {
  // ① 音声 → テキスト化
  const userInput = await speechToText(audio);

  // ② generateResponse に渡す（フェーズ判定＋トーン判定）
  const { text, phase } = await generateResponse(userInput, profile);

  return { text, phase, userInput };
}
