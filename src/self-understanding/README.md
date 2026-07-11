# self-understanding（自己理解モジュール）

タイプ診断結果を踏まえた自己理解を担当する Context です。
**スマホ利用を前提**とし、ロジック（`core`）とモバイルUI（`ui/mobile`）を分離しています。

## 役割

- 自己のパターン・動機の深掘り
- タイプ診断結果との連携（読み取りのみ）
- キャラクター／チャット形式での自己理解フロー

## 構成

```
self-understanding/
├── core/                 # ドメインロジック（UI非依存）→ 詳細は core/README.md
│   ├── logic/
│   ├── data/
│   ├── character/
│   ├── questions/
│   └── diagnosis_engine/
└── ui/
    └── mobile/           # スマホ向けUI（実装先行）
        ├── components/
        ├── cards/
        ├── chat/
        ├── character_view/
        └── flow/
```

## 実装順序

1. **UI 先行**（`ui/mobile/`）
2. Core は責務定義を先に記録し、後から実装（`core/README.md`）

## 制約

- このブランチ（`feature/self-understanding`）では本 Context 配下のみを実装する
- 他 Context（`type-engine` 等）のファイルは変更しない
