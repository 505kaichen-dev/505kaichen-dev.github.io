# 網站地圖與頁面關係

```text
index.html（Kai AI Workshop 首頁）
├─ ai-lab/index.html（Kai AI Lab 分享密碼入口）
│  ├─ 3mf-explorer/index.html
│  ├─ KMPage/index.html
│  ├─ knowledge-crawler-v2-web/index.html
│  ├─ network-inventory/index.html
│  ├─ projectforfun/ibm-kb-report.html
│  ├─ Storagemaster/index.html（含原有多頁路徑）
│  ├─ tts-studio/index.html（含原有多頁路徑）
│  ├─ web-planner-public/index.html
│  ├─ web-planner/index.html
│  └─ webgame/sprite_player.html
├─ kids/index.html（Kids Lab 入口）
│  ├─ → bopomofo/index.html
│  └─ → kids-math/index.html
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
├─ fortigate-ipv6-hinet/index.html
├─ downloader/index.html（個人使用 Windows Portable 軟體介紹與開發故事）
├─ Tone-lab/index.html（Guitar Tone Lab 電吉他音色工程學）
├─ wheel-fitment/index.html（Fitment Lab 輪胎輪圈改裝計算器）
└─ gallery/index.html
```

## 完成、尚未加入公開導覽

```text
episode-01/index.html（主篇：一位工程師，與 AI 協作的日常）
└─ extra.html（番外篇：一個人，和一支看不見的團隊）
```

這些頁面目前可由本機路徑直接預覽，但根首頁沒有入口。作者確認公開前，不加入上方正式網站樹。

## 全站共用關係

- 根首頁直接引用各專案的封面圖片。
- `ai-lab/` 是獨立加密展示空間，只由根首頁提供單一入口，不參與作品卡片排序；上述路徑是解密 wrapper，原始內容封裝在各資料夾密文 payload，不以明文存在 W 公開目錄。
- `kids/` 只負責兒童專案導覽，既有專案網址不搬動。
- `gallery/` 的展示圖片來自其他專案，不維護重複圖片副本。
- `bopomofo/` 與 `kids-math/` 各自維護音訊及互動邏輯，不共用執行期檔案。
- 圖片生成規格由根目錄 `image-handoff-spec.md` 統一管理。
- 首頁卡片規則由 `website-maintenance.md` 管理。

## 不屬於導覽的內容

`docs/`、`handoffs/`、`_archive/` 與 `.git/` 都不是公開網站導覽的一部分；其中 `handoffs/`、`_archive/` 已由 Git 忽略。
