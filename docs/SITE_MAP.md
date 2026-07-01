# 網站地圖與頁面關係

```text
index.html（作品首頁）
├─ opensource-story/index.html
├─ claude-web-guide/index.html
├─ dradvice01/index.html
├─ localai-image/index.html
│  └─ ai_image_slides.html
├─ ai-guide/index.html
├─ ai-coding-guide/index.html
├─ form-guide/index.html
│  └─ presentation.html
├─ 3dprint-traps/index.html
├─ html5-story/index.html
├─ bopomofo/index.html
│  ├─ chart.html
│  ├─ learn.html
│  └─ game/index.html
│     ├─ listen.html
│     └─ picture.html
├─ kids-math/index.html
│  ├─ learn-counting.html → counting.html
│  ├─ learn-addition.html → addition.html
│  ├─ learn-subtraction.html → subtraction.html
│  ├─ learn-shapes.html → shapes.html
│  └─ learn-mixed.html → mixed.html
├─ storagemaster/index.html
├─ web-planner/index.html
├─ food-spinner/index.html
├─ 3mf-explorer/index.html（Portable EXE 使用外部雲端分享）
└─ gallery/index.html
```

## 全站共用關係

- 根首頁直接引用各專案的封面圖片。
- `gallery/` 的展示圖片來自其他專案，不維護重複圖片副本。
- `bopomofo/` 與 `kids-math/` 各自維護音訊及互動邏輯，不共用執行期檔案。
- 圖片生成規格由根目錄 `image-handoff-spec.md` 統一管理。
- 首頁卡片規則由 `website-maintenance.md` 管理。

## 不屬於導覽的內容

`docs/`、`handoffs/`、`_archive/` 與 `.git/` 都不是公開網站導覽的一部分；其中 `handoffs/`、`_archive/` 已由 Git 忽略。
