import { SAI_PERSONA_PROMPT } from '../../../core/character/sai_persona';
import type { ExampleStoryTemplate } from '../data/exampleStoryWeakness';

export type SaiLlmPromptInput = {
  userQuestion: string;
  exampleStory: ExampleStoryTemplate['exampleStory'];
  userInput: string;
  wingCode?: string;
};

/** 例え話 → ユーザー入力 → LLM へ渡すプロンプトを組み立てる */
export function buildSaiPrompt({
  userQuestion,
  exampleStory,
  userInput,
  wingCode,
}: SaiLlmPromptInput): string {
  const exampleStoryText = [exampleStory.title, ...exampleStory.text].join('\n');
  const diagnosisLine = wingCode
    ? `ユーザーの診断結果: ${wingCode}`
    : 'ユーザーの診断結果: 未指定（一般的な構造で返答）';

  return `${SAI_PERSONA_PROMPT}

---
${diagnosisLine}
---

ユーザーが抽象語を質問しました：
${userQuestion}

抽象語に対する例え話：
${exampleStoryText}

ユーザーの追加説明：
${userInput}

この情報をもとに、
ユーザーの「動機・願望・恐れ・行動パターン」を整理して返答してください。

必要なら、ユーザーが話しやすいように
追加の質問を1つだけ投げかけてください。`;
}
