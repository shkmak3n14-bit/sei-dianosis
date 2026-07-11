import type { SelfUnderstandingMock } from './types';

/** UI確認用のダミーデータ。後で core / diagnosis_engine と接続する。 */
export const selfUnderstandingMock: SelfUnderstandingMock = {
  resultCard: {
    typeLabel: 'タイプ1',
    wingCode: '1w9',
    personalityTitle: 'あなたの性格',
    highlights: [
      {
        id: 'trait',
        label: 'こういう性格です',
        body: '正しさと穏やかさを大切にし、場を整えながら品質を上げようとする傾向があります。',
      },
      {
        id: 'moment',
        label: 'こういう時があります',
        body: '基準が守られない場面では、表面は落ち着いていても内側で緊張や自己批判が強まりやすいです。',
      },
      {
        id: 'help',
        label: 'こういう対応が助かります',
        body: '責めずに一緒に整える姿勢、小さな改善案を受け止めてくれる関わり方が安心につながります。',
      },
    ],
  },
  characterPeek: {
    name: 'サイ',
    bubbleText: '気になるところ、ある？',
  },
  characterIntro: {
    name: 'サイ',
    bubbleText: 'この結果、ちょっと難しかった？',
    ctaLabel: '気になる部分を選ぶ',
  },
  understandingCheck: {
    characterName: 'サイ',
    bubbleText: 'どの部分を詳しく知りたい？',
    options: [
      { id: 'traits', label: '性格の特徴' },
      { id: 'behavior', label: '行動パターン' },
      { id: 'stress', label: 'ストレス時の反応' },
      { id: 'difference', label: '他タイプとの違い' },
      { id: 'misread', label: '誤解されやすいポイント' },
    ],
  },
  deepDive: {
    characterName: 'サイ',
    bubbleText: 'これ、あなたの経験と近い？',
    cards: [
      {
        id: 'traits',
        title: '性格の特徴',
        bullets: [
          'あなたは正しさと穏やかさを両立しようとする傾向があります',
          '理由は、場を乱さずに品質を守りたいという価値観が強いからです',
        ],
      },
      {
        id: 'behavior',
        title: '行動パターン',
        bullets: [
          '基準が曖昧な場面では、まず整えてから動こうとします',
          '対立を長引かせず、静かに改善案を出すことが多いです',
        ],
      },
      {
        id: 'stress',
        title: 'ストレス時の反応',
        bullets: [
          'ストレスがかかると表では冷静でも、内側で自己批判が強まりやすくなります',
          '発言が減り、細部へのこだわりが増えることがあります',
        ],
      },
    ],
  },
  chatFlow: {
    characterName: 'サイ',
    steps: [
      {
        id: 'similarity',
        prompt: 'この説明、あなたの経験と似てる？',
        inputMode: 'choice',
        choices: [
          { id: 'yes', label: 'はい' },
          { id: 'no', label: 'いいえ' },
          { id: 'unsure', label: 'どちらとも言えない' },
        ],
      },
      {
        id: 'recent',
        prompt: '最近こういう場面あった？',
        inputMode: 'choiceOrText',
        choices: [
          { id: 'work', label: '仕事であった' },
          { id: 'home', label: '家であった' },
          { id: 'other', label: '別の場面だった' },
        ],
      },
      {
        id: 'feeling',
        prompt: 'その時どう感じた？',
        inputMode: 'text',
      },
      {
        id: 'more',
        prompt: 'その感覚、もう少し話してみる？',
        inputMode: 'choice',
        choices: [
          { id: 'continue', label: 'もう少し話す' },
          { id: 'pause', label: 'いったんここまで' },
        ],
      },
    ],
    completedMessage:
      'ありがとう。今日の手がかりはここまでにしておこう。また続きを話したくなったら戻ってきてね。',
  },
};
