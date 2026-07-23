/** チャット入力UIの種類 */
export type ChatInputMode = 'choice' | 'choiceOrText' | 'text' | 'none';

export type ChatChoice = {
  id: string;
  label: string;
};

export type ChatMessage = {
  id: string;
  role: 'character' | 'user';
  text: string;
};

/** 1ターン分の深掘りステップ（後で core/logic の分岐に接続） */
export type ChatStep = {
  id: string;
  prompt: string;
  inputMode: ChatInputMode;
  choices?: ChatChoice[];
};

export type ChatFlow = {
  characterName: string;
  steps: ChatStep[];
  /** 全ステップ完了後の締めメッセージ */
  completedMessage: string;
};
