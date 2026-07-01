# Food Spinner 維護與除錯紀錄

最後更新：2026-06-30（Asia/Taipei）

## 專案位置與測試網址

- 網路磁碟路徑：`W:\food-spinner`
- LAN 測試網址：`http://192.168.10.100/food-spinner/`
- 預計 GitHub Pages：`https://505kaichen-dev.github.io/food-spinner/`
- 主程式：`index.html`（單一 HTML，包含 CSS 與 JavaScript）

`W:\food-spinner` 是網站伺服器目錄的網路磁碟映射。Google API 判斷來源時看瀏覽器網址的 HTTP Referer，不看 Windows 磁碟路徑。

## 網站功能概要

- 依早餐／中餐／晚餐搜尋附近店家。
- Demo 模式使用內建台北模擬資料。
- 真實模式使用 Google Maps JavaScript API、Geocoding API 與 Places API (New)。
- 使用新版 `Place.searchByText()` 搜尋附近食物，最多取得 20 筆候選結果。
- 顯示範圍預設自動由 500 公尺開始，結果少於 6 間時擴大至 900／1,500 公尺。
- 以 Canvas 顯示隨機轉盤，抽選後顯示店家、距離、地址與營業狀態。
- API Key 儲存在瀏覽器 `localStorage` 的 `gplaces_key`。

## 2026-06-30 除錯過程

### 暖食風格介面改版

- 保留原本搜尋、篩選與轉盤操作流程，全面更新 CSS 視覺。
- 主色改為炭火棕、番茄橘、金黃與薄荷綠，強化食物與夜市氛圍。
- 強化位置卡、轉盤外框、抽選結果卡與店家清單的視覺層次。
- 補上輸入框焦點、按鈕回饋、店家列 hover 與抽選標籤。
- 新增 640px 手機版配置：API 按鈕直排、搜尋按鈕雙欄、清單資訊換行。

### 篩選後自動補搜

- 原本 Places Text Search 每次最多只取 20 筆，套用「僅營業中／排除便利商店」後不會再次向 Google 補資料。
- 現在啟用任一篩選時，若可用店家少於 12 間，會依序以「附近的食物／附近餐廳／附近小吃」補搜。
- 補搜結果以 Place ID 去除重複，最多執行三組搜尋，達到 12 間即提前停止。
- 「僅營業中」也會傳給 Places API 的 `isOpenNow`，提高每批結果的有效比例。

### API Key 獨立驗證

- API Key 輸入區新增「驗證 API Key」按鈕。
- 驗證會實際測試 Maps JavaScript API、Geocoding API 與 Places API (New) Text Search。
- Places SearchText 遇到 `PERMISSION_DENIED`／403 時，畫面會提示啟用 Places API (New)，並把它加入該金鑰的 API 限制。
- 驗證成功後才顯示 LIVE；已載入金鑰可按「重新驗證」。

### 新版 Places 營業狀態修正

- `Place.isOpen()` 目前只在 Maps JavaScript API beta channel 提供，不能在 stable 版本直接使用。
- 搜尋欄位加入 `utcOffsetMinutes`，並以 `currentOpeningHours.periods` 配合店家時區計算現在是否營業。
- 僅在 Google 沒有營業時間或時區資料時顯示「狀態未知」。

### 1. 網站錯誤顯示 API 已連接

原始程式在 Google Maps JavaScript 檔案載入並呼叫 `onMapsReady()` 後，立即顯示「API 已連接／LIVE」。這只代表 JavaScript 檔案下載成功，不代表 API Key、帳單、網站限制或各項 API 權限可用。

修正：

- `onMapsReady()` 現在只顯示「程式已載入，尚未驗證」。
- 第一次真實 Places 搜尋成功後才顯示 LIVE。
- 加入 `window.gm_authFailure`，攔截 Google Maps 授權失敗。
- API 驗證失敗時顯示紅色 ERROR 橫幅。

### 2. 搜尋可能永遠卡在「搜尋中」

原始 `realSearch()` 將 Places API 所有非 `OK` 狀態轉成空陣列，造成錯誤被隱藏；部分授權錯誤也可能沒有正常完成 Promise。

修正：

- `ZERO_RESULTS` 才視為正常空結果。
- 其他 Places 狀態會拋出包含狀態碼的錯誤。
- 真實搜尋加入 12 秒逾時，逾時後停止 Loading 並顯示錯誤。

### 3. `ApiNotActivatedMapError`

Console 顯示：

```text
Google Maps JavaScript API error: ApiNotActivatedMapError
```

根因：Maps JavaScript API 只在 API Key 限制清單中被允許，但尚未於該 Key 所屬的同一個 Google Cloud 專案中真正啟用。

處理：在「API 和服務 → 程式庫」啟用 Maps JavaScript API。啟用後網站可載入 Maps，但下一步出現 Geocoding 錯誤。

### 4. `Geocode 失敗：REQUEST_DENIED`

Console 顯示 Geocoding Service 未啟用。根因同樣是 API Key 限制清單不等於 API 已啟用。

處理：在同一 Google Cloud 專案啟用 Geocoding API 與 Places API。完成後地址搜尋成功，網站顯示 LIVE 並取得 16 間真實店家。

### 5. Google Maps 載入效能警告

Console 原先顯示 Maps JavaScript API 未使用建議的 async 載入模式。

修正：載入網址加入：

```text
loading=async
```

### 6. API Key 清除功能

加入「清除 API Key」按鈕。按下後會：

1. 刪除 `localStorage.gplaces_key`。
2. 清除目前 API 狀態。
3. 重新載入網站並回到 Demo 模式。

### 7. API 設定教學

加入「API 設定教學」按鈕與頁內彈出視窗，內容包括：

- 建立或選擇 Google Cloud 專案。
- 啟用必要 API。
- 建立及限制 API Key。
- LAN 與 GitHub Pages HTTP Referer 範例。
- 貼上 Key 並等待真實搜尋驗證。

教學按鈕會保留在 Demo、CHECKING、LIVE 與 ERROR 狀態。

### 8. 便利商店搜尋

Places 搜尋類型加入 `convenience_store`：

- 早餐：`bakery`、`cafe`、`restaurant`、`convenience_store`
- 中餐／晚餐：`restaurant`、`convenience_store`

### 9. 地址搜尋限制在台灣

未限制國家時，像「內湖區東湖路113號」這類地址可能被 Google Geocoder 誤判成中國武漢等同名地區。`geocodeAddress()` 已加入：

- `region: 'TW'`
- `componentRestrictions: { country: 'TW' }`

因此手動輸入的地址只會解析台灣結果。GPS 搜尋仍會使用裝置實際位置。

### 10. Google Maps 店家資訊連結

真實 Places 搜尋結果現在會保留 `place_id`。使用者可：

- 點擊任何搜尋結果列，直接在新分頁開啟該店家的 Google Maps 頁面。
- 點擊轉盤結果卡，或按「在 Google Maps 查看」按鈕，開啟抽中店家的 Maps 頁面。

真實資料優先以 `query_place_id` 精準定位；Demo 資料則以店名與地址組合搜尋。

### 11. 營業狀態改為三態顯示

原本清單使用布林判斷，將 Places 沒有提供的 `null` 狀態誤顯示為「休息中」。目前已改為：

- `true`：營業中
- `false`：休息中
- `null`：狀態未知

新版搜尋使用 `currentOpeningHours.isOpen()`。若 Google 未提供營業時間，網站不會猜測店家已休息。

### 12. 擴大搜尋與結果篩選（舊版階段）

為了讓結果更接近 Google Maps 的「附近食物」搜尋：

- 搜尋半徑由 900 公尺提高為 1,500 公尺。
- 結果上限由 16 間提高為 30 間。
- 搜尋類型擴充為 `restaurant`、`meal_takeaway`、`convenience_store`、`cafe`、`bakery`。
- 新增 500／900／1,500 公尺距離篩選。
- 新增「只顯示營業中」開關；狀態未知的店家不會被當成營業中。
- 轉盤與 Google Maps 連結都使用目前篩選後的結果。

此段記錄舊版 Nearby Search 的過渡狀態，已由下方新版 Text Search 取代。

### 13. 遷移至 Places API (New) Text Search

- 舊版 `PlacesService.nearbySearch()` 已改為 `Place.searchByText()`。
- 中餐／晚餐查詢「附近的食物」，早餐查詢「附近早餐」。
- 以使用者位置為中心、1,500 公尺為 location bias，回傳後再以實際距離嚴格過濾。
- Google 新版 JavaScript Text Search 每次最多回傳 20 筆，本版只發出一次搜尋請求。
- 距離預設為自動：500 公尺內少於 6 間時擴大至 900 公尺，仍不足再擴大至 1,500 公尺。
- 新增「排除便利商店」開關，預設關閉。
- 保留手動距離與「只顯示營業中」篩選；轉盤只抽目前可見結果。

## Google Cloud 建議設定

### 必須在 API 程式庫真正啟用

- Maps JavaScript API
- Places API (New)
- Geocoding API

目前程式已使用新版 `google.maps.places.Place.searchByText()`，不再依賴舊版 `PlacesService.nearbySearch()`。

### API Key 的 API 限制

只允許上述網站實際需要的 API，避免選取全部 Maps Platform API。

### API Key 的網站限制

LAN 測試：

```text
http://192.168.10.100/*
```

GitHub Pages：

```text
https://505kaichen-dev.github.io/food-spinner/*
```

若 Repository 名稱或網站網址變更，必須同步更新 Referer 限制。Google 不需要能從外網連入 LAN；瀏覽器會把來源網址送給 Google 驗證。

## 常見錯誤對照

| 錯誤 | 常見原因 | 處理方式 |
|---|---|---|
| `ApiNotActivatedMapError` | Maps JavaScript API 未在 Key 所屬專案啟用 | 到 API 程式庫啟用 |
| `Geocode 失敗：REQUEST_DENIED` | Geocoding API 未啟用或不在 Key 允許清單 | 啟用並檢查 Key 限制 |
| `RefererNotAllowedMapError` | 目前網址不在網站限制 | 加入完整 LAN 或 GitHub Pages 規則 |
| `BillingNotEnabledMapError` | 專案未連結有效帳單 | 啟用 Cloud Billing |
| `InvalidKeyMapError` | Key 錯誤、失效或貼入錯誤 | 建立／輪替 Key 後重新貼入 |
| 搜尋逾時 | Places API 未啟用、授權被拒或網路異常 | 查看 Console 與 Google Cloud 狀態 |

## 已知事項與後續待辦

1. API Key 存在使用者瀏覽器的 localStorage。這是前端 Maps API 常見做法，但必須設定 HTTP Referer 與 API 限制；不可使用未限制的 Key。
2. Console 可能保留先前的紅色錯誤紀錄。重新測試前先清空 Console，避免將舊錯誤誤認為目前錯誤。
3. 真實 API 測試應確認：地址轉換、店家數量、便利商店、距離排序、自動擴大、營業狀態及轉盤結果。
4. 若要公開部署，建議補上隱私說明與 Google Maps Platform 使用／資料顯示規範檢查。

## AI 接手維護建議

開始修改前先閱讀本檔與 `index.html`。修改 API 流程時需保留以下原則：

- Script 載入成功不等於 API 驗證成功。
- 只有真實 API 請求成功才能顯示 LIVE。
- 不可吞掉 Places 的非成功狀態。
- Loading 必須在成功、失敗、授權錯誤及逾時後結束。
- 不要把 API Key 寫死或提交到 Repository。
- 修改後至少測試 Demo 模式、錯誤 Key 與有效 Key 三種流程。
