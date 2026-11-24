# Guitar Tone Lab｜用綜合效果器玩音色

目前包含首頁、第 00–11 章的 12 章教材與測驗、音色筆記，以及輸出路徑、Preset／Scene、AMP、箱體收音、增益結構、Delay／Reverb、訊號鏈順序、經典搖滾音色、Noise Gate 與症狀診斷的互動練習。第 10 章的音色設計紀錄可儲存瀏覽器草稿與下載 Markdown。

## 啟動

在 PowerShell 執行以下指令，需要 Node.js。

```powershell
Set-Location -LiteralPath 'W:\Tone-lab'
node preview.mjs
```

開啟 http://127.0.0.1:8765/ 。請在同一個網址與瀏覽器使用以保留資料。
若已有靜態伺服器，可將 Tone-lab 專案根目錄設為文件根目錄。頁面與資源使用相對路徑。

## 維護

- `course.js` 維護課程地圖、第 00 章術語與測驗。
- `lesson01.js` 維護第 01 章教材、測驗和輸出路徑。
- `lesson02.js` 維護第 02 章教材、測驗和 Preset／Scene 練習。
- `lesson03.js` 維護第 03 章教材、測驗和固定 CAB／IR 的 AMP 反應示意。
- `lesson04.js` 維護第 04 章教材、測驗和固定 AMP 的箱體與收音位置示意。
- `lesson05.js` 維護第 05 章教材、測驗和增益級段的電平示意。
- `lesson06.js` 維護第 06 章教材、測驗、Delay 時間軸與 Reverb 擺位。
- `lesson07.js` 維護第 07 章教材及 EQ／Drive 換序練習。Builder 可載入練習範例，獨立於既有存檔，明確按下儲存才寫入。
- `lesson08.js` 維護第 08 章教材與五種搖滾音色起點。每個起點提供實機 A/B 提示，可將 Block 順序帶入 Builder。
- `lesson09.js` 維護第 09 章教材與 Noise Gate 閾值練習。
- `lesson10.js` 維護第 10 章教材、音色設計表單、草稿、Markdown 匯出和網站紀錄 JSON 備份。匯入時可先預覽，再套用到表單，按下儲存草稿才寫入瀏覽器。
- `lesson11.js` 維護第 11 章教材、依 A/B 結果提供下一步的診斷練習，以及無音訊的頻帶探索。
- `chain.js` 維護訊號鏈 Block、資料驗證與觀察規則。
- `app.js` 提供版面、教材正文、互動與儲存。練習室位於 `labs/index.html`，集合章內練習，提供內建合成吉他辨聽與本機音檔 A/B。
- `style.css` 提供暖白底、銀灰面板、藍色操作與琥珀色啟用狀態，以及響應式排版。
- `guitar-tone-lab:v1` 儲存章節進度、測驗、筆記與一條已儲存的示意訊號鏈。另開網址或清除網站資料會影響可用紀錄。

## 後續

MG-50Li 官方資料與待實機確認項目集中於 [MG50LI_PROFILE.md](MG50LI_PROFILE.md)。訊號鏈教具呈現順序與觀察提示，練習室可播放合成吉他示範或使用者選取的本機錄音。工作範圍與決策見 WORK_LOG.md。
