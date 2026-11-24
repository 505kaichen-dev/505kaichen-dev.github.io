export const gainQuiz = [
  ["耳機音量轉小後，輸入削波仍在。要先去哪裡調整？", ["過載點之前的輸入電平","失真後方的 Block Level","接在最後的監聽音量"], 0, "降低後端音量只能讓已削波的聲音變小聲。要避免削波，須在過載級段之前留出餘裕。"],
  ["兩個音色失真感不同，要公平比較，先怎麼做？", ["把兩個 AMP 的 Gain 設成相同","用後端 Level 對齊聽感音量","把最高峰值對齊就直接判斷"], 1, "相同峰值不等於一樣大聲。用同一段演奏、同一路監聽，先把主觀響度拉近，再比音色。"],
  ["音量型 Boost 移到 AMP 後，後級還有餘裕，通常先會發生什麼？", ["主要提高前級的失真量","主要改變進 AMP 的力度","主要提高輸出音量"], 2, "Boost 位於哪一級之前，就會改變那個後續級段收到多少訊號。AMP 已先處理完成。"],
  ["Noise Gate 怎麼設，比較容易保住弱音和延音？", ["從低閾值往上找剛好收噪的位置","提高閾值直到弱音也完全消失","先縮短 Release 再提高整體 Gain"], 0, "Threshold 太高可能連弱音也關掉。Release 影響關閉速度，先聽停弦和尾音再調。"],
  ["高增益時和弦變糊，第一輪怎麼試？", ["提高 AMP Gain，再降低耳機音量","小退 AMP Gain，補齊後端音量","降低後端 Level，維持前級失真量"], 1, "固定其他條件可以判斷 Gain 是否真的造成分離度下降。高增益的壓縮和失真可能讓多音疊在一起。"],
];

const defaults = { input: 0, drive: 4, boost: 6, position: "before", output: -4 };

export function gainExample({ input, drive, boost, position, output }) {
  const adDemand = -12 + input;
  const adClip = adDemand > 0;
  const adLevel = Math.min(adDemand, 0);
  const ampInput = adLevel + drive + (position === "before" ? boost : 0);
  const saturation = Math.max(ampInput - (-12), 0);
  const ampLevel = ampInput - saturation * .65;
  const outputDemand = ampLevel + (position === "after" ? boost : 0) + output;
  return { adDemand, adClip, ampInput, saturation, ampLevel, outputDemand, outputClip: outputDemand > 0 };
}

const formatDb = value => {
  const rounded = Math.round(value * 10) / 10;
  return (rounded > 0 ? "+" : "") + rounded + " dBFS";
};

export function mountGainPractice(root) {
  const fields = Object.fromEntries(Object.keys(defaults).map(key => [key, root.querySelector("#gain-" + key)]));
  const meters = [...root.querySelectorAll(".gain-meter")];
  const note = root.querySelector("#gain-observation");

  function paint() {
    const settings = Object.fromEntries(Object.keys(defaults).map(key => [key, key === "position" ? fields[key].value : Number(fields[key].value)]));
    const sample = gainExample(settings);
    const rows = [
      [sample.adDemand, sample.adClip ? "輸入削波" : "A/D 峰值", sample.adClip],
      [sample.ampInput, "含 Drive 的示意驅動電平", false],
      [sample.ampLevel, sample.saturation ? "示意飽和" : "尚未進入示意飽和", false],
      [sample.outputDemand, sample.outputClip ? "輸出削波" : "D/A 前峰值", sample.outputClip],
    ];
    rows.forEach(([level, detail, clip], i) => {
      const row = meters[i];
      row.querySelector("meter").value = Math.min(0, Math.max(-36, level));
      row.dataset.overload = String(clip);
      const reading = clip ? "超出滿刻度 " + (Math.round(level * 10) / 10) + " dB"
        : (i === 1 || i === 2) ? formatDb(level) + " 等效" : formatDb(level);
      row.querySelector(".gain-meter-value").textContent = reading + " · " + detail;
    });
    for (const key of ["input", "drive", "boost", "output"]) {
      const value = settings[key];
      root.querySelector("#gain-" + key + "-value").textContent = (value > 0 ? "+" : "") + value + " dB";
    }
    const stageNotes = [];
    if (sample.adClip) stageNotes.push("A/D 已過載：轉小後端 Level 仍會留下輸入削波。");
    if (sample.outputClip) stageNotes.push("輸出超過上限：請調低後端 Level。");
    if (!stageNotes.length) stageNotes.push("輸入與輸出都未超過示意上限。");
    stageNotes.push(settings.position === "before"
      ? "Boost 在 AMP 前，會增加推動這顆 AMP 的電平。"
      : "Boost 在 AMP 後，會提高後端電平，這顆 AMP 的驅動不受此 Boost 影響。");
    note.textContent = stageNotes.join(" ");
  }

  function apply(settings) {
    for (const [key, value] of Object.entries(settings)) fields[key].value = String(value);
    paint();
  }

  root.addEventListener("input", paint);
  root.querySelector("#gain-reset").addEventListener("click", () => apply(defaults));
  root.querySelector("#gain-demo").addEventListener("click", () => apply({ ...defaults, input: 16, output: -12 }));
  apply(defaults);
}

const asset = name => new URL("./assets/" + name, import.meta.url).href;
const slider = (key, description, min, max) => `<label for="gain-${key}"><span>${description} <output id="gain-${key}-value" for="gain-${key}"></output></span><input id="gain-${key}" type="range" min="${min}" max="${max}" value="${defaults[key]}"></label>`;
const meter = (name, index) => `<li class="gain-meter"><strong>${name}${index === 0 ? '<img class="clip-face" src="' + asset("tone-buddy-too-hot-v001.png") + '" alt="" width="44" height="44">' : ""}</strong><meter aria-hidden="true" min="-36" max="0"></meter><span class="gain-meter-value"></span></li>`;

export function gainLesson({ previous, next, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#gain-stages">聲音在哪一段變大</a><a href="#boost">Boost 放前還是後</a><a href="#gate">Noise Gate</a><a href="#gain-practice">電平練習</a><a href="#experiment">實機 A/B</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 05</p><h1>Gain Staging 增益結構</h1>
        <p class="lede">「太大聲」和「太多破音」要分開處理。順著 Input、Drive、AMP、Block Level 到 Output 找一遍，你會知道哪顆旋鈕該動。</p>
      </header>
      <section id="gain-stages" class="section"><h2>先找到聲音在哪一段變大</h2>
        <p><strong>A/D 前增益</strong>會改變輸入離轉換器滿刻度還有多少空間。實機若有 Input Trim，先確認它位於 A/D 前還是後。轉換後的數位 Trim 可以改變送入效果鏈的電平，先前的削波仍會留下。<strong>Drive 和 AMP</strong>可以塑造失真與動態。<strong>Block Level</strong>調整送給下一級的電平，最後再檢查 <strong>Output</strong> 和接收端。</p>
        <figure class="amp-illustration">
          <img src="${asset("gain-monitor-level-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="短紫髮吉他手抱著白色 Les Paul Custom，伸手調整桌上的監聽音量。">
          <figcaption class="single-caption">監聽小聲了。先前在輸入削掉的尖峰，仍然回不來。</figcaption>
        </figure>
        <p>0 dBFS 是數位滿刻度的基準。固定滿刻度的 A/D 或輸出邊界超出上限，會造成削波（Clipping）。內部浮點級可以另有餘裕，實機也可能先在類比級過載。用平常最重的一下看電平，留點空間給下一下。<a href="https://support.focusrite.com/hc/en-gb/articles/208958089-How-high-should-I-set-the-gain-control-on-my-interface">Focusrite 的增益與餘裕說明</a></p>
      </section>
      <section id="boost" class="section"><h2>想多一點破音，還是多一點音量？</h2>
        <p>同一顆純音量 Boost，放在 <strong>AMP 前</strong>會讓它收到更大的訊號，可能提早飽和。放在 <strong>AMP 後</strong>且後面仍有餘裕時，多半提高後段的電平。若 Boost 自己也改 EQ 或產生破音，就還要把那一段算進去。</p>
        <p>重失真會讓不同弦的訊號一起進入非線性處理，可能壓平起音、讓和弦不易分辨。先小幅下修 Gain，再用後端 Level 把 A/B 的聽感音量拉近。練習用同一段 Riff 和同一套監聽，留意每條弦的輪廓是否更清楚。</p>
      </section>
      <section id="gate" class="section"><h2>Noise Gate 留得住尾音嗎？</h2>
        <p>Gate 在訊號低於設定條件時抑制聲音。<strong>Threshold</strong> 會影響多大的訊號能通過；太高時，輕觸或延音也可能被吃掉。<strong>Release</strong> 影響收回的速度，太短易切斷尾巴，太長則可能把空拍的底噪留住。</p>
        <p>先用空弦停奏和長音測試，只調到能抑制不必要的空檔聲。演奏中仍明顯的嗡聲或底噪，要回頭檢查拾音器、接線、電源和增益配置。</p>
      </section>
      <section id="gain-practice" class="section">
        <h2>哪一級先亮紅？</h2><p>先猜：輸入已經過載，拉低後端 Level，哪一格還會亮紅？載入範例，拉動滑桿驗證。</p>
        <div class="console" id="gain-lab">
          <div class="section-head"><h3>增益結構實驗</h3><span class="tag">電平示意 · 無音訊</span></div>
          <p class="muted">起始 Riff 峰值以 −12 dBFS 等效電平表示。AMP 用簡化的壓縮規則示意，紅色只標出兩個滿刻度邊界的過載。</p>
          <div class="gain-sliders">
            ${slider("input", "A/D 前增益（示意）", -12, 18)}
            ${slider("drive", "AMP Drive", 0, 18)}
            ${slider("boost", "Boost", 0, 18)}
            ${slider("output", "後端 Level", -24, 18)}
          </div>
          <div class="rig-controls">
            <label>Boost 位置 <select id="gain-position"><option value="before">AMP 前</option><option value="after">AMP 後</option></select></label>
            <button type="button" class="secondary" id="gain-demo">載入輸入過載</button>
            <button type="button" class="secondary" id="gain-reset">重置</button>
          </div>
          <ol class="gain-meters" aria-label="從輸入到輸出的峰值">
            ${["A/D 邊界", "AMP 驅動", "AMP 處理後", "輸出邊界"].map(meter).join("")}
          </ol>
          <p class="amp-observation" id="gain-observation" role="status"></p>
        </div>
        <p class="muted">電平條共用 −36 至 0 dBFS 的顯示刻度。AMP 兩欄用等效電平表示內部處理，超過 0 時讀文字數值。只有輸入與輸出邊界的超限會在這個示意裡標成削波。</p>
      </section>
      <section id="experiment" class="section"><h2>用自己的效果器做一輪 Boost A/B</h2>
        <p>沿用<a href="../00/index.html#goal">第 00 章的四拍 Riff</a>。先用第 2 拍的重手悶音檢查電平，再用第 3 拍聽破音量與和弦分離度。</p>
        <ol><li>選一個接近破音的 AMP，固定 Pickup、CAB／IR、監聽與 Riff。確認輸入和輸出都有餘裕。</li><li>用低增益或純音量的 Boost，先放 AMP 前再放 AMP 後。保持同樣的 Boost 量，記下哪個設定改變了破音、哪個主要改變音量。若裝置不支援移動，改用兩個可比較的鏈路。</li><li>再把後端音量匹配，重彈強弱和弦。若聽到尖銳破音，沿 Input、Block、Output 與接收端逐段檢查。</li></ol>
        <p>記下 Boost 的位置、哪一級的電平變了，以及拉回同音量後，第 3 拍還有沒有差別。</p>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：CAB、Speaker、Mic、IR</a><a href="${next}">下一章：動態、調變與空間效果</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
