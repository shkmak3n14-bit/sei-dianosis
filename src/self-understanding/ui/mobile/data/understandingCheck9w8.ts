import { ENNEA_CARD_9W8 } from './enneaCard9w8';

export type UnderstandingQuestionTemplate = {
  id: string;
  label: string;
  text: string;
};

export type UnderstandingCheckItem = {
  id: string;
  label: string;
  body: string;
  questionTemplates: UnderstandingQuestionTemplate[];
};

export type UnderstandingCheckCategory = {
  id: string;
  title: string;
  items: UnderstandingCheckItem[];
};

export type UnderstandingCheckData = {
  categories: UnderstandingCheckCategory[];
};

function bodyOf(sectionId: string): string {
  return ENNEA_CARD_9W8.sections.find((section) => section.id === sectionId)?.body ?? '';
}

function templates(
  entries: Array<[string, string, string]>
): UnderstandingQuestionTemplate[] {
  return entries.map(([id, label, text]) => ({ id, label, text }));
}

/** カテゴリ → 項目 → 質問テンプレート（9w8） */
export const UNDERSTANDING_CHECK_9W8: UnderstandingCheckData = {
  categories: [
    {
      id: 'result',
      title: '診断結果について',
      items: [
        {
          id: 'wing_judgment',
          label: '🧭 あなたのウイング判定',
          body: bodyOf('wing_judgment'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '私のウイング判定（9w8・強度中）は、普段の自分とどこが一致していますか？'],
            ['q2', 'こう聞くと深堀できる', '「8の影響が明確」とは、具体的にどんな場面で表れやすいですか？'],
            ['q3', 'こう聞くと納得しやすい', 'この判定結果を、一言で自分に説明するならどう言えますか？'],
            ['q4', 'こう聞くと誤解が減る', 'この結果で誤解しやすい点はどこですか？'],
          ]),
        },
        {
          id: 'overview',
          label: '🌿 タイプ9w8の全体像',
          body: bodyOf('overview'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '9w8の「静かな強さ」は、私のどの行動に一番近いですか？'],
            ['q2', 'こう聞くと深堀できる', '柔らかさと踏ん張りが切り替わる瞬間を、どう見分けられますか？'],
            ['q3', 'こう聞くと自分ごとになる', 'この全体像のうち、いちばん「自分だ」と感じる一文はどれですか？'],
            ['q4', 'こう聞くと比較できる', '9w1と比べたとき、私にはなぜ9w8の説明が合いやすいですか？'],
          ]),
        },
        {
          id: 'consistency',
          label: '🧩 タイプ9との整合性',
          body: bodyOf('consistency'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', 'タイプ9（1位）と9w8は、どうつながって説明できますか？'],
            ['q2', 'こう聞くと深堀できる', '9の平和性と8の境界線は、私の中でどう役割分担していますか？'],
            ['q3', 'こう聞くと安心できる', 'この整合性の説明で「診断がぶれていない」と感じるポイントはどこですか？'],
          ]),
        },
      ],
    },
    {
      id: 'traits_daily',
      title: 'あなたの特徴・日常・大切なこと・反応',
      items: [
        {
          id: 'traits',
          label: '1️⃣ 特徴',
          body: bodyOf('traits'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', 'この特徴のうち、職場と私生活で特に強く出るものはどれですか？'],
            ['q2', 'こう聞くと深堀できる', '「ここだけは無理」が出やすいテーマを一緒に言語化できますか？'],
            ['q3', 'こう聞くと具体例になる', '最近のエピソードで、この特徴がいちばん表れた場面はどれですか？'],
            ['q4', 'こう聞くと気づきが増える', 'この特徴が強みになる時と負担になる時の違いは何ですか？'],
          ]),
        },
        {
          id: 'daily',
          label: '2️⃣ 日常での現れ方',
          body: bodyOf('daily'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '日常で「平和的で柔らかい自分」がいちばん出る時間帯や場面はどこですか？'],
            ['q2', 'こう聞くと深堀できる', '身内を守る反応が出た最近の例を、どう振り返ればよいですか？'],
            ['q3', 'こう聞くと関係が整理される', '大切な人との関係で、この現れ方が誤解されやすい点は何ですか？'],
          ]),
        },
        {
          id: 'values',
          label: '3️⃣ 大切にしているもの',
          body: bodyOf('values'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '安心・ペース・境界線のうち、いまいちばん守りたいものはどれですか？'],
            ['q2', 'こう聞くと深堀できる', '「揉めたくない」と「踏み込まれたくない」が同時に起きる時、私は何を優先していますか？'],
            ['q3', 'こう聞くと決断しやすい', 'この価値観を相手に伝えるなら、短い一文でどう言えますか？'],
            ['q4', 'こう聞くと優先順位が付く', 'この大切にしているものが満たされないと、どんな不調として出やすいですか？'],
          ]),
        },
        {
          id: 'triggers',
          label: '4️⃣ 強く反応しやすい場面',
          body: bodyOf('triggers'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '強い反応が出やすいトリガーを、私の言葉で3つ挙げると何ですか？'],
            ['q2', 'こう聞くと深堀できる', '穏やかさから強い反応へ切り替わる直前の身体感覚は何ですか？'],
            ['q3', 'こう聞くと予防につながる', '反応が出る前に一呼吸置くために、何を合図にすればよいですか？'],
            ['q4', 'こう聞くと関係修復できる', '強く出たあと、相手と自分の両方に必要なフォローは何ですか？'],
          ]),
        },
      ],
    },
    {
      id: 'growth',
      title: '好循環・成長・学び',
      items: [
        {
          id: 'good_cycle',
          label: '5️⃣ 好循環に必要なこと',
          body: bodyOf('good_cycle'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '今の生活で、好循環の条件がいちばん欠けているのはどれですか？'],
            ['q2', 'こう聞くと深堀できる', '「嫌だ」と言える余白を増やすために、最初の一歩は何が現実的ですか？'],
            ['q3', 'こう聞くと実践しやすい', '今週だけ試せる、ペースを守る小さな習慣は何ですか？'],
          ]),
        },
        {
          id: 'learning_partner',
          label: '6️⃣ 学びの相手',
          body: bodyOf('learning_partner'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '私にとって良い学び相手の条件を、優先順位つきで整理できますか？'],
            ['q2', 'こう聞くと深堀できる', '「強いが乱暴ではない人」と「圧をかけてくる人」の見分け方は何ですか？'],
            ['q3', 'こう聞くと行動につながる', '身近な人の中で、学び相手に近い人は誰で、どう距離を取ると良いですか？'],
          ]),
        },
        {
          id: 'growth_partner',
          label: '7️⃣ 成長のきっかけ',
          body: bodyOf('growth_partner'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '成長のきっかけになる関わり方と、ただ押しつけられる関わり方の差は何ですか？'],
            ['q2', 'こう聞くと深堀できる', '「あなたはどうしたい？」と聞かれた時、答えやすくなる準備は何ですか？'],
            ['q3', 'こう聞くと選びやすい', '今の私に足りない刺激は、決断・前進・自己認識のどれですか？'],
            ['q4', 'こう聞くと関係づくりに使える', '成長を促してほしい人に、どう頼む一文が自然ですか？'],
          ]),
        },
      ],
    },
    {
      id: 'challenges',
      title: '課題・悪循環',
      items: [
        {
          id: 'bad_cycle_entry',
          label: '8️⃣ 悪循環の入口',
          body: bodyOf('bad_cycle_entry'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '私の悪循環は、先送り・我慢・蓄積のどこから始まりやすいですか？'],
            ['q2', 'こう聞くと深堀できる', '限界で急に強くなる直前に、見落としがちなサインは何ですか？'],
            ['q3', 'こう聞くと予防できる', '入口に入らないための「最初のブレーキ」を1つ決めるなら何ですか？'],
            ['q4', 'こう聞くと振り返りやすい', '最近の悪循環エピソードを、入口→蓄積→爆発で分解できますか？'],
          ]),
        },
        {
          id: 'warning_signs',
          label: '9️⃣ 危ないかものチェックポイント',
          body: bodyOf('warning_signs'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', '今の自分に当てはまるチェックポイントはどれですか？'],
            ['q2', 'こう聞くと深堀できる', '「どうでもいい」が増える時、本当は何を避けていますか？'],
            ['q3', 'こう聞くと早めに戻れる', 'イエローサインが出たら、最初にやる小さな立て直しは何ですか？'],
          ]),
        },
      ],
    },
    {
      id: 'recovery',
      title: '立て直し',
      items: [
        {
          id: 'recovery_method',
          label: '🔟 悪循環から立て直す方法',
          body: bodyOf('recovery'),
          questionTemplates: templates([
            ['q1', 'こう聞くと精度が上がる', 'いま必要な立て直しは、「認める」「止める」「伝える」のどれですか？'],
            ['q2', 'こう聞くと深堀できる', '境界線を早めに言葉にする練習として、最初の言い回しを作れますか？'],
            ['q3', 'こう聞くと実践しやすい', '今日できる最小の立て直し行動を1つ選ぶなら何ですか？'],
            ['q4', 'こう聞くと習慣化できる', '「自分を守ったうえで穏やかでいる」状態を、どう日次チェックしますか？'],
            ['q5', 'こう聞くと再発防止になる', 'また同じ入口に入った時の、自分用リカバリー手順を作れますか？'],
          ]),
        },
      ],
    },
  ],
};

export function findUnderstandingCategory(
  categoryId: string,
  data: UnderstandingCheckData = UNDERSTANDING_CHECK_9W8
) {
  return data.categories.find((category) => category.id === categoryId) ?? null;
}

export function findUnderstandingItem(
  categoryId: string,
  itemId: string,
  data: UnderstandingCheckData = UNDERSTANDING_CHECK_9W8
) {
  const category = findUnderstandingCategory(categoryId, data);
  return category?.items.find((item) => item.id === itemId) ?? null;
}
