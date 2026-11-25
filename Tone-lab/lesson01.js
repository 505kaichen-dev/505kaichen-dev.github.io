export const signalQuiz = [
  ["被動電吉他直接接到錄音介面時，通常先選哪種輸入？", ["Hi-Z 樂器輸入","Line 線路輸入","Mic 麥克風輸入"], 0, "同一種插頭可用在不同電平與阻抗的設備上。被動拾音器通常搭配高阻抗樂器輸入。"],
  ["強彈時輸入表過載，把耳機音量轉小後會怎樣？", ["輸入峰值隨耳機音量降低","聽起來變小，輸入仍削波","轉換器的輸入餘裕增加"], 1, "耳機音量在訊號鏈後端。要解決前端過載，應降低進入發生過載的級段的電平。"],
  ["哪個階段把類比訊號變成數位樣本？", ["D/A 轉換器","CAB 卷積處理","A/D 轉換器"], 2, "A/D 把類比輸入轉成數位樣本，數位效果處理後由 D/A 提供類比輸出給耳機等裝置。"],
  ["效果器直接進全頻 PA，想保留錄好吉他箱體的聲音，常見起點是？", ["啟用箱體與收音模擬","只用前級，讓 PA 提供箱體音色","關箱體，用 PA 通道增益補回"], 0, "PA 的全頻播放不等於吉他喇叭的頻率響應。保留 CAB／IR 可以先建立箱體和收音的色彩。"],
  ["用 USB 把 MG-50Li 錄進電腦時，哪個描述最準確？", ["依 PHONES 旋鈕決定錄音電平","由 USB 路由與 DAW 輸入決定","由 DAW 主輸出決定錄入聲道"], 1, "USB 和耳機孔是不同的輸出路徑。請用 DAW 軌道的輸入選擇與電平表確認錄到了哪一路。"],
];

const paths = [
  ["耳機", ["吉他", "INPUT / A/D", "效果、AMP、CAB / IR", "D/A / PHONES", "耳機"], "直接從 MG-50Li 的 PHONES 監聽。先把音量調低再慢慢加，例如 BRIT 800 後接 M 1960+G12M，耳機裡也能聽到箱體收音的輪廓。"],
  ["全頻喇叭／PA", ["吉他", "INPUT / A/D", "效果、AMP、CAB / IR", "D/A / 類比輸出", "全頻喇叭或 PA"], "接 PA 時先與接收端確認用哪種輸入、輸出電平與接線。需要箱體與收音聲音時，例如在 AMP 後接 M 1960+G12M，再把已帶箱體收音的訊號送進混音台。"],
  ["吉他音箱 Return", ["吉他", "INPUT / A/D", "效果、AMP（依需求）", "D/A / 類比輸出", "音箱 Return / 實體喇叭"], "確認音箱有合適的 Return 且已接好喇叭。由實體吉他喇叭上色時，可先比較關閉 CAB／IR 的結果。"],
  ["USB 錄音", ["吉他", "INPUT / A/D", "錄音路由", "USB 數位音訊", "DAW 錄音軌"], "選擇裝置及 DAW 軌道的輸入，錄一小段後播放核對。是否錄到處理後音色取決於裝置路由及聲道選擇。"],
];

export function renderSignalPath(index) {
  const [, steps, explanation] = paths[index];
  return `<ol>${steps.map(step => `<li>${step}</li>`).join("")}</ol><p>${explanation}</p>`;
}

export function signalLesson({ quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#guitar">從琴弦到電訊號</a><a href="#conversion">類比與數位</a><a href="#levels">電平與削波</a><a href="#outputs">四種輸出路徑</a><a href="#experiment">同一處破音，為什麼轉小耳機還在？</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 02 章</p><h1>電吉他訊號的旅程</h1>
        <p class="lede">輕撥時聲音很乾淨，一重刷，耳機裡卻冒出碎裂聲。這聲破音可能在訊號進入效果器的第一站就已經發生。從琴弦一路跟到耳機，才知道哪顆音量旋鈕管得到它。</p>
        <p class="muted">讀完應能選擇合適的輸入、分辨前端過載與後端音量，並畫出自己使用的監聽路徑。</p>
      </header>
      <div class="lesson-sticker-row"><p><a href="#outputs">你現在用耳機、音箱、PA，還是 USB 錄音？看看你的訊號怎麼走。</a></p><img src="${new URL("./assets/tone-buddy-listen-v001.png", import.meta.url).href}" width="384" height="384" loading="lazy" decoding="async" alt=""></div><section id="guitar" class="section"><h2>從琴弦到電訊號</h2>
        <p>磁性拾音器（Pickup）感應金屬琴弦的振動。用同一把 Les Paul 從琴頸切到琴橋，拾音位置變了，收到的頻譜和電平也可能變。再轉動琴上的 Volume 或 Tone，送進效果器前的訊號就已經不同。</p>
        <p>被動拾音器通常接高阻抗樂器輸入（Hi-Z／INST）。即使插頭相同，Line 和 Instrument 也可能有不同的輸入阻抗和適用電平；較低的輸入阻抗可能改變被動拾音器的高頻反應。效果器的類比輸出接到下一台機器時，則按輸出規格與接收端的輸入模式配對。<a href="https://support.focusrite.com/hc/en-gb/articles/115004171025-What-are-the-differences-between-mic-line-and-instrument-level">Focusrite 的電平說明</a></p>
        <p><strong>藍調裡的兩句問答。</strong>一把 Les Paul Custom 接進 MG-50Li，第一句用琴頸拾音器，第二句撥到琴橋。同一個 Preset 裡，圓潤的長音忽然有了尖一點的開頭。開關在琴上，送到 MG 的 INPUT 時聲音就已經變了；兩顆拾音器若出力不同，後面的微破音色也會跟著改變。</p>
      </section>
      <section id="conversion" class="section"><h2>類比與數位在哪裡交接</h2>
        <p>進入數位效果器後，類比轉數位（A/D）把輸入的連續電壓轉成一串樣本，效果、AMP 和 CAB／IR 在數位區處理。要從耳機孔或其他類比孔送出去，數位轉類比（D/A）才把處理後的訊號轉回類比，再由輸出級送到下一個設備。使用 MG-50Li 的 USB Audio 時，電腦收到的是數位音訊。</p>
      </section>
      <section id="levels" class="section"><h2>強彈時先看哪一段亮紅</h2>
        <p>動態餘裕（Headroom）是目前峰值到該級段上限之間的空間。用你實際會用的最重一下試彈，逐段確認輸入、效果和輸出。如果某一段峰值超過可承受的範圍，可能發生削波（Clipping）。</p>
        <div class="callout"><h3>把音量關小，還是刺？</h3><p>用乾淨的 Preset 試彈，先判斷是輸入已過載、Preset 內的增益過高，還是接收端輸入不匹配。耳機音量鈕調低只會改變你聽到的音量。若削波已在前端發生，要回到那一級調整。</p></div>
      </section>
      <section id="outputs" class="section">
        <h2>換一個出口，跟著訊號走</h2>
        <p>在圖上選你現在用的輸出，看看訊號最後去了哪裡。換另一個出口，再找出兩條路從哪一站開始分開。全頻平坦響應喇叭（FRFR）和全頻的現場擴聲（PA）都可用來播放已塑形的聲音。用 USB 錄音時，數位音訊工作站（DAW）會從你選的輸入聲道收音。</p>
        <figure class="song-scene"><img src="${new URL("./assets/return-wave.webp", import.meta.url).href}" width="1200" height="522" alt="耳機旁的她轉過頭，Q 版的自己正從吉他音箱後面揮手。"></figure>
        <fieldset><legend>你想把聲音送到哪裡？</legend>
          ${paths.map(([label], index) => `<label class="option"><input type="radio" name="monitor-path" value="${index}" ${index === 0 ? "checked" : ""}> ${label}</label>`).join("")}
        </fieldset>
        <div class="diagram monitor-route" id="monitor-route" aria-live="polite">${renderSignalPath(0)}</div>
        <p>以上是訊號路徑示意。MG-50Li 的 INPUT、PHONES 與 USB Audio 可參考 <a href="https://nuxaudio.com/product/mg50li/">NUX 官方規格與手冊</a>。音箱的 Speaker Out 專供匹配喇叭或合規負載，請按音箱手冊接線。</p>
      </section>
      <section class="section" id="experiment"><h2>同一處破音，為什麼轉小耳機還在？</h2>
        <p>若訊號進入 A/D 轉換器時就已經削波，耳機收到的就是那個失真的波形。轉小耳機，連破音也一起變小聲，削掉的音頭卻回不來。這也是為什麼輸入電平和監聽音量要分開看。</p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
