# Downloader 軟體介紹與開發故事

## 狀態

- 建立日期：2026-09-11
- 狀態：已加入首頁公開卡片
- 入口：`index.html`
- 封面：`image/cover.png`
- 首頁卡片：`data-order="017"`
- 軟體版本：`0.1.0-beta.10`
- 本次改版：2026-09-14；僅修改網站檔案，commit / push 由作者自行處理。

## 內容定位

這是一篇 Build／Windows 軟體長頁，介紹提供個人、非商業使用的 Downloader Portable 工具，以及它從單一網址下載原型、登入與下載佇列，發展到圖片批次選取與可換主題 UI 的完整過程。

作者已確認可公開提供 Portable 成品下載，但限定個人、非商業使用，原始碼不公開。已啟用作者提供的 OneDrive 分享頁，外部下載入口只有一個，其他下載 CTA 導向頁內下載區。

- 分享網址：`https://1drv.ms/u/c/dda45afff18c6116/IQBChh5-MH_3RY4g9cosiZVrAQV7pDw5NU3vKBtoGbMCzi4?e=rLe2zB`
- 本機檔案：`DownloaderPortable-0.1.0-beta.10-win-x64.zip`，227,320,318 bytes。
- SHA-256：`A3D87C119D63978FE97E6A0EC3519E502A424D819F571210559F6DDF4C1BCD85`
- 驗證邊界：容量與雜湊來自本機 release，未獨立下載並比對 OneDrive 檔案；發布前作者宜確認分享權限與雲端版本一致。

產品對外主張為免費、無廣告。文章 Hero 與下載區必須清楚呈現，並避免放置容易與廣告混淆的多個下載按鈕。

實際使用情境包含社群二創與搞笑迷因影片製作：使用者偶爾需要取得眼前單一影片或圖片頁面的素材，卻經常被網頁下載工具的廣告、假按鈕與解析失敗干擾。這段經驗是「免費、無廣告」主張及單頁產品邊界的重要來源。文章可用不點名特定網站的諷刺口吻呈現，但仍需提醒使用者確認素材授權與來源平台規範。

## 頁面結構

- Hero：實際介面先出現，清楚呈現免費、無廣告、Windows Portable。
- 三個互動功能分頁：影片／圖片／下載任務，支援鍵盤方向鍵。
- 雙主題展示：紫晶航線／標準淺色，使用相同示範資料比較。
- 開發故事：保留原創諷刺漫畫，精簡成三個開發片段。
- 下載：OneDrive、系統需求、本機 ZIP 驗證資訊及雜湊複製。
- FAQ：支援範圍、登入、NAS、會員限制、圖片尺寸、使用條件、更新與技術。
- 展示圖片可放大；手機可橫向捲動查看細節。

## 素材

- `image/showcase-amethyst.png`、`showcase-fluent.png`、`showcase-images.png`：1460×960，beta.10 實際 WPF 介面以隔離設定搭配中性示範資料渲染；不是下載成功的實測證據，頁面明確標示示範資料。
- 渲染輔助程式保留於 `X:\Downloader\artifacts\site-render\`，未更動 Downloader 正式程式碼；產圖不啟動真實下載，也不讀取既有登入資料。
- 此次沿用既有原創角色與漫畫，沒有待生成圖片或假介面示意圖。下列舊版介面與封面保留作歷史素材，內文已改用 beta.10 展示圖。
- `styles.css` 與 `scripts/site.js` 分別管理頁面樣式與互動，不依賴第三方前端 CDN。

## 本次驗證

- 桌機與 390×844 手機視窗：未發現頁面橫向溢出。
- 實測圖片／任務分頁、標準淺色主題切換、圖片放大與關閉、手機漫畫橫向檢視、下載驗證資訊展開、SHA-256 複製。
- 所有 HTML 本機資源引用存在；Git diff 空白檢查通過。
- 分享連結按作者提供值接入；未代為發布網站，也未宣稱雲端檔案已核驗。

- `image/cover.png`：1200×630 首頁卡片封面，由 beta.7 實際介面與紫晶品牌素材合成。
- `image/interface-amethyst.png`：beta.7 紫晶航線實際介面。
- `image/interface-fluent.png`：beta.6 Microsoft Fluent 實際介面；beta.7 只調整側欄 Footer 文案，不影響文章呈現的主要 UI 結構。
- `image/theme-canvas.png`：Downloader 原創紫晶航線全景主視覺。
- `image/chibi-header.png`：Downloader 原創透明 Q 版角色。
- `image/brand-crystal.png`：Downloader 紫晶品牌標誌。
- `image/web-downloader-frustration-comic.png`：以 ImageGen 製作的原創三格漫畫，呈現假下載按鈕、廣告跳轉、99% 失敗與紫晶角色解圍。
- `scripts/make-cover.ps1`：由既有介面與品牌素材重新產生封面。

## 發布注意

- 首頁分類：Build／Windows 軟體。
- 不把 EXE 或 ZIP 放進網站 Git repository；外部分享網址與版本變更時同步更新下載資訊。
- 軟體功能、版本或測試數量變更時，同步更新本文與本文件。
- 若日後加入 Downloader 主題素材到 Gallery，直接引用本專案圖片，不複製第二份。
