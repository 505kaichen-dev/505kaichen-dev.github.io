# 全站整理紀錄

## 2026-09-11

- 新增 `downloader/index.html` 長頁〈Downloader：我只想貼一個網址，剩下的交給它〉，整理單頁影片／圖片解析、下載佇列、獨立登入與可換主題介面。
- 使用 0.1.0-beta.7 紫晶航線實際畫面、原創角色與水晶品牌素材，製作 1200×630 首頁封面及文章視覺。
- 將 `downloader/` 加入首頁第 017 張卡片，分類為 Build／Windows 軟體；下一個正式首頁序號為 018。
- 作者確認 Portable 成品可公開供個人、非商業使用；文章新增版本、容量、SHA-256 與等待狀態下載按鈕，外部雲端分享連結稍後補入，原始碼仍不公開。
- Downloader Hero、首頁卡片與下載區新增「免費、無廣告」主張，強調本機工具不以廣告頁面或多個假下載按鈕干擾使用者。
- Downloader 開場補入社群二創與搞笑迷因的實際用途，並新增一張原創三格漫畫，以帶點諷刺的口吻呈現廣告、假下載按鈕與 99% 解析失敗的使用煩惱。

## 2026-07-07

- 新增 `fortigate-ipv6-hinet/index.html` 圖文長頁〈FortiGate 60F + HiNet PPPoE IPv6 全紀錄〉，整理 FortiGate 60F / FortiOS 7.2.13 / 中華電信 PPPoE IPv6 的基礎概念、實作步驟與三個實際除錯點。
- 製作頁面專用視覺素材：`image/hero.png`、`image/clarity.png`，並由 hero 圖裁切 `image/cover.png` 作為 1200×630 首頁封面候選。
- 將 `fortigate-ipv6-hinet/` 加入首頁第 016 張卡片，分類為 Explore／自造日誌；下一個正式首頁序號為 017。

## 2026-07-05

- 完成 `episode-01/index.html` 長篇敘事頁〈原來，我不是在跟 AI 聊天〉，以一般讀者與家人能理解的方式描述工程師的 AI 協作日常。
- 完成 `episode-01/extra.html` 番外篇〈一個人，和一支看不見的團隊〉，補充傳統團隊規模估算、獨立創作者的能力放大，以及 AI 協作仍需保留的專業與責任。
- 兩頁皆為無外部依賴的 HTML、CSS、Vanilla JavaScript，已檢查 Desktop、Tablet、Mobile 響應式版面。
- 專案狀態為完成、待決定是否公開；尚未製作首頁封面、尚未加入首頁卡片，也未占用序號 016。

## 2026-07-02

- 3MF Explorer 正式發布 v2.0.0；網站下載改為 OneDrive 正式版 EXE，並更新檔案大小與 SHA-256。
- 正式版加入 3D 預覽、資料夾樹與篩選、可調側欄、五段字體、批次收藏、主題配色與關於視窗；重掃與排序回歸測試通過。
- 3MF Explorer 公開測試版更新至 v2.0.0 Beta；文章新增版本更新紀錄、3D 預覽、模型庫資料夾樹與可調側欄說明。
- OneDrive 下載更新為 2.0 Beta Portable ZIP，同步更新檔案大小與 ZIP SHA-256。

## 2026-07-01

- 3MF Explorer 公開測試版更新至 v1.1.0，OneDrive 下載改為 Windows Portable ZIP，並同步更新 ZIP SHA-256。
- 3MF Explorer 文章補入作者、作品來源、授權資訊與五套外觀主題等 v1.1 功能。
- 將原本 8 張圖片的平面相簿重做為 `Visual Archive`，策展收錄 46 件跨專案視覺作品。
- 新增 Kids Lab、視覺敘事、介面工具、品牌封面四間展間，以及精選篩選、瀑布流作品牆與專案導向燈箱。
- 為 Visual Archive 製作專屬首頁圖卡，移除舊有四張縮圖拼貼。
- 首頁正式更新為 `Kai AI Workshop`，改用精簡品牌開場與 Explore、Build、Gallery 分類。
- 新增 `kids/` 兒童子站入口；注音樂園與數學樂園保留原網址並移入獨立 Kids Lab 分區。
- 卡片補上技術故事、AI 實戰、網頁工具、Windows 軟體等內容形式標籤。
- 同步更新專案總表、網站地圖、首頁維護規範與改版紀錄。
- 新增 `3mf-explorer/` 圖文文章，說明從 Windows 3MF 縮圖痛點到 Portable 應用程式的開發過程。
- 加入 Windows File Explorer 問題畫面、3MF Explorer 正式版畫面與 1200×630 首頁封面。
- 接上 Windows x64 Portable 測試版 OneDrive 公開分享連結，並標示未簽章提醒、版本資訊與 SHA-256；EXE 不納入網站 Git repository。
- 新增首頁第 015 張作品分享卡片，更新專案總表、網站地圖與維護手冊。

## 2026-06-28

- 建立根目錄 `README.md`。
- 建立 `docs/` 管理中心：專案總表、網站地圖、整理規範、封存紀錄、驗證報告、素材盤點與部署檢查表。
- 為 12 個正式專案建立 `PROJECT.md`。
- 建立 `handoffs/`，集中原本散落於根目錄與 `files/` 的圖片移交 TXT。
- 整理 39 個檔案：5 份移交資料集中至 `handoffs/`，34 個舊版本、重複頁面、停用圖片、ZIP 與工作稿移入 `_archive/`。
- 移除已清空的 `files/`、`kids-math/tempfile/` 資料夾。
- 保留所有封存內容，沒有永久刪除檔案。
- 正式網站驗證：0 個本機斷鏈、0 個 JavaScript 語法錯誤、0 張未引用正式圖片。
- 確認 `edgetts.html` 與 `AI Prompt/` 是已轉移工具的舊殘留，從公開同步根目錄移除。
- 新增 `.gitignore`，排除本機 `_archive/`、`handoffs/` 與 Windows 系統檔。
