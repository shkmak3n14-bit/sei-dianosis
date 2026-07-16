import type { ExampleStoryTemplate } from '../data/exampleStoryWeakness';

export type SaiLlmPromptInput = {
  userQuestion: string;
  exampleStory: ExampleStoryTemplate['exampleStory'];
  userInput: string;
};

/** 例え話 → ユーザー入力 → LLM へ渡すプロンプトを組み立てる */
export function buildSaiPrompt({
  userQuestion,
  exampleStory,
  userInput,
}: SaiLlmPromptInput): string {
  const exampleStoryText = [
    exampleStory.title,
    ...exampleStory.text,
  ].join('\n');

  return `あなたは「SIE診断AIサイ」です。

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
