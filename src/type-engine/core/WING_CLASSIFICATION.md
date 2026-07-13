# ウイング内部分類（フェーズ1）

画面表示は従来どおり。判定後に `sessionStorage`（`sieWingState.classification`）へ保存する。

## 読み取り（自己理解モジュール）

```js
import { loadWingClassificationForSelfUnderstanding } from "../type-engine/core/wingBridge.js";

const c = loadWingClassificationForSelfUnderstanding();
// c.classification / c.profileKey / c.strengthBand など
```

## ルール要約

| 項目 | 内容 |
|------|------|
| 強度 | 1位と2位の一致度差 ÷ 100 |
| 近い | 差が 5% 未満 → `○w弱（ほぼ無し）` |
| ほぼ無し | 0.00〜0.05 |
| 弱 | 0.06〜0.25 |
| 中 | 0.26〜0.60 |
| 強 | 0.61〜1.00 |

## profileKey（説明文選択・フェーズ2で使用）

- 強・中 → `9w8` / `9w1` など（`appendStrengthNote: true`）
- 弱・ほぼ無し → `9-flat` など（説明文変更なし）
