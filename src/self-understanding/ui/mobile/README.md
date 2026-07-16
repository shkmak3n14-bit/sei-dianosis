# 自己理解モジュール — モバイルUI

Expo + React Native + TypeScript + React Native Paper

## 画面フロー

1. `ResultCardsScreen` — 診断結果カード（入口）
2. `ChatScreen` — 自由入力（下部サイ吹き出しから遷移）
3. （以降）カテゴリ判定 → テンプレート返答 / 専門家モード（予定）

関連画面: `CategoryItems` / `AskSaiTemplates` / `DeepDiveCards` / `AbstractWordExample`

データは `mocks/` のダミー。後で `core` と接続します。

## 起動

```bash
cd src/self-understanding/ui/mobile
npm start
```

## 構成

```
mobile/
├── screens/          # 5画面
├── cards/            # 結果・深掘りカード
├── character_view/   # キャラ表示・吹き出し
├── chat/             # チャット吹き出し
├── components/       # 共通UI
├── flow/             # ナビゲーション
└── mocks/            # ダミーデータ
```
