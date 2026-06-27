# kids-math 開發交接文件

---

## 一、網站基本規範（System Prompt）

### 個人網站資訊
- 網址：505kaichen-dev.github.io
- 純 HTML5，CSS 和 JS 寫在同一個檔案
- 部署：GitHub Pages（GitHub Desktop 管理）

### 首頁設計系統（僅適用 index.html 和 gallery/index.html）
- 風格：科技感、淺色質感
- `--bg: #F8F9FC` / `--blue: #2563EB` / `--ink: #0D0F14`
- 字型：Space Grotesk（標題）/ Inter（內文）
- 最大寬度 1280px 置中，響應式斷點 900px / 600px

### 子頁面規範
- 每個子頁面風格自由，依內容主題決定
- 必須包含：header（含返回首頁連結 `../`）、main content、footer
- 子頁面內的返回連結指向上一層

### 開發流程規範
- 小幅修改：直接執行
- 中大幅修改：必須走確認流程（草圖 → 內容確認 → 開工指令）
- 禁止在未確認架構前產出完整程式碼

### 圖片標記規範
```
<!-- [COVER] 1200x630 描述 -->
<!-- [IMAGE] 800x600 描述 -->
<!-- [ICON] 描述 -->
<!-- [CHART] 描述 -->
```
每次完成 HTML 後，在末尾加入產圖移交摘要區塊，並產出獨立 TXT 檔。

---

## 二、kids-math 專案說明

### 定位
- 4–6 歲兒童數學學習網站
- 掛載於個人網站子頁面：`kids-math/`
- 親子學習分類

### 檔案結構
```
kids-math/
├── index.html              主頁（上圖下文卡片選單）
├── counting.html           數數字
├── addition.html           加法
├── subtraction.html        減法
├── shapes.html             形狀辨識
├── mixed.html              加減綜合
├── learn-counting.html     數數字教學頁
├── learn-addition.html     加法教學頁
├── learn-subtraction.html  減法教學頁
├── learn-shapes.html       形狀教學頁
├── learn-mixed.html        加減綜合教學頁
├── counting.png            各關卡封面圖
├── addition.png
├── subtraction.png
├── shapes.png
├── mixed.png
├── image/
│   └── cover.png           主頁 Hero 封面
└── audio/
    ├── common/             共通回饋音檔（10個）
    ├── numbers/            數字 1-100（100個）
    ├── operators/          運算符號（4個）
    ├── counting/           數數字題目句（2個）
    ├── addition/           加法題目句（1個）
    ├── subtraction/        減法題目句（1個）
    ├── mixed/              綜合題目句（2個）
    ├── shapes/             形狀顏色名稱（16個）
    └── learn/              教學頁說明句（14個）
```

---

## 三、語音系統規範（所有遊戲頁統一標準）

### 音檔播放核心邏輯
```javascript
const AUDIO_BASE = './audio/';
let currentAudio = null; // 防疊音

function playAudio(path, onEnd) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  const a = new Audio(AUDIO_BASE + path);
  currentAudio = a;
  a.onended = () => { currentAudio = null; if (onEnd) onEnd(); };
  a.onerror = () => { currentAudio = null; if (onEnd) onEnd(); };
  a.play().catch(() => { currentAudio = null; if (onEnd) onEnd(); });
  return a;
}
```

### 練習模式語音觸發邏輯
| 時機 | 動作 |
|------|------|
| 題目出現 | 自動念題目句（延遲 400ms） |
| 選項點選 | 立即念該選項名稱，可重複點換答案 |
| 按確認→答對 | 念鼓勵句，**念完後**才跳下一題 |
| 按確認→答錯 | 念錯誤句，**念完後解鎖**，不跳題，讓重選 |
| 跳過 | 念跳過句，**念完後**跳下一題 |
| 升級 | 念升級音效 + Toast |

### 挑戰模式語音觸發邏輯
| 時機 | 動作 |
|------|------|
| 題目出現/切換 | 自動念題目句（延遲 400ms） |
| 選項點選 | 立即念該選項名稱 |
| 按確認 | **不播語音**，直接跳下一道未答題 |
| 跳過 | **不播語音**，直接跳下一道未答題 |
| 回上一題 | 不播語音，cLoad 內自動念題目句 |
| 結算 | 播一次鼓勵音，滿分加粒子特效 |

### 答錯邏輯（重要）
```javascript
// 答錯：念錯誤句，念完後解鎖讓重選
playWrongVO(() => {
  PS.selBtn.classList.remove('wrong-sel');
  PS.sel = null; PS.selBtn = null; PS.locked = false;
  document.getElementById('p-confirm').classList.remove('ready');
  document.querySelectorAll('#p-opts .option-btn').forEach(b => b.disabled = false);
});
```

---

## 四、各遊戲頁難度設計

### 數數字（counting.html）
| Lv | 數量上限 | 選項數 |
|----|---------|--------|
| 1 | 5 | 5 |
| 2 | 10 | 10 |
| 3 | 20 | 10 |
| 4 | 50 | 10 |
| 5 | 100 | 10 |

### 加法（addition.html）
| Lv | 加數上限 | 結果上限 |
|----|---------|---------|
| 1 | 4 | 5 |
| 2 | 9 | 10 |
| 3 | 10 | 20 |
| 4 | 25 | 50 |
| 5 | 50 | 100 |

### 減法（subtraction.html）
| Lv | 數字上限 |
|----|---------|
| 1 | 5 |
| 2 | 10 |
| 3 | 20 |
| 4 | 50 |
| 5 | 100 |
- 結果永遠 ≥ 1，不出現負數或零

### 形狀辨識（shapes.html）✅ 已完成最新版
| Lv | 可出形狀 | 顏色題比例 |
|----|---------|-----------|
| 1 | 圓形、正方形、三角形 | 20% |
| 2 | +星形、菱形、半圓形、心形 | 30% |
| 3 | +長方形、梯形、平行四邊形 | 35% |
| 4 | +五邊形、六邊形、橢圓形 | 40% |
| 5 | +箭頭形 | 40% |
- 顏色：紅橘黃綠藍紫黑白（8種）
- 無旋轉

### 加減綜合（mixed.html）
- 隨機混合加法和減法
- 難度同加減法各自設定

### 動態難度升級規則（所有關卡）
| 升級 | 需答對題數 |
|------|-----------|
| Lv1→2 | 5題 |
| Lv2→3 | 10題 |
| Lv3→4 | 20題 |
| Lv4→5 | 30題 |

---

## 五、待辦事項

### 🔴 優先：遊戲頁語音邏輯重寫
以 `shapes.html` 為基準，重寫以下四個檔案：
- `counting.html` ✅ 2026-06-27 完成
- `addition.html` ✅ 2026-06-27 完成
- `subtraction.html` ✅ 2026-06-27 完成
- `mixed.html` ✅ 2026-06-27 完成

每個檔案需確認：
- [x] `currentAudio` 防疊音機制
- [x] 答對：念完鼓勵句才跳下一題（callback）
- [x] 答錯：念完錯誤句才解鎖重選，不跳題
- [x] 跳過：念完才跳下一題（callback）
- [x] 題目朗讀：念題目句，不念答案
- [x] 選項點選：念選項名稱
- [x] 升級：`showToast(msg, true)` 傳入 isUp 參數
- [x] 挑戰模式確認/跳過靜音
- [x] 結算只播一次音效
- [x] 移除所有 Web Audio API / Web Speech API 殘留

### 🟡 次要：教學頁加入 🔊 按鈕
等音檔產好後，在以下教學頁加入語音朗讀按鈕：
- `learn-addition.html` ✅ 已加入 4 個語音導覽按鈕
- `learn-subtraction.html` ✅ 已加入 4 個語音導覽按鈕
- `learn-mixed.html` ✅ 已加入 6 個語音導覽按鈕

音檔路徑：`audio/learn/`（14個，詳見 kids-math_教學頁語音移交.csv）

### 🟢 待產音檔
- `audio/shapes/black.mp3`（黑色）✅ 已存在
- `audio/shapes/white.mp3`（白色）✅ 已存在
- `audio/learn/` 共 14 個教學頁說明句 ✅ 已存在

---

## 六、shapes.html 作為基準的關鍵函式結構

```javascript
// 音檔系統
let currentAudio = null;
function playAudio(path, onEnd) { ... }       // 防疊音
function playQuestionVO(q, btnId, onEnd) { }  // 念題目句
function playOptionVO(name) { }               // 念選項名稱
function playCorrectVO(onEnd) { }             // 念鼓勵句，完成後 callback
function playWrongVO(onEnd) { }               // 念錯誤句，完成後 callback
function playSkipVO(onEnd) { }                // 念跳過句，完成後 callback
function playLevelUpVO() { }
function playLevelDownVO() { }
function playResultVO() { }                   // 結算音效

// 共用工具（只定義一次）
function showPage(id) { }
function selectOpt(btn, gid) { }
function getSelected(gid) { }
function spawnParticles() { }
function spawnExp() { }
function showToast(msg, isUp) { }             // isUp 控制升/降級音效

// 練習模式
function startPractice() { }
function pNext() { }          // 出題 + 延遲念題目句
function practiceConfirm() { } // 答對→callback跳題；答錯→callback解鎖
function practiceSkip() { }   // callback跳題

// 挑戰模式
function startChallenge() { }
function renderNav() { }
function cGo(i) { }
function cLoad(i) { }         // 出題 + 延遲念題目句
function challengeConfirm() { } // 靜音，直接跳題
function challengeSkip() { }    // 靜音，直接跳題
function challengePrev() { }    // 靜音，cLoad 自動念
function cAdvance() { }
function showResult() { }     // 結算，播一次音效
```

---

## 七、音檔路徑對照表

### 共通（audio/common/）
```
correct_1.mp3 ~ correct_4.mp3   答對鼓勵
wrong_1.mp3 ~ wrong_3.mp3       答錯回饋
skip.mp3                         跳過
levelup.mp3                      升級
leveldown.mp3                    降級
```

### 數字（audio/numbers/）
```
1.mp3 ~ 100.mp3
```

### 運算符號（audio/operators/）
```
plus.mp3     加
minus.mp3    減
equals.mp3   等於
question.mp3 幾？
```

### 各關卡題目句
```
audio/counting/question.mp3          數一數，總共有幾個？
audio/counting/correct_answer.mp3    答對了！總共有
audio/addition/question.mp3          加在一起是幾個？
audio/subtraction/question.mp3       帶走之後，還剩幾個？
audio/mixed/question_add.mp3         加在一起是幾個？
audio/mixed/question_sub.mp3         帶走之後，還剩幾個？
audio/shapes/question_shape.mp3      這是什麼形狀？
audio/shapes/question_color.mp3      這個形狀是什麼顏色？
```

### 形狀名稱（audio/shapes/）
```
circle.mp3 square.mp3 triangle.mp3 star.mp3 diamond.mp3
semicircle.mp3 heart.mp3 rectangle.mp3 trapezoid.mp3
parallelogram.mp3 pentagon.mp3 hexagon.mp3 oval.mp3 arrow.mp3
```

### 顏色名稱（audio/shapes/）
```
red.mp3 orange.mp3 yellow.mp3 green.mp3
blue.mp3 purple.mp3 black.mp3 white.mp3
```

### 教學頁（audio/learn/）
```
addition_concept.mp3
addition_step1.mp3 ~ addition_step3.mp3
subtraction_concept.mp3
subtraction_step1.mp3 ~ subtraction_step3.mp3
mixed_concept.mp3
mixed_judge_q1.mp3 ~ mixed_judge_q5.mp3
```

---

## 八、2026-06-27 Codex 接手進度

### 本次完成項目

1. 完成 `counting.html`、`addition.html`、`subtraction.html`、`mixed.html` 四個遊戲頁的語音流程重寫。
2. 加入單一 `currentAudio` 控制，播放新語音前會停止上一段，避免疊音。
3. 練習模式改為：
   - 題目出現約 400ms 後朗讀題目句。
   - 點選答案時朗讀選項數字。
   - 答對後等待鼓勵語音與答案語音播放完畢，再進入下一題。
   - 答錯後等待錯誤語音播放完畢，清除錯誤選取並解鎖同一題供重新作答。
   - 跳過後等待跳過語音播放完畢，再進入下一題。
4. 挑戰模式保留選項朗讀及換題後的題目朗讀；確認、跳過與上一題操作本身不額外播放回饋音。
5. 確認四個遊戲頁未殘留 `speechSynthesis`、`AudioContext` 或 `webkitAudioContext`。
6. `learn-addition.html` 新增 4 個語音導覽按鈕，對應加法概念及三個步驟音檔。
7. `learn-subtraction.html` 新增 4 個語音導覽按鈕，對應減法概念及三個步驟音檔。
8. `learn-mixed.html` 新增 6 個語音導覽按鈕，對應綜合概念及五道判斷題音檔。
9. 三個教學頁的播放器也加入 `currentAudio` 防疊音處理。

### 驗證結果

- 七個修改頁面的 JavaScript 均已通過語法解析檢查。
- 四個遊戲頁均已確認具備防疊音、答錯解鎖、跳過 callback、題目朗讀及選項朗讀程式。
- 三個教學頁共確認 14 個語音按鈕：加法 4 個、減法 4 個、綜合 6 個。
- 交接文件列為待產的黑色、白色及 14 個教學音檔，實際盤點時皆已存在。

### 後續建議

- 在 Chrome／手機瀏覽器實際逐頁操作一次，確認瀏覽器自動播放政策、音量與每段音檔長度下的操作手感。
- 特別測試練習模式的「答錯後重選」、快速連點選項，以及挑戰模式來回切題。
- 本次未進行部署、提交或推送；工作區原本已有其他未提交檔案，後續整理版本時請避免一併覆蓋。

---

## 九、2026-06-27 平板與手機遊玩版面最佳化

### 設計基準

- 主要平板：Redmi Pad Pro，實體解析度 2560×1600、16:10。
- 網頁排版測試基準：約 1280×800 CSS px（橫向）與 800×1280 CSS px（直向）。
- 橫向為推薦遊玩方式，但不強制鎖定方向；裝置旋轉時由 CSS 自動切換版面。

### 本次完成項目

1. `counting.html`、`addition.html`、`subtraction.html`、`mixed.html`、`shapes.html` 新增平板橫向雙欄遊玩版型。
2. 橫向 900px 以上時：左側顯示題目／圖像，右側集中答案、回饋、上一題與確認按鈕，減少兩側空白及向下捲動。
3. 平板直向 900px 以下時維持單欄，縮短 header、卡片與區塊間距。
4. 針對橫向可用高度低於 700px（例如瀏覽器網址列占用空間）加入緊湊高度規則。
5. 遊戲高度使用 `100dvh`，依網址列顯示／收起後的實際可用高度調整。
6. 數數字關卡在橫向雙欄時，10 個選項改為右側兩欄排列，保留足夠觸控面積。
7. 五個遊戲頁 header 新增「⛶ 全螢幕遊玩」按鈕；使用者點擊後進入或退出全螢幕，不強制鎖定方向。
8. `kids-math` 內全部 11 個 HTML 頁面加入觸控手勢抑制：
   - `html { touch-action: pan-x pan-y; }`：保留正常頁面捲動並抑制雙指縮放。
   - `button, a { touch-action: manipulation; }`：降低快速連點造成誤放大的情況。
9. 未加入 `user-scalable=no` 或 `maximum-scale=1`，保留家長透過瀏覽器功能調整比例的能力。

### 驗證結果

- 11 個 HTML 頁面的 JavaScript 均通過語法解析。
- 11 個頁面的 CSS 大括號結構檢查均通過。
- 五個遊戲頁皆確認包含橫向、直向、低高度、`100dvh`、雙欄 grid 及全螢幕控制規則。
- 五個遊戲頁皆只有一個全螢幕按鈕與一組全螢幕切換函式。

### 尚需實機確認

- 使用 Redmi Pad Pro Chrome 分別測試橫向一般模式、橫向全螢幕及直向模式。
- 確認網址列展開時，三答案、十答案及形狀文字選項均不需捲動即可按下確認。
- 確認雙擊與雙指手勢不會誤放大，單指上下捲動在首頁及教學頁仍正常。
- 本次未進行 GitHub Pages 同步、提交或推送。

---

## 十、2026-06-27 練習模式節奏加速

- 五個遊戲頁的答對流程統一改用較短的 `audio/common/correct_2.mp3`。
- `counting.html` 移除答對後的「總共有＋答案數字」串接語音。
- `addition.html`、`subtraction.html`、`mixed.html` 移除答對後重念完整算式的串接語音。
- `shapes.html` 移除答對音結束後額外 300ms 的等待時間。
- 短回饋音播放完畢後立即換題；題目出現時的朗讀、點選答案朗讀、答錯提示與跳過提示仍保留。
- 五個頁面的 JavaScript 語法及短回饋函式檢查均通過。

---

## 十一、2026-06-27 原創遊戲回饋音效

### 新增音檔

```
audio/sfx/correct_1.wav
audio/sfx/correct_2.wav
audio/sfx/correct_3.wav
audio/sfx/wrong_1.wav
audio/sfx/wrong_2.wav
audio/sfx/wrong_3.wav
audio/sfx/skip.wav
```

- 答對音效：三組清脆上行鐘琴／木琴音，長度約 0.52–0.55 秒。
- 答錯音效：三組柔和下行音，不使用刺耳警報，長度約 0.46 秒。
- 跳過音效：短促上滑音，長度約 0.34 秒。
- 音檔為原創程式合成、44.1kHz、單聲道 PCM WAV；單檔約 29–48KB。

### 程式調整

- `counting.html`、`addition.html`、`subtraction.html`、`mixed.html`、`shapes.html` 的練習模式已改用 `audio/sfx/`。
- 答對與答錯各隨機播放三種音效，降低長時間練習的重複感。
- 跳過播放固定短音效。
- 題目與選項仍使用語音朗讀；升級與結算等低頻事件仍保留原有語音／音效。

### 驗證結果

- 七個 WAV 檔案均通過 RIFF 檔頭與檔案存在檢查。
- 五個遊戲頁均確認引用答對、答錯與跳過音效。
- 五個遊戲頁的 JavaScript 語法檢查均通過。
