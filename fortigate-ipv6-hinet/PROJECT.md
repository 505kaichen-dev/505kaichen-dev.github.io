# FortiGate 60F + HiNet PPPoE IPv6 全紀錄

## 狀態

- 建立日期：2026-07-07
- 狀態：已加入首頁公開卡片
- 入口：`index.html`
- 封面：`image/cover.png`
- 首頁卡片：`data-order="016"`

## 內容定位

這是一篇 IPv6 實作與除錯學習筆記，整理 FortiGate 60F（FortiOS 7.2.13）在中華電信 PPPoE 環境下的原始探索與後續實測補正。不是通用完整組態，也不將基本連通寫成全部應用或長期穩定性的成功保證。

頁面重點不是單純列出設定，而是把 IPv4 使用者重新理解 IPv6 的過程、DHCPv6-PD / RA / SLAAC / SD-WAN IPv6 路由的關係，以及實際卡住的三個除錯點視覺化。

## 頁面結構

- Hero：深夜網路除錯情境插畫與文章定位
- 章節導覽：八段式閱讀入口
- IPv6 基礎概念：位址、縮寫、/64、Link-Local、SLAAC、Prefix Delegation
- 拓樸圖：HiNet BRAS、FortiGate wan2、SD-WAN Zone、internal LAN、client 之間的 IPv6 路徑
- 實作步驟：FortiGate CLI 指令與設定說明
- 除錯紀錄：三個坑的症狀、查法與解法
- 後續實測補正：LINE IPv6 TLS / MSS、前綴生命週期、雙 WAN 邊界
- 分層驗收：設定、端點、應用、封包尺寸、重連與安全邊界
- 官方參考資料與修訂摘要
- 心得與版本註記

## 素材

- `image/hero.png`：AI 生成的夜間網路除錯插畫，用於 Hero。
- `image/clarity.png`：AI 生成的除錯後拓樸清晰化插畫，用於除錯段落。
- `image/cover.png`：由 hero 圖裁切為 1200×630 的首頁卡片規格封面；已掛首頁第 016 張卡片。
- `notebook.css`：2026-10-13 技術筆記排版覆寫；僅作用於本頁，不改首頁或共用樣式。

## 發布注意

頁面已加入根目錄首頁，使用正式卡片序號 `016`。後續若調整首頁標題、描述或分類，需同步更新 `website-maintenance.md` 卡片序號表與 `docs/PROJECTS.md`。

## 更新紀錄

### 2026-10-13 — 技術校訂與閱讀版面

- 使用者同意修正公開分享筆記與美化版面；未修改防火牆或 PC 網路設定。
- 保留 7 月 WAN2 / IAID 6 範例，另列 10 月 WAN1 / IAID 5 角色調整，不倒推初版一定失敗。
- 補齊 WAN / LAN / 通告 IAID，新增 RDNSS 範例；移除 WAN HTTP / HTTPS 管理開放。
- 將 PPP 介面、gateway、route / policy ID 改為需核對的欄位；釐清 policy route、GUI 可見性及原生 PD 不需 NAT 的適用範圍。
- 依本次工作紀錄補上 LINE TCP 已通但 TLS 卡住、MSS 1440 → 1432 的前後證據，明列未定位丟包 hop、MSS 不處理 UDP / QUIC。
- 補上舊 Preferred prefix、重撥驗收與 IPv4 / IPv6 備援不能混用的提醒。
- 視覺改為深藍 / 青綠技術手冊：縮短 Hero、八章目錄、警告框、封包數值對照、手機表格與可橫向捲動程式碼；沿用既有插畫與封面。
- 原始檔保存於根目錄 `_archive/versions/fortigate-ipv6-hinet/2026-10-13/`；回復時將其中 index.html / PROJECT.md 複製回本目錄，舊 HTML 不引用新 CSS。
- GitHub Pages 推送未執行；本次更新的是 W: 工作區與 NAS 內網提供的頁面。
- 驗證：NAS `http://192.168.10.100/fortigate-ipv6-hinet/` 已呈現新版；桌面原始尺寸與 1280×900、手機 390×844 視覺檢查通過。圖片與章節錨點無失效，390 / 1280 斷點整頁 scrollWidth 等於 clientWidth，瀏覽器未記錄 JS error；git diff --check 通過。本頁相對資源路徑皆存在。臨時 viewport 已恢復，預覽分頁保留。
- 驗證邊界：未將公開範例重新套入設備、未完成所有終端／長時間／所有重撥情境測試；文章中的封包結論沿用本次已記錄的前後實測。官方 CLI 文件本輪抓取受 403 限制，欄位另以原廠搜尋索引、PD 範例及本機備份核對。

### 2026-10-13 — GitHub 發布作業

- 使用者另行明確授權將本次更新推送 GitHub。
- 遠端為 `505kaichen-dev/505kaichen-dev.github.io` 的 main；發布基底為遠端 `5116bf7`。W: 的 main 與遠端歷史分岔，但本次既有目標檔案在兩邊基底一致。
- 使用獨立發布副本，僅帶入 index.html、notebook.css、PROJECT.md、docs/ARCHIVE_LOG.md、website-maintenance.md；不合併或推送 W: 其他本機提交，不納入其他未追蹤專案。
- 以一般 fast-forward 推送，不使用 force push；本機舊版備份保留，公開站更新仍須核對 GitHub Pages 部署。
