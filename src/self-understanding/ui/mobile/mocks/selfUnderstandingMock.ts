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
  deepDiveCards: [
    {
      id: 'values',
      title: '大切にしていること',
      body: '誠実さ、秩序、調和。雑さや不公平さには敏感になりやすいです。',
    },
    {
      id: 'stress',
      title: 'ストレス時の反応',
      body: '表では冷静でも、内側で自己批判と不満が溜まり、発言が減ることがあります。',
    },
    {
      id: 'misread',
      title: '誤解されやすいポイント',
      body: '融通が利かない・厳しい、と見られやすい一方で、本当は場を守りたい気持ちが強いです。',
    },
  ],
  chatMessages: [
    {
      id: 'm1',
      role: 'character',
      text: 'さっきのカードで、気になったところはある？短くで大丈夫だよ。',
    },
    {
      id: 'm2',
      role: 'user',
      text: '「こういう時があります」が一番近い気がする。',
    },
    {
      id: 'm3',
      role: 'character',
      text: 'なるほど。その「時」って、最近だとどんな場面だった？',
    },
  ],
};
