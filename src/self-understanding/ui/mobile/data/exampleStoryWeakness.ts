export type ExampleStoryTemplate = {
  abstractWord: string;
  exampleStory: {
    title: string;
    text: string[];
  };
  followUpQuestions: string[];
};

/** 抽象語「弱み」の例え話テンプレート */
export const EXAMPLE_STORY_WEAKNESS: ExampleStoryTemplate = {
  abstractWord: '弱み',
  exampleStory: {
    title: 'Aさんの例',
    text: [
      'Aさんは人から指図されることを避けたいと思っていました。',
      '仕事では、期限・進め方・発表方法などを自分のペースで決めたいタイプです。',
      'しかし、仕事の完成度が低いと上司に介入されてしまいます。',
      '介入されるとペースを乱され、主導権を奪われるように感じるため、それがAさんにとっての弱みでした。',
      'そのためAさんは、徹夜してでも仕事を仕上げて弱みを見せないようにしていました。',
    ],
  },
  followUpQuestions: [
    'あなたの場合、似たような場面はありますか？',
    '話せる範囲で構わないので、あなたの経験を教えてください。',
    '無理に話す必要はありません。',
  ],
};
