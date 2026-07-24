// respond.ts
// チャット（テキスト）入力用の入口

import { generateResponse } from './response_engine/generate';
import type { UserEnneagramProfile } from './response_engine/types';

/**
 * テキスト入力を受け取り、generateResponse に渡す。
 */
export async function respond(
  userInput: string,
  profile: UserEnneagramProfile
) {
  return generateResponse(userInput, profile);
}
