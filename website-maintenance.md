# 505kaichen-dev.github.io 網站維護手冊

你是 505kaichen-dev.github.io 的網站維護助理。
這是一個純靜態網站，托管於 GitHub Pages。

---

## 網站結構

根目錄下每個子頁面為獨立資料夾，結構如下：

```
/資料夾名稱/
  index.html       ← 子頁面
  image/
    cover.png      ← 封面圖（統一規格 1200×630）
```

完整專案清單、網站地圖與封存規則請見：

- `README.md`
- `docs/PROJECTS.md`
- `docs/SITE_MAP.md`
- `docs/FILE_ORGANIZATION.md`
- `docs/ARCHIVE_LOG.md`

---

## 首頁設計系統

- 檔案：`/index.html`
- 色彩：`--bg: #F8F9FC` / `--blue: #2563EB` / `--ink: #0D0F14`
- 字型：Space Grotesk（標題）/ Inter（內文）
- 最大寬度：1280px
- 響應式斷點：900px / 600px

---

## 分類系統

| 分類名稱 | data-category | 說明 |
|---------|--------------|------|
| 隨筆雜談 | story | 敘事、歷史、野史、有趣的故事 |
| 自造日誌 | diy | 3D列印、改裝、硬體、動手做 |
| 作品分享 | works | 設計、開發、實作成果 |
| AI 指南 | ai-guide | AI 工具教學、指南 |
| 親子學習 | kids | 兒童學習工具、注音、數學等互動頁面 |
| 創作圖集 | gallery | AI 生成圖像創作集 |

---

## 卡片規範

```html
<a class="work-card reveal"
   href="./資料夾名稱/"
   data-category="分類"
   data-card-id="資料夾名稱"
   data-order="001"
   data-password="密碼（需要時才加）">
  <div class="card-thumb">
    <img src="./資料夾名稱/image/cover.png" alt="標題">
    <span class="card-tag">分類中文名</span>
  </div>
  <div class="card-body">
    <div class="card-title">標題</div>
    <div class="card-desc">描述</div>
  </div>
  <div class="card-footer">
    <div class="card-arrow">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
           stroke="currentColor" stroke-width="1.5">
        <path d="M2 6h8M6 2l4 4-4 4"/>
      </svg>
    </div>
  </div>
</a>
```

---

## data-order 規則

- 三碼數字，`001` 最舊，號碼越大越新
- 每次新增卡片給下一個序號
- gallery 和 placeholder 不需要 `data-order`

---

## 卡片序號對照表

<!-- CARD_LIST_START -->
| 序號 | data-card-id | 標題 | 分類 | 備註 |
|------|-------------|------|------|------|
| 001 | opensource-story | 開源運動的誕生 | story | |
| 002 | claude-web-guide | Claude 網頁開發指南 | ai-guide | |
| 003 | dradvice01 | 健康力益生菌品牌落地頁 | works | 密碼保護 |
| 004 | localai-image | LocalAI Image 本地 AI 圖像介面 | ai-guide | |
| 005 | ai-guide | AI 宇宙指南 | ai-guide | |
| 006 | ai-coding-guide | AI 寫程式工具指南 | ai-guide | |
| 007 | form-guide | 讓你的網頁會收資料 | ai-guide | |
| 008 | 3dprint-traps | FDM 入坑指南 | diy | |
| 009 | html5-story | HTML5 的故事與創作可能性 | story | |
| 010 | bopomofo | ㄅㄆㄇ 注音學習小站 | kids | |
| 011 | kids-math | 數學樂園 | kids | |
| 012 | storagemaster | Storage Master — 企業儲存技術知識庫 | works | |
<!-- CARD_LIST_END -->

---

## 首頁邏輯（不要動）

- **最新發布區**：JS 自動抓 `data-order` 最大值，不受 Tab 篩選影響
- **卡片網格**：預設新到舊排列，gallery / placeholder 沉底
- **管理模式與密碼保護** JS 邏輯
- **Hero 區、About 區、Footer** 文案與結構

---

## 新增卡片 SOP

1. 判讀子頁面標題、描述、主題風格
2. 對照分類系統，決定 `data-category`
3. 給下一個 `data-order` 序號（目前最新為 012，下一張為 013）
4. 將新卡片插入 `work-grid`（順序不影響顯示，JS 自動排序）
5. **更新本文件** 的卡片序號對照表
6. 輸出完整更新的 `index.html`

---

## 封面圖規範

- 規格：1200×630 px，PNG
- 路徑：`./資料夾名稱/image/cover.png`
- gallery 卡片內的預覽拼貼圖維持 `height: 100px`，不套 aspect-ratio

---

## 維護紀錄

| 日期 | 項目 | 說明 |
|------|------|------|
| 2026-06-30 | 新增 Storage Master | 加入企業儲存技術知識庫專案、首頁第 012 張卡片與 1200×630 封面圖 |
| 2026-06-28 | CSS Bug 修復 | `@media (max-width: 900px)` 區塊括號錯誤，6 條手機版樣式跑到媒體查詢外，導致桌面版也套用手機排版（padding、單欄 About 等），已修正移回媒體查詢內 |
| 2026-06-28 | card-tag 修正 | bopomofo（010）與 kids-math（011）的 card-tag 由「互動工具」/「互動遊戲」改為「親子學習」，符合分類系統規範 |
| 2026-06-28 | 全站結構整理 | 建立 docs、handoffs、PROJECT.md 與可逆 `_archive`；正式頁驗證為 0 個本機斷鏈 |

---

## 更新本文件的時機

每次執行以下操作後，必須同步更新本文件：

- 新增卡片 → 更新卡片序號對照表，更新「下一張序號」提示
- 新增分類 → 更新分類系統表格
- 修改首頁邏輯 → 更新對應說明段落
- 修改卡片規範 → 更新卡片規範區塊
