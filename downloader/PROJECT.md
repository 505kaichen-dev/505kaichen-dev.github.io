# Downloader 軟體介紹與開發故事

## 狀態

- 建立日期：2026-09-11
- 狀態：已加入首頁公開卡片
- 入口：`index.html`
- 封面：`image/cover.png`
- 首頁卡片：`data-order="017"`
- 軟體版本：`0.1.0-beta.7`

## 內容定位

這是一篇 Build／Windows 軟體長頁，介紹提供個人、非商業使用的 Downloader Portable 工具，以及它從單一網址下載原型、登入與下載佇列，發展到圖片批次選取與可換主題 UI 的完整過程。

作者已確認可公開提供 Portable 成品下載，但限定個人、非商業使用，原始碼不公開。目前先顯示版本、容量與 SHA-256，下載按鈕維持「連結準備中」；取得外部雲端分享網址後再啟用。

## 頁面結構

- Hero：紫晶航線主視覺、產品定位與版本資訊
- 起點：單頁網址的真實使用情境與產品邊界
- 功能介紹：影片、圖片、佇列、登入與 Portable
- 實際介面：0.1.0-beta.7 紫晶航線畫面
- 操作流程：貼網址、辨識、分析、加入佇列、完成開啟
- 開發故事：原型、真實錯誤、佇列、帳號、Beta 與主題演進
- 主題系統：紫晶航線與 Microsoft Fluent
- 隱私與邊界：獨立登入、非商業使用、不繞過 DRM 或會員權限
- 公開測試版：版本、容量、SHA-256、使用條件與待更新下載按鈕
- 技術組成：.NET 8、WPF、yt-dlp、FFmpeg、WebView2、Deno

## 素材

- `image/cover.png`：1200×630 首頁卡片封面，由 beta.7 實際介面與紫晶品牌素材合成。
- `image/interface-amethyst.png`：beta.7 紫晶航線實際介面。
- `image/interface-fluent.png`：beta.6 Microsoft Fluent 實際介面；beta.7 只調整側欄 Footer 文案，不影響文章呈現的主要 UI 結構。
- `image/theme-canvas.png`：Downloader 原創紫晶航線全景主視覺。
- `image/chibi-header.png`：Downloader 原創透明 Q 版角色。
- `image/brand-crystal.png`：Downloader 紫晶品牌標誌。
- `scripts/make-cover.ps1`：由既有介面與品牌素材重新產生封面。

## 發布注意

- 首頁分類：Build／Windows 軟體。
- 不把 EXE 或 ZIP 放進網站 Git repository；取得作者提供的外部分享網址後更新下載按鈕。
- 軟體功能、版本或測試數量變更時，同步更新本文與本文件。
- 若日後加入 Downloader 主題素材到 Gallery，直接引用本專案圖片，不複製第二份。
