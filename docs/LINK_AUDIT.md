# 連結與程式驗證報告

檢查日期：2026-07-01

## 結果

| 項目 | 結果 |
|---|---:|
| 正式 HTML | 46 |
| 本機 `href`／`src` 失效 | 0 |
| JavaScript 語法失敗 | 0 |
| 根首頁卡片入口失效 | 0 |
| 正式目錄未引用圖片 | 0 |

檢查時已排除 `.git/` 與所有 `_archive/`，避免舊版本的失效連結干擾正式網站結果。

本次新增 `3mf-explorer/` 後已重新掃描全部 46 份正式 HTML；本機 `href`／`src` 失效為 0。另以瀏覽器確認文章桌面與手機排版、首頁第 015 張卡片及 1200×630 封面圖片。Portable EXE 改用外部雲端分享，不納入本站本機連結檢查。

## 外部依賴概況

網站仍有以下類型的外部連線：

- Google Fonts：多個文章專案使用。
- cdnjs：部分頁面載入外部程式庫。
- AI 服務與官方文件：屬文章內容連結。
- `505kaichen-dev.github.io`：正式站絕對網址。
- 商業網站、GitHub、Notion 與 Google Docs：屬內容引用。

外部網址可能隨時間失效，建議每季人工抽查一次。若網站需要完全離線使用，再另行處理 Google Fonts 與 CDN，不應直接批次刪除。

## 已處理問題

- 舊 `gallery/gallery-index.html` 原有 5 個不存在的 `images/` 路徑，已將整份舊頁移至 `gallery/_archive/`。
- 正式 `gallery/index.html` 沒有失效連結。

## 下次檢查時機

- 新增或搬動專案。
- 更換封面圖片。
- 修改根首頁卡片。
- GitHub Pages 發布前。

## 2026-10-13 Fitment Lab 首頁更新驗證
- 檢查根首頁及 wheel-fitment/index.html 共 46 個本機 href/src：失效 0。
- app.js 語法檢查通過。
- 首頁卡片序號018、Build分類、最新發布自動選中 Fitment Lab；1200×630 PNG封面載入。
- 本次為首頁與新專案範圍驗證，不代表重新掃描全站歷史頁面。
## 2026-11-19 Kai AI Lab 驗證

- 加密首頁解密後的位元內容與 `X:\index.html` 完全一致；10 個子站 payload 均通過 AES-256-GCM 解密與 entry 檢查。
- 共驗證 32 個原始 HTML 都有對應實體 wrapper；密文不含 HTML 明文標記，輸出檔未發現明文分享密碼，且沒有 `.env`、Git、node_modules、安裝檔、壓縮檔、Excel 或私鑰格式。
- Headless Edge 實測錯誤密碼拒絕、正確密碼解鎖，點擊後網址為 `/ai-lab/Storagemaster/index.html`，再進 `part1-hardware.html` 不會二次要求密碼。
- Web Planner 6 張圖片全部成功載入，本機 HTTP 錯誤 0；所有輸出單檔均小於 100 MB。
- 額外模擬一般 HTTP／受限環境無 `crypto.subtle`：node-forge 解密、X 首頁與 Storage Wiki 子頁沿用同一工作階段皆通過。
- 逐一巡覽 X 首頁的 10 個子站入口均成功解密並呈現正確頁面 title；Sprite Player 的 JavaScript 動態 `sprite_sheet.png` 引用已轉為密文 payload 內資產，最終全程站內 HTTP 錯誤 0。
