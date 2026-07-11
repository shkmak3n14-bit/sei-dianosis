# 自己理解モジュール — モバイルUI

Expo + React Native + TypeScript + React Native Paper

## 画面フロー（4画面＋1チャット）

1. `ResultCardsScreen` — 診断結果カード（入口）
2. `CharacterIntroScreen` — キャラ登場（下から半画面スライドイン）
3. `UnderstandingCheckScreen` — 理解度チェック（トピック選択）
4. `DeepDiveCardsScreen` — 深掘りカード（分割表示＋下部吹き出し）
5. `ChatScreen` — キャラチャット（本体）

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
