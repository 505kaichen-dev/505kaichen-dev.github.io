# 檔案與資料夾整理規範

## 正式專案標準

```text
project-name/
├─ index.html
├─ PROJECT.md
├─ image/
│  └─ cover.png
├─ audio/                 # 有語音時才建立
├─ scripts/               # 有外部 JS 或資料時才建立
└─ _archive/              # 舊版本與停用素材
```

## 命名規則

- 資料夾與程式檔優先使用小寫英文及連字號。
- 正式入口固定為 `index.html`。
- 封面圖固定為 `image/cover.png`，規格 1200×630。
- 歷史版本不得留在專案根目錄，移至 `_archive/versions/`。
- 停用圖片不得以 `DEL`、`OLD` 留在 `image/`，移至 `_archive/image/`。
- 工作副本不得使用「複製」作為長期檔名。

## 文件分工

- `README.md`：工作區入口與最重要規則。
- `website-maintenance.md`：首頁卡片、分類與發布流程。
- `PROJECT.md`：單一專案的入口、子頁面與特殊注意事項。
- `docs/ARCHIVE_LOG.md`：搬入封存區的原因與原路徑。
- 專案交接文件：保留詳細開發歷程，例如 kids-math 與 bopomofo。

## 封存與刪除

1. 先搜尋 HTML、CSS、JS 與 Markdown 是否引用。
2. 無引用且明確為舊版時，先移至同專案 `_archive/`。
3. 至少經過一次人工檢查後才刪除。
4. 搬動後重新檢查全部本機 `href` 與 `src`。
5. 不整理 `.git/` 內部檔案。

## 不建議的做法

- 不把不同專案的圖片集中到同一個共用 `image/`。
- 不直接刪除尚未確認來源的 PNG、HTML 或 ZIP。
- 不同專案不要共用相對路徑很深的執行期資源。
- 不以資料夾名稱判斷能否刪除，必須先查引用。
