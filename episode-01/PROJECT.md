# Episode 01 — 原來，我不是在跟 AI 聊天

## 專案概要

- 狀態：完成／待決定是否公開
- 類型：Explore／人物敘事／AI 工作方式
- 主篇入口：`index.html`
- 番外篇入口：`extra.html`
- 首頁卡片：尚未建立
- 首頁序號：尚未占用；若公開，使用當時下一個可用序號
- 外部依賴：無
- 建立年份：2026

## 頁面主題

### 主篇：`index.html`

**一位工程師，與 AI 協作的日常**

寫給非工程師也能理解的序章。從家人看見作者深夜與 AI 對話的日常開始，說明 AI 並未替人思考，而是接下重複工作，讓工程師重新把時間放回思考、創造、設計與分享。

IBM Knowledge Base 與 3MF Explorer 只作為工作方式產生成果的兩個案例，不是文章主角。

### 番外篇：`extra.html`

**一個人，和一支看不見的團隊**

攤開產品企劃、研究、架構、開發、設計、測試、維運與文件等角色，解釋 AI 對獨立創作者的真正價值，以及速度提升後仍不能省略的專業、判斷與責任。

頁面中的傳統人日、工期與成本皆為「製作規模估算」，不是報價，也不代表實際支出或已實現的節省。

## 設計與技術

- 單檔 HTML、CSS、Vanilla JavaScript。
- 不使用 Framework、Bootstrap、CDN、外部字型或外部圖片。
- 視覺使用暖白、米色、柔和藍綠與低彩度深綠。
- 內建閱讀進度、Scroll Reveal 與 `prefers-reduced-motion` 支援。
- 響應式支援 Desktop、Tablet、Mobile。
- 主篇與番外篇各自可獨立閱讀，不依賴另一頁載入。

## 內容依據

- `X:\KMPage\scripts\ibm-kb\docs\PROJECT_RECORD.md`
- `X:\KMPage\scripts\ibm-kb\docs\DEVELOPMENT_PROGRESS.md`
- `X:\3mf-explorer\DEV_NOTES.md`
- `X:\AI Software Factory\AI Multi-Agent Orchestration Proposal v2.md`
- `W:\3mf-explorer\index.html`

上述 X 槽資料只作內容研究，不是公開網站的執行期依賴。

## 維護規則

- 修改主篇核心故事時，同步檢查番外篇是否有相同概念或數字。
- IBM Knowledge Base 測試數、3MF 模型數若要更新，先回原專案確認；不要自行推算。
- 成本估算若調整，必須保留「非報價、非實際節省」聲明，並同步修改估算假設。
- 新增外部素材前，先確認授權與公開範圍；目前版本不需要任何外部素材。
- 每次修改後至少檢查 1280px、768px、390px 三種寬度、橫向溢位與瀏覽器錯誤。

## 公開發布清單

目前不要執行以下項目，等作者確認公開後再做：

1. 決定首頁要以主篇單一卡片呈現，或將番外篇作為補充頁。
2. 製作 `image/cover.png`（1200×630）。
3. 在根目錄 `index.html` 新增 Explore 卡片與當時下一個 `data-order`。
4. 將本專案從 `docs/PROJECTS.md` 的待發布區移至正式發布區。
5. 更新 `website-maintenance.md` 卡片序號表、`docs/SITE_MAP.md` 與 `docs/CHANGELOG.md`。
6. 檢查公開內容是否含內部路徑、敏感資訊或不適合公開的專案細節。
7. 完成全站本機連結檢查後才推送 GitHub Pages。

## 已完成檢查

- Desktop 1280px：無橫向溢位、無瀏覽器警告或錯誤。
- Tablet 768px：無橫向溢位。
- Mobile 390px：無橫向溢位，Hero 與結尾維持一屏高度。
- HTML 內無外部 HTTP／HTTPS 執行期資源。
