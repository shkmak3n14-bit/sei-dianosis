# sie-dianosis（サイ / S.I.E.）

Support Intelligence on EGO — エニアグラムを用いた理解支援プロダクト。

## Context と Branch

| 概念 | 意味 | 例 |
|------|------|-----|
| **Context** | 役割分離のためのフォルダ構成 | `src/type-engine/` |
| **Branch** | Git 上の作業単位 | `feature/type-engine` |

両者は別概念です。マージ時も Context（フォルダ）は混ぜず維持します。

## モジュール構成

| Context（フォルダ） | Branch | 役割 |
|---------------------|--------|------|
| `src/type-engine/` | `feature/type-engine` | タイプ診断 |
| `src/self-understanding/` | `feature/self-understanding` | 自己理解 |
| `src/other-understanding/` | `feature/other-understanding` | 他者理解 |
| `src/relationship/` | `feature/relationship` | 相互理解 |

各ブランチでは対応する Context のみを実装し、他モジュールのコードには触れません。
最終的に 4 ブランチを `main` へマージして統合します。
