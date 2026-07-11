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
├── core/                 # ドメインロジック（UI非依存）
│   ├── logic/            # 判定・進行ロジック
│   ├── data/             # 静的データ・設定
│   ├── character/        # キャラクター定義・振る舞い
│   ├── questions/        # 自己理解用の設問
│   └── diagnosis_engine/ # 診断エンジン連携・結果解釈
└── ui/
    └── mobile/           # スマホ向けUI
        ├── components/   # 汎用UI部品
        ├── cards/        # カード表示
        ├── chat/         # チャットUI
        ├── character_view/ # キャラクター表示
        └── flow/         # 画面フロー・遷移
```

## 制約

- このブランチ（`feature/self-understanding`）では本 Context 配下のみを実装する
- 他 Context（`type-engine` 等）のファイルは変更しない
