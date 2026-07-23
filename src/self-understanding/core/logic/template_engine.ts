import templates from './response_templates.json';

type ResponseTemplate = {
  type: string;
  label: string;
  flow: string[];
};

/** 専門家モード用テンプレート */
export const FALLBACK_EXPERT_TEMPLATE: ResponseTemplate = {
  type: 'fallbackExpert',
  label: '専門家モード',
  flow: [
    'ユーザーの質問を専門家として受け止める',
    '問題の背景を構造的に説明する',
    '専門的な観点から核心を提示する',
    'タイプ論・心理構造の観点から分析する',
    'ユーザーの状況に当てはめて具体化する',
    '改善の方向性・理解のポイントを示す',
    '必要なら追加質問を提示する',
  ],
};

/** 対人関係の悩み用テンプレート */
export const RELATIONSHIP_ISSUE_TEMPLATE: ResponseTemplate = {
  type: 'relationshipIssue',
  label: '対人関係の悩み',
  flow: [
    '悩みを受け止める',
    '状況の構造を明確化する',
    '相手の心理構造を推測する',
    '自分側の心理構造を整理する',
    '関係性の相互作用を分析する',
    '改善の方向性を提示する',
    '具体的な行動案を示す',
    '追加の状況確認を行う',
  ],
};

/** 自己矛盾の整理用テンプレート */
export const SELF_CONFLICT_TEMPLATE: ResponseTemplate = {
  type: 'selfConflict',
  label: '自己矛盾の整理',
  flow: [
    '矛盾を受け止める',
    '矛盾の表層を明確化する',
    '矛盾の深層構造を特定する',
    'タイプ固有の葛藤ポイントを説明する',
    '矛盾の両側にある動機を言語化する',
    '衝突している認知パターンを整理する',
    '感情の流れを構造化する',
    '行動パターンへの影響を説明する',
    '統合の方向性を提示する',
    '追加の深掘り質問を提示する',
  ],
};

/** ストレス時の行動パターン用テンプレート */
export const STRESS_PATTERN_TEMPLATE: ResponseTemplate = {
  type: 'stressPattern',
  label: 'ストレス時の行動パターン',
  flow: [
    'ストレスの訴えを受け止める',
    'ストレスの入力源を特定する',
    '認知の歪みや自動反応を確認する',
    '感情の流れを把握する',
    '行動パターンの変化を特定する',
    'タイプ固有のストレス反応を説明する',
    '悪循環のループを構造化する',
    'ループを断ち切るポイントを提示する',
    '具体的な対処案を示す',
    '追加の状況確認を行う',
  ],
};

export function getTemplateByType(type: string): ResponseTemplate | undefined {
  if (type === 'fallbackExpert') {
    return FALLBACK_EXPERT_TEMPLATE;
  }

  if (type === 'relationshipIssue') {
    return RELATIONSHIP_ISSUE_TEMPLATE;
  }

  if (type === 'selfConflict') {
    return SELF_CONFLICT_TEMPLATE;
  }

  // classification 側の stressChange も同一テンプレートへ
  if (type === 'stressPattern' || type === 'stressChange') {
    return STRESS_PATTERN_TEMPLATE;
  }

  return (templates.responseTemplates as ResponseTemplate[]).find((t) => t.type === type);
}

/** 多段対話対応版 response_engine 向け。必ずテンプレートを返す */
export function getTemplate(type: string): ResponseTemplate {
  return getTemplateByType(type) ?? FALLBACK_EXPERT_TEMPLATE;
}
