# 505kaichen-dev Web Server

這是 `505kaichen-dev.github.io` 的靜態網站工作區，同時也是內網測試版本的根目錄。

## 主要入口

- 網站首頁：`index.html`
- 維護手冊：`website-maintenance.md`
- 圖片移交規範：`image-handoff-spec.md`
- 專案總表：`docs/PROJECTS.md`
- 網站地圖：`docs/SITE_MAP.md`
- 整理規則：`docs/FILE_ORGANIZATION.md`
- 封存紀錄：`docs/ARCHIVE_LOG.md`
- 驗證報告：`docs/LINK_AUDIT.md`

## 資料夾分類

- 正式專案：各自位於根目錄的獨立資料夾，入口通常是 `index.html`。
- `docs/`：全站管理與維護文件。
- `handoffs/`：交給圖片或語音工具的本機移交資料；由 `.gitignore` 排除。
- `_archive/`：已確認不屬於正式部署內容、但暫不刪除的本機封存；由 `.gitignore` 排除。

## 基本原則

1. 新專案必須有 `index.html`、`PROJECT.md`，以及清楚命名的 `image/`。
2. 正式入口檔固定使用 `index.html`；歷史版本放入 `_archive/versions/`。
3. 不使用 `DEL`、`OLD`、`複製` 作為正式檔名。
4. 圖片、語音或 TTS 移交資料集中放在 `handoffs/` 或專案內明確命名的文件。
5. 搬動正式檔案後必須重新執行站內連結檢查。
6. `.git/` 是版本歷史，不是網站素材，不應手動整理或刪除。
7. 非公開工具不放在本 GitHub Pages 工作區；`edgetts.html` 與 `AI Prompt/` 已移出。

最後整理：2026-06-28
