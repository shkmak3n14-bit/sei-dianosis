// psycho_followup.ts
import type { PsychoStructure } from './psycho_extractor';

export function generateFollowUp(structure: PsychoStructure): string | null {
  if (!structure.fear) {
    return 'その状況で、あなたが一番避けたいこと（恐れ）は何ですか？';
  }
  if (!structure.desire) {
    return 'あなたはその状況で、どうありたいと望んでいますか？';
  }
  if (!structure.motive) {
    return 'その行動の根っこにある動機は何だと思いますか？';
  }
  if (!structure.action) {
    return 'その恐れや願望を満たすために、どんな行動を選びがちですか？';
  }

  return null; // 全部揃っている
}
