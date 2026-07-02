# 3MF Explorer

## 專案概要

- 正式入口：`index.html`
- 首頁分類：作品分享（`works`）
- 首頁卡片序號：`015`
- 封面圖片：`image/cover.png`（1200×630）
- 正式版來源：`X:\3mf-explorer\release\3MF-Explorer-2.0.0-Portable.exe`
- 公開下載：`https://1drv.ms/u/c/dda45afff18c6116/IQAa45OSGJskR7FWj24cdEacAaK045AVQtErTIRdHcUzadc?e=dc1WNf`
- 公開版本：`v2.0.0`（EXE SHA-256：`7A1F847247B292A16180605BFB0B205556B30623B0FA3CF63B05EB25FC6B8243`）
- 下載策略：使用 OneDrive 外部分享，不將 EXE 納入網站 Git repository
- 平台：Windows x64
- 公開網址：`https://505kaichen-dev.github.io/3mf-explorer/`

## 文章主題

從 Windows File Explorer 無法可靠顯示 3MF 模型縮圖的真實痛點出發，介紹 3MF Explorer 的開發過程、功能、技術轉折與社群測試方式。

## 圖片

- `image/windows-explorer-problem.png`：使用者提供的 Windows Explorer 真實問題畫面。
- `image/3mf-explorer-library.png`：Portable 正式版實際運作畫面。
- `image/cover.png`：首頁卡片與社群分享封面。

## 發布注意事項

- Portable 免安裝，首次啟動需要解壓，可能稍候數秒。
- 尚未進行程式碼簽章，Windows SmartScreen 可能顯示提醒。
- 模型索引、縮圖、收藏、標籤與筆記均保留在使用者本機。
- 目前不包含自動更新；新版需重新下載。
- v1.1 可顯示 3MF 內嵌的作品名稱、作者、授權、來源連結，並提供五套外觀主題。
- v2.0 加入 3D 預覽、模型庫資料夾樹、單庫／子資料夾篩選、可調整側欄、五段字體與批次收藏。

## 發佈檢查

- 更新 EXE 時，同步更新文章中的版本、檔案大小、SHA-256 與外部雲端分享連結。
- 重新打包後必須實際啟動，確認模型清單與縮圖正常。
- 若調整首頁卡片，需同步更新 `website-maintenance.md`、`docs/PROJECTS.md`、`docs/SITE_MAP.md` 與 `docs/CHANGELOG.md`。
