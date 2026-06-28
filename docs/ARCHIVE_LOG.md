# 封存紀錄

封存只代表「不屬於目前正式入口」，不是永久刪除。需要復原時，依下表移回原路徑。

## 2026-06-28

### 舊頁面與重複頁面

- `claude-web-guide/claude-html-guide-v1.html` → `claude-web-guide/_archive/versions/`
- `claude-web-guide/claude-html-guide-v2.html` → `claude-web-guide/_archive/versions/`
- `claude-web-guide/claude-html-guide-v3.html` → `claude-web-guide/_archive/versions/`；內容與正式 `index.html` 相同
- `dradvice01/probiotic-landing.html` → `dradvice01/_archive/`；內容與正式 `index.html` 相同
- `form-guide/index - 複製.html` → `form-guide/_archive/index-copy.html`
- `gallery/gallery-index.html` → `gallery/_archive/`；舊頁包含 5 個失效圖片路徑

### 停用圖片

- `ai-guide/image/DELai-guide.png`、`OLD-ai-guide.png` → `ai-guide/_archive/image/`
- `claude-web-guide/image/DELclaude-web-guide.png` → `claude-web-guide/_archive/image/`
- `form-guide/image/DELcover.png` → `form-guide/_archive/image/`
- `localai-image/image/DELLocalAI_Image.png` → `localai-image/_archive/image/`
- `opensource-story/image/DELopensource-story.png` → `opensource-story/_archive/image/`

### ZIP 與殘留檔

- 根目錄 `files.zip` → `_archive/root-backups/image-handoffs.zip`
- `kids-math/files.zip` → `kids-math/_archive/backups/game-pages.zip`
- `kids-math/tempfile/files.zip` → `kids-math/_archive/backups/working-pages.zip`
- `html5-story/html5-html`（2-byte 殘留檔）→ `html5-story/_archive/html5-html.remnant`

### 工作流程資料

- 根目錄及 `files/` 的圖片移交 TXT → `handoffs/`
- `AI Prompt/` 的 v2.0～v2.4 歷史提示詞 → `AI Prompt/_archive/versions/`
- AI Prompt 中完全重複的 UUID 圖片 → `AI Prompt/_archive/duplicates/`
- `AI Prompt/Thumbs.db` → `AI Prompt/_archive/system/`

後續確認 `AI Prompt/` 與根目錄 `edgetts.html` 均已轉移至其他工作位置，因此整體從 GitHub Pages 公開同步根目錄移除；原始追蹤內容仍可由 Git 歷史復原。

### 無正式引用的工作稿

- `dradvice01/d437c27f-...png` → `dradvice01/_archive/image/d437c27f-source.png`
- `form-guide/image/form-guide.png` → `form-guide/_archive/image/`
- `localai-image/image/CHART01.png`、`CHART02.png`、`LocalAI_Image (2).png` → `localai-image/_archive/image/`
- `opensource-story/image/CHART.png`、`IMAGE.png`、`opensource-story (2).png` → `opensource-story/_archive/image/`
- `opensource-story/opensource-story.html` → `opensource-story/_archive/versions/`

以上檔案在 HTML、CSS、JS 與 Markdown 中均找不到檔名引用，因此移出正式部署結構。

本輪沒有永久刪除任何內容。
