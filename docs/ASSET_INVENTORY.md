# 素材與容量盤點

盤點日期：2026-07-01

## 容量

| 區域 | 檔案數 | 容量 |
|---|---:|---:|
| Git 可公開內容（不含 `.git`、`_archive`、`handoffs`） | 468 | 約 88.9 MB |
| 本機 `_archive` | 26 | 約 25.9 MB |
| `.git` 版本歷史 | 約 1,349 | 約 121.9 MB |

`.git` 容量不會直接成為 GitHub Pages 網頁內容，但會影響工作區備份大小。

## 主要檔案類型

- PNG：54 個，約 77.8 MB，是網站圖片的主要容量來源。
- MP3：注音與數學遊戲語音。
- HTML：46 個正式頁面。
- SVG／JSON：注音筆順與描字資料。
- WAV：兩個親子專案的短回饋音效。

## 圖片狀態

- 正式目錄中的圖片均能找到 HTML、CSS、JS 或 Markdown 的檔名引用。
- `DEL`、`OLD`、未引用 CHART／IMAGE 工作稿已移至各專案 `_archive/image/`。
- 完全重複的 AI Prompt PNG 保留一份正式範例，另一份移入封存。

## 大圖建議

多個專案使用 1.5～3 MB PNG。現階段數量仍可管理；若行動網路載入成為問題，可逐專案轉為 WebP，但應先做視覺比較與路徑更新，不建議一次批次轉換全站。

## 軟體下載

- 3MF Explorer v1.1.0 Windows Portable 分享 ZIP 為 80,396,550 bytes（約 76.7 MiB）。
- EXE 不納入網站 Git repository；公開下載改用 OneDrive 或 Google Drive 外部分享連結。
- 網站只保存版本、大小、SHA-256 與分享網址。更新版本時應同步替換外部檔案與文章資訊。

## 音訊狀態

- `bopomofo/`：37 份符號 MP3、25 份遊戲引導／例詞 MP3、7 份回饋 WAV。
- `kids-math/`：教學與題目語音、7 份回饋 WAV。
- TTS 與圖片移交原始表格保留在專案或 `handoffs/`，便於重製。
