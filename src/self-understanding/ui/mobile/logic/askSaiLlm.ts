import { buildSaiPrompt, type SaiLlmPromptInput } from './buildSaiPrompt';

export type SaiLlmRequest = SaiLlmPromptInput;

export type SaiLlmResponse = {
  prompt: string;
  reply: string;
};

/**
 * LLM 呼び出し。
 * 実API未接続時はモック返答を返す。
 * 接続時は `fetchSaiLlmReply` 内の fetch 先を差し替える。
 */
export async function askSaiLlm(input: SaiLlmRequest): Promise<SaiLlmResponse> {
  const prompt = buildSaiPrompt(input);

  try {
    const reply = await fetchSaiLlmReply(prompt);
    return { prompt, reply };
  } catch {
    return {
      prompt,
      reply: buildMockSaiReply(input),
    };
  }
}

async function fetchSaiLlmReply(prompt: string): Promise<string> {
  const endpoint = process.env.EXPO_PUBLIC_SAI_LLM_ENDPOINT;

  if (!endpoint) {
    // API未設定: モックへフォールバック
    throw new Error('SAI_LLM_ENDPOINT_NOT_SET');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`SAI_LLM_HTTP_${response.status}`);
  }

  const data = (await response.json()) as { reply?: string; text?: string };
  const reply = data.reply ?? data.text;

  if (!reply?.trim()) {
    throw new Error('SAI_LLM_EMPTY_REPLY');
  }

  return reply.trim();
}

function buildMockSaiReply(input: SaiLlmRequest): string {
  const word = input.userQuestion.trim() || 'その言葉';
  const note = input.userInput.trim()
    ? `あなたが書いてくれた「${input.userInput.trim()}」からも、似た緊張が感じられます。`
    : 'いまは言葉にしにくくても大丈夫です。';

  return [
    `「${word}」について整理すると、こう見えます。`,
    '',
    '・動機：自分のペースや主導権を守りたい',
    '・願望：指図されず、自分で進め方を決めたい',
    '・恐れ：介入されてペースを乱され、主導権を奪われること',
    '・行動パターン：弱みを見せないよう、完成度を上げて先回りする',
    '',
    note,
    '',
    '似た場面で、いちばんつらかったのは「介入された瞬間」と「仕上げるまでの緊張」のどちらに近いですか？',
  ].join('\n');
}
