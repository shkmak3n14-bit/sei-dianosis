// response_router.ts

import {
  buildResponsePlan,
  buildUserEnneagramProfile,
  type UserEnneagramProfile,
} from './response_engine';

/**
 * 多段対話対応版 response_router
 *
 * 返すのは「未文章化のステップ名（steps）」と人格モデル context。
 * 文章化は useChatFlow 側で writeResponse(step, context, userInput) を使って行う。
 */
export function routeResponse(
  userInput: string,
  userProfile?: UserEnneagramProfile | string
) {
  const profile =
    typeof userProfile === 'string' || userProfile === undefined
      ? buildUserEnneagramProfile(userProfile ?? '9w8')
      : userProfile;

  // ① response_engine で返答の設計図を取得
  const result = buildResponsePlan(userInput, profile);
  const { type, label, flow, context } = result;

  // ② flow は未文章化のステップ名の配列として返す
  return {
    type, // 例: "selfConflict"
    label, // 例: "自己矛盾の整理"
    steps: flow, // ← 文章化しない
    context, // center / type / wing / behavior / instinct
  };
}
