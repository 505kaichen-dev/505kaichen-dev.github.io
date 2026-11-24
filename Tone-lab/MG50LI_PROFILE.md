# NUX MG-50Li｜設備查證與實作紀錄

文件查閱日期為 2026-11-21。MG-50Li 是課程的示範設備。以下把原廠可查證的功能和仍需確認的行為放在同一列，方便以實機、韌體和編輯器版本更新。

| 項目 | 文件可確認 | 待實機或文件確認 |
| --- | --- | --- |
| Preset Volume | V1.1.1 的 Preset 畫面可用 Knob 2 調整，原廠列出 ±12 dB 顯示。 | 記錄裝置語系、韌體、儲存後重新載入的音量，以及兩個 Preset 切換的聽感。 |
| Patch Tail | V1.1.1 在 Global Settings 提供開關，關閉會截斷切換 Preset 時的效果尾音。 | 同一個 Delay 各測一次 Preset、Scene、單顆 Block 旁路。逐筆記錄行為，不由 Preset 推論其他切換。 |
| Scene／Footswitch／Expression | V1.1.1 列有 TAP／SCENE 套用 S1–S3、STOMP LATCH 及外接控制支援。 | 各 Scene 保存的開關、模型、參數範圍和切換行為，以及每個模式下的腳踏映射。 |
| AMP、CAB／IR 與路由 | 原廠列出 TS/AC-4K、Deep Image、Cyber IR 的麥克風／位置／距離選項，以及串聯、並聯、分流與雙 S/R。 | 按模型記錄參數，核對可用 Block 位置、分流輸出與實際限制。 |
| 耳機、類比輸出與 USB | 有耳機與平衡輸出，原廠列 USB Audio 為 24-bit／48 kHz。V1.1.1 增列 USB 音訊至 XLR OUT。 | 用同一個 Preset 分別確認 PHONES、XLR、1/4 吋和 DAW 聲道是否帶有 CAB／IR。記下輸出模式、接收端、聲道、實際聽到或錄到的結果。 |
| 自訂 IR | 原廠規格列有使用者 IR。 | 逐項核對 WAV 等格式、聲道數、長度、取樣率、編輯器匯入位置，以及不支援的檔案會被拒絕還是轉換。USB 介面規格不能用來推定 IR 匯入限制。 |
| 編輯器與備份 | 原廠列有 NUX Audio Editor，V1.1.1 說明另有雲端 Preset 備份與分享。 | 記錄編輯器版本，驗證本機匯出可包含哪些資料，匯入後是否保留 IR 與版本對應。網站 JSON 是音色筆記的備份格式。 |

## 實機結果怎麼記

每輪記下韌體與編輯器版本、Preset 名稱、輸出路徑、唯一改動和觀察結果。使用可還原的副本。測 IR 時在結果裡附檔案的聲道數、取樣率、位元深度與樣本數，並記下編輯器的實際訊息。

[NUX MG-50Li 規格及 V1.1.1 說明](https://nuxaudio.com/product/mg50li/) · [NUX USA 手冊與下載入口](https://www.nux.us/blogs/support/mg50-li-support-hub)
