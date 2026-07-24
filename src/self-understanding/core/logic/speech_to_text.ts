// speech_to_text.ts
// 音声 → テキスト（STT）ラッパー

export type SpeechAudioInput = Blob | string;

/**
 * 音声（Blob またはローカル URI）をテキストに変換する。
 * EXPO_PUBLIC_SAI_STT_ENDPOINT が未設定の場合はエラー。
 */
export async function speechToText(audio: SpeechAudioInput): Promise<string> {
  const endpoint = process.env.EXPO_PUBLIC_SAI_STT_ENDPOINT;
  if (!endpoint) {
    throw new Error('SAI_STT_ENDPOINT_NOT_SET');
  }

  const body = buildRequestBody(audio);

  const response = await fetch(endpoint, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error(`SAI_STT_HTTP_${response.status}`);
  }

  const data = (await response.json()) as { text?: string };
  return data.text ?? '';
}

function buildRequestBody(audio: SpeechAudioInput): BodyInit {
  if (typeof audio !== 'string') {
    return audio;
  }

  // React Native / Expo: URI を FormData で送る
  const formData = new FormData();
  formData.append('file', {
    uri: audio,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as unknown as Blob);
  return formData;
}
