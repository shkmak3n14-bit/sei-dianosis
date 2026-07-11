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

export type UnderstandingOption = {
  id: string;
  label: string;
};

export type DeepDiveCard = {
  id: string;
  title: string;
  body: string;
};

export type ChatMessage = {
  id: string;
  role: 'character' | 'user';
  text: string;
};

export type SelfUnderstandingMock = {
  resultCard: DiagnosisResultCard;
  characterPeek: CharacterPeek;
  introMessage: string;
  understandingQuestion: string;
  understandingOptions: UnderstandingOption[];
  deepDiveCards: DeepDiveCard[];
  chatMessages: ChatMessage[];
};
