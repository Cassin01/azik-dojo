# AZIK Dojo

AZIK配列のローマ字入力を練習するためのタイピングアプリケーション。

## Features

- **AZIK対応**: 標準ローマ字とAZIK拡張入力の両方に対応
- **リアルタイム統計**: WPM（Words Per Minute）と正確性をリアルタイムで表示
- **ローマ字ヒント**: ミスタイプ時にローマ字のヒントを表示
- **セッション履歴**: 練習結果をローカルに保存し、過去の成績を確認可能
- **ベスト/平均スコア**: 過去のベストWPMと平均スコアを表示

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## About AZIK

[AZIK](http://hp.vector.co.jp/authors/VA002116/azik/azikinfo.htm)は、日本語ローマ字入力の拡張配列です。標準的なローマ字入力と完全な互換性を保ちながら、頻出する音を少ないキーストロークで入力できます。

### AZIK入力例

| ひらがな | 標準ローマ字 | AZIK |
|---------|-------------|------|
| しょ | sho | so |
| ちょ | cho | co |
| じょ | jo | zo |
| しゃ | sha | xa |
| ちゃ | cha | ca |
| じゃ | ja | za |
| しゅ | shu | xu |
| ちゅ | chu | cu |
| じゅ | ju | zu |
| ん | nn | q |
| ー | - | - |

## License

MIT
