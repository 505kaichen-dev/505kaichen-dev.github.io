export const signalQuiz = [
  ["被動電吉他直接接到錄音介面時，通常先選哪種輸入？", ["Hi-Z 樂器輸入","Line 線路輸入","Mic 麥克風輸入"], 0, "同一種插頭可用在不同電平與阻抗的設備上。被動拾音器通常搭配高阻抗樂器輸入。"],
  ["強彈時輸入表過載，把耳機音量轉小後會怎樣？", ["輸入峰值隨耳機音量降低","聽起來變小，輸入仍削波","轉換器的輸入餘裕增加"], 1, "耳機音量在訊號鏈後端。要解決前端過載，應降低進入發生過載的級段的電平。"],
  ["哪個階段把類比訊號變成數位樣本？", ["D/A 轉換器","CAB 卷積處理","A/D 轉換器"], 2, "A/D 把類比輸入轉成數位樣本，數位效果處理後由 D/A 提供類比輸出給耳機等裝置。"],
  ["效果器直接進全頻 PA，想保留錄好吉他箱體的聲音，常見起點是？", ["啟用箱體與收音模擬","只用前級，讓 PA 提供箱體音色","關箱體，用 PA 通道增益補回"], 0, "PA 的全頻播放不等於吉他喇叭的頻率響應。保留 CAB／IR 可以先建立箱體和收音的色彩。"],
  ["用 USB 把 MG-50Li 錄進電腦時，哪個描述最準確？", ["依 PHONES 旋鈕決定錄音電平","由 USB 路由與 DAW 輸入決定","由 DAW 主輸出決定錄入聲道"], 1, "USB 和耳機孔是不同的輸出路徑。請用 DAW 軌道的輸入選擇與電平表確認錄到了哪一路。"],
];

const paths = [
  ["耳機", ["吉他", "INPUT / A/D", "效果、AMP、CAB / IR", "D/A / PHONES", "耳機"], "直接從 MG-50Li 的 PHONES 監聽。先把音量調低再慢慢加，CAB／IR 可先保留。"],
  ["全頻喇叭／PA", ["吉他", "INPUT / A/D", "效果、AMP、CAB / IR", "D/A / 類比輸出", "全頻喇叭或 PA"], "接 PA 時先與接收端確認用哪種輸入、輸出電平與接線。需要箱體與收音聲音時，常由啟用 CAB／IR 開始。"],
  ["吉他音箱 Return", ["吉他", "INPUT / A/D", "效果、AMP（依需求）", "D/A / 類比輸出", "音箱 Return / 實體喇叭"], "確認音箱有合適的 Return 且已接好喇叭。由實體吉他喇叭上色時，可先比較關閉 CAB／IR 的結果。"],
  ["USB 錄音", ["吉他", "INPUT / A/D", "錄音路由", "USB 數位音訊", "DAW 錄音軌"], "選擇裝置及 DAW 軌道的輸入，錄一小段後播放核對。是否錄到處理後音色取決於裝置路由及聲道選擇。"],
];

export function renderSignalPath(index) {
  const [, steps, explanation] = paths[index];
  return `<ol>${steps.map(step => `<li>${step}</li>`).join("")}</ol><p>${explanation}</p>`;
}

export function signalLesson({ previous, next, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#guitar">從琴弦到電訊號</a><a href="#conversion">類比與數位</a><a href="#levels">電平與削波</a><a href="#outputs">四種輸出路徑</a><a href="#experiment">實作練習</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 02 章</p><h1>電吉他訊號的旅程</h1>
        <p class="lede">同一段 Riff，從拾音器出發，可以進耳機，也可以錄進電腦。知道它經過哪些地方，音色或電平一變，你就知道先查哪裡。</p>
        <p class="muted">讀完應能選擇合適的輸入、分辨前端過載與後端音量，並畫出自己使用的監聽路徑。</p>
      </header>
      <div class="lesson-sticker-row"><p><a href="#outputs">你現在用耳機、音箱、PA，還是 USB 錄音？看看你的訊號怎麼走。</a></p><img src="${new URL("./assets/tone-buddy-listen-v001.png", import.meta.url).href}" width="384" height="384" loading="lazy" decoding="async" alt=""></div><section id="guitar" class="section"><h2>從琴弦到電訊號</h2>
        <p>磁性拾音器（Pickup）感應金屬琴弦的振動。用同一把 Les Paul 從琴頸切到琴橋，拾音位置變了，收到的頻譜和電平也可能變。再轉動琴上的 Volume 或 Tone，送進效果器前的訊號就已經不同。</p>
        <p>被動拾音器通常接高阻抗樂器輸入（Hi-Z／INST）。即使插頭相同，Line 和 Instrument 也可能有不同的輸入阻抗和適用電平；較低的輸入阻抗可能改變被動拾音器的高頻反應。效果器的類比輸出接到下一台機器時，則按輸出規格與接收端的輸入模式配對。<a href="https://support.focusrite.com/hc/en-gb/articles/115004171025-What-are-the-differences-between-mic-line-and-instrument-level">Focusrite 的電平說明</a></p>
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
        <p>沿用第 01 章的短 Riff。先選你現在用的出口，再和另一條路徑比對。全頻平坦響應喇叭（FRFR）和全頻的現場擴聲（PA）都可用來播放已塑形的聲音。用 USB 錄音時，數位音訊工作站（DAW）會從你選的輸入聲道收音。</p>
        <figure class="amp-illustration"><img src="${new URL("./assets/signal-listening-v002.webp", import.meta.url).href}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手戴著耳機聆聽，白色 Les Paul Custom 立在一旁。"><figcaption class="single-caption">切換監聽前，先記下剛才用哪一個出口聽。</figcaption></figure>
        <fieldset><legend>你想把聲音送到哪裡？</legend>
          ${paths.map(([label], index) => `<label class="option"><input type="radio" name="monitor-path" value="${index}" ${index === 0 ? "checked" : ""}> ${label}</label>`).join("")}
        </fieldset>
        <div class="diagram monitor-route" id="monitor-route" aria-live="polite">${renderSignalPath(0)}</div>
        <p>以上是訊號路徑示意。MG-50Li 的 INPUT、PHONES 與 USB Audio 可參考 <a href="https://nuxaudio.com/product/mg50li/">NUX 官方規格與手冊</a>。音箱的 Speaker Out 專供匹配喇叭或合規負載，請按音箱手冊接線。</p>
      </section>
      <section class="section" id="experiment"><h2>用同一段 Riff 查出差異</h2>
        <ol><li>選一個乾淨 Preset，記下 Pickup、琴上音量、Preset 及耳機或喇叭。</li><li>同一段 Riff 先輕彈，再用平常最重的力度彈一次。觀察可用的輸入或錄音電平表，留意有沒有過載提示。</li><li>若強彈出現異常，把監聽音量調低再比一次。若異常仍在，沿路查輸入、Preset 與輸出，逐段定位。</li><li>在筆記畫出自己的訊號路徑，標出聽到的位置、觀察到的現象和下一次只打算改的一項設定。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="chapter-pager" aria-label="章節導覽"><a href="${previous}">上一章 · 01　從想聽到的聲音出發</a><a class="pager-index" href="${course}">回完整目錄</a><a href="${next}">下一章 · 03　綜合效果器的內部世界</a></nav>
    </article>
  </main>`;
}
