// psycho_extractor.ts
import { callLLM } from '../llm/llm_client';

export type PsychoStructure = {
  fear: string | null;
  desire: string | null;
  motive: string | null;
  action: string | null;
};

export type ExtractPsychoOptions = {
  wingCode?: string;
};

export async function extractPsychoStructure(
  userInput: string,
  options: ExtractPsychoOptions = {}
): Promise<PsychoStructure> {
  const prompt = `
【今回のタスク】
ユーザーの文章から以下の4つを抽出してください。

1. fear（恐れ）
2. desire（願望）
3. motive（動機）
4. action（行動パターン）

必ず JSON のみで返してください。例:
{"fear":"...","desire":"...","motive":"...","action":"..."}
抽出できない項目は null にしてください。

ユーザーの文章：
${userInput}
`;

  const response = await callLLM(prompt, { wingCode: options.wingCode });

  try {
    const json = JSON.parse(response);
    return {
      fear: json.fear ?? null,
      desire: json.desire ?? null,
      motive: json.motive ?? null,
      action: json.action ?? null,
    };
  } catch {
    return {
      fear: null,
      desire: null,
      motive: null,
      action: null,
    };
  }
}
