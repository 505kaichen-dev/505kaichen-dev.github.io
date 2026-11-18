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
<<<<<<< HEAD

## 2026-11-19 Kai AI Lab 驗證

- AI Lab portal＋16 個專案 bundle 解密結構檢查通過；HTML／CSS 相對資產缺檔 0。
- 確認密文檔案不包含 HTML 明文標記，`.env`、Git、runtime、node_modules、安裝檔、壓縮檔、Excel 與私鑰格式均未進入 bundle。
- Headless Edge 157 實際由根首頁進入 `/ai-lab/`；錯誤密碼拒絕、正確密碼解鎖、專案切換、Web Planner 6 張圖片載入及本機 HTTP 錯誤 0。
- 390×844 行動版登入頁 `scrollWidth=390`，無水平溢出；主站 AI Lab 入口與 1440px portal 已目視檢查。
- 額外模擬 NAS HTTP／受限 iframe（`isSecureContext=false`、無 `crypto.subtle`）：node-forge 解密、portal、Kai Awake、Web Planner 6 張圖片與 Storage Wiki 多頁導航皆通過；再回歸安全來源快速路徑亦通過。
=======
>>>>>>> 3acd4c27295cffe1233b37e3f60f1d5d8b7b3dfe
