import { buildPromptWithPersona, type SaiPersonaOptions } from '../character/sai_persona';

export type CallLlmOptions = SaiPersonaOptions & {
  /** false のとき人格プロンプトを付与しない（既定: true） */
  includePersona?: boolean;
};

/**
 * LLM 呼び出しラッパー。
 * 既定でサイの人格プロンプトを先頭に付与する。
 * 実API未接続時はモック文字列を返す。
 */
export async function callLLM(prompt: string, options: CallLlmOptions = {}): Promise<string> {
  const { includePersona = true, wingCode } = options;
  const fullPrompt =
    includePersona === false ? prompt : buildPromptWithPersona(prompt, { wingCode });

  try {
    return await fetchLlmReply(fullPrompt);
  } catch {
    return buildMockLlmReply(fullPrompt);
  }
}

async function fetchLlmReply(prompt: string): Promise<string> {
  const endpoint = process.env.EXPO_PUBLIC_SAI_LLM_ENDPOINT;

  if (!endpoint) {
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

function buildMockLlmReply(prompt: string): string {
  // psycho_extractor 向け: JSON パース可能なモックを返す
  if (prompt.includes('fear') && prompt.includes('desire') && prompt.includes('JSON')) {
    return JSON.stringify({
      fear: '対立や否定で関係が崩れること',
      desire: '穏やかさと主導権の両立',
      motive: '場の安定を保ちながら自分の境界を守りたい',
      action: '表では合わせつつ、線を越えられると急に強くなる',
    });
  }

  // detectToneLLM 向け
  if (prompt.includes('感情トーン') && prompt.includes('"tone"')) {
    const speechMatch = prompt.match(/ユーザー発話:\s*([\s\S]*)$/);
    const speech = (speechMatch?.[1] ?? '').toLowerCase();
    if (
      /わからない|分からない|違う|モヤモヤ|不安|どうしたら/.test(speech)
    ) {
      return JSON.stringify({ tone: 'soft' });
    }
    if (/うーん|そうなんだよね|ちょっと/.test(speech)) {
      return JSON.stringify({ tone: 'voice' });
    }
    if (/なるほど|気になった|整理|もう少し/.test(speech)) {
      return JSON.stringify({ tone: 'calm' });
    }
    return JSON.stringify({ tone: 'calm' });
  }

  // detectPhaseLLM 向け
  if (prompt.includes('会話フェーズ') && prompt.includes('"phase"')) {
    const speechMatch = prompt.match(/ユーザー発話:\s*([\s\S]*)$/);
    const speech = (speechMatch?.[1] ?? '').toLowerCase();
    if (
      /どうすれば|改善|成長|ストレス|仕事|特徴|理由|傾向|構造|深く知りたい|自分は|いつも|こうなる|タイプ的|ストレスの時|職場で|人間関係で/.test(
        speech
      )
    ) {
      return JSON.stringify({ phase: 'advice' });
    }
    if (
      /分からない|わからない|どういうこと|もっと知りたい|具体的|説明して|なぜ|なんで/.test(
        speech
      )
    ) {
      return JSON.stringify({ phase: 'deepening' });
    }
    return JSON.stringify({ phase: 'conversation' });
  }

  return '（モック返答）LLMエンドポイント未設定のため、仮の返答を返しています。';
}
