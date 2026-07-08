# FortiGate 60F + HiNet PPPoE IPv6 全紀錄

## 狀態

- 建立日期：2026-07-07
- 狀態：已加入首頁公開卡片
- 入口：`index.html`
- 封面：`image/cover.png`
- 首頁卡片：`data-order="016"`

## 內容定位

這是一篇自造日誌 / 技術戰報型長頁，整理 FortiGate 60F（FortiOS 7.2.13）在中華電信 PPPoE 環境下開通 IPv6 的完整過程。

頁面重點不是單純列出設定，而是把 IPv4 使用者重新理解 IPv6 的過程、DHCPv6-PD / RA / SLAAC / SD-WAN IPv6 路由的關係，以及實際卡住的三個除錯點視覺化。

## 頁面結構

- Hero：深夜網路除錯情境插畫與文章定位
- 章節導覽：六段式閱讀入口
- IPv6 基礎概念：位址、縮寫、/64、Link-Local、SLAAC、Prefix Delegation
- 拓樸圖：HiNet BRAS、FortiGate wan2、SD-WAN Zone、internal LAN、client 之間的 IPv6 路徑
- 實作步驟：FortiGate CLI 指令與設定說明
- 除錯紀錄：三個坑的症狀、查法與解法
- 最終設定總覽：核對表
- 心得與版本註記

## 素材

- `image/hero.png`：AI 生成的夜間網路除錯插畫，用於 Hero。
- `image/clarity.png`：AI 生成的除錯後拓樸清晰化插畫，用於除錯段落。
- `image/cover.png`：由 hero 圖裁切為 1200×630 的首頁卡片規格封面；目前尚未掛首頁。

## 發布注意

頁面已加入根目錄首頁，使用正式卡片序號 `016`。後續若調整首頁標題、描述或分類，需同步更新 `website-maintenance.md` 卡片序號表與 `docs/PROJECTS.md`。
