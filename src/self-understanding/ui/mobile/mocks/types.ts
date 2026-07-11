/** 自己理解モジュール（モバイルUI）の共通型。後で core と接続する。 */

export type WingCode = string;

export type PersonalityHighlight = {
  id: string;
  label: string;
  body: string;
};

export type DiagnosisResultCard = {
  typeLabel: string;
  wingCode: WingCode;
  personalityTitle: string;
  highlights: PersonalityHighlight[];
};

export type CharacterPeek = {
  name: string;
  bubbleText: string;
};

/** キャラ登場画面（導入）用 */
export type CharacterIntro = {
  name: string;
  /** 例: 「この結果、ちょっと難しかった？」 */
  bubbleText: string;
  /** 例: 「気になる部分を選ぶ」 */
  ctaLabel: string;
};

export type UnderstandingOption = {
  id: string;
  label: string;
};

/** 理解度チェック画面用 */
export type UnderstandingCheck = {
  characterName: string;
  /** 例: 「どの部分を詳しく知りたい？」 */
  bubbleText: string;
  options: UnderstandingOption[];
};

export type DeepDiveCard = {
  id: string;
  title: string;
  /** カード内の箇条書き */
  bullets: string[];
};

/** 深掘りカード画面用 */
export type DeepDiveScreen = {
  characterName: string;
  /** 例: 「これ、あなたの経験と近い？」 */
  bubbleText: string;
  cards: DeepDiveCard[];
};

export type ChatMessage = {
  id: string;
  role: 'character' | 'user';
  text: string;
};

export type SelfUnderstandingMock = {
  resultCard: DiagnosisResultCard;
  characterPeek: CharacterPeek;
  characterIntro: CharacterIntro;
  understandingCheck: UnderstandingCheck;
  deepDive: DeepDiveScreen;
  chatMessages: ChatMessage[];
};
