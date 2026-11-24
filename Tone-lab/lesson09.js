export const metalQuiz = [
  ["低弦悶音的低頻一進失真就糊成一片，先在哪裡測減低頻？", ["主要失真級之前","箱體收音之後","PA 的總輸出端"], 0, "失真前先減少低頻，能改變進入非線性級的訊號。後段 EQ 只能修整已生成的頻譜。"],
  ["Gate 一開，停拍乾淨了，但輕彈的起音也常完全消失。先試哪個改動？", ["再縮短 Gate 的 Release","降低 Gate 閾值","調高 Gate 後的輸出 Level"], 1, "閾值太高可能讓弱音無法觸發。Release 影響收聲速度，Gate 後的 Level 則無法讓前面的 Gate 打開。"],
  ["比較前置 OD 有沒有讓悶音更緊，要怎麼驗證？", ["同時改 OD Drive 與 AMP Gain","換琴橋拾音器後再開 OD 比較","同一 Riff 比 OD 開關，對齊音量"], 2, "保留相同演奏和 AMP／CAB，只切換 OD，能減少音量和箱體差異造成的誤判。"],
  ["要做同一段節奏吉他的左右雙軌，怎麼準備素材？", ["把同一段節奏各彈錄一次","把同一軌複製後等量分到左右","同一軌輸出到兩個相同單聲道軌"], 0, "獨立演奏的細微差異能形成左右寬度。完全相同的兩軌等量左右播放時，會聽成置中的訊號。"],
  ["單音很厚，複雜和弦卻糊掉；你想確認是不是 AMP Gain 太多，怎麼測？", ["保持 Gain，改用音數更少的和弦","小退 Gain，對齊音量再刷同一和弦","保持 Gain，把 CAB 換成較暗的版本"], 1, "用單音和複雜和弦交叉驗證，看看清晰度提高後，節奏是否還保有想要的重量。"],
];

const gateExamples = [
  { name: "停手底噪", level: -58 },
  { name: "輕手悶音", level: -40 },
  { name: "重手悶音", level: -19 },
];

const startThreshold = -48;
const formatDb = number => String(number).replace("-", "−") + " dB";
const asset = name => new URL("./assets/" + name, import.meta.url).href;

export function mountMetalPractice(root) {
  const slider = root.querySelector("#metal-threshold");
  const output = root.querySelector("#metal-threshold-value");
  const items = root.querySelectorAll("#metal-gate-result li");
  function paint() {
    const threshold = slider.valueAsNumber;
    output.value = formatDb(threshold);
    gateExamples.forEach(({ level }, index) => {
      const passes = level >= threshold;
      items[index].dataset.passes = String(passes);
      items[index].querySelector("strong").textContent = passes ? "通過" : "衰減";
    });
  }
  slider.addEventListener("input", paint);
  root.querySelector("#metal-reset").addEventListener("click", () => {
    slider.value = startThreshold;
    paint();
  });
  paint();
}

export function metalLesson({ previous, next, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#riff">悶音與起音</a><a href="#boost">前置 Boost 與低頻</a><a href="#metal-gate">Noise Gate 練習</a><a href="#double-tracking">雙軌與混音</a><a href="#experiment">MG-50Li 實作</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 09</p><h1>現代金屬音色實驗室</h1>
        <p class="lede">兩下低弦悶音，刷過和弦，再留一拍空白。從這一小段聽出起音有沒有咬勁、低頻收得住嗎，以及停手時還剩下什麼聲音。</p>
      </header>
      <section class="section" id="riff"><h2>拿起 Pick，跟著同一個拍子彈</h2>
        <div class="metal-count"><figure><img src="${asset("pick-detail-v001.webp?rev=count-in-1")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手舉起黑色 Pick，準備彈第一拍。"></figure>
          <ol><li><strong>低弦悶音</strong>輕、重各一下，聽兩次起音的差別。</li>
            <li><strong>刷和弦</strong>先彈 Power Chord，再換一個複雜和弦，聽哪些弦還分得開。</li>
            <li><strong>停一拍</strong>雙手消音，聽剩下的是底噪，還是弦仍在響。</li></ol>
        </div>
        <p>把撥弦手掌外側靠近琴橋輕觸琴弦，逐步調位置和力道。想比較 Preset 時，固定剛找到的手勢，避免把琴弦悶住的多寡當成設備差異。</p>
      </section>
      <section class="section" id="boost"><h2>先聽 AMP 怎麼吃低頻</h2>
        <p>從 AMP → CAB／IR 起步，保留足夠的增益讓單音站得住。若悶音已經鼓成一團，先小幅退 Gain，用還有餘裕的後端 Level 補回聽感音量，再聽 Power Chord 和複雜和弦。</p>
        <p>仍嫌鬆時，試 AMP 前減一點低頻，或比較帶低頻削減的 OD。先用低 Drive、保守的輸出量比較開關，再單獨提高 OD Level，聽前級是否被推得過頭。後段 EQ 可以修整成品的低頻份量。兩處各改一次，聽起音和尾巴怎麼變。</p>
      </section>
      <section class="section" id="metal-gate">
        <h2>Gate 關得乾淨，也要讓輕音進來</h2><p>先把閾值拉到最低，再慢慢提高。找出能壓住底噪、又能讓輕手悶音通過的最低值。再往上推，看看哪一下會先消失。</p>
        <p>拿自己的效果器試，記得每調一次就交替彈「輕悶音、停弦」，最後再留一個長音。若空拍已安靜，長音卻突然斷掉，就回退 Threshold 再聽。把能保住這三個動作的設定存回練習用的 Preset。</p>
        <div class="console" id="metal-lab">
          <div class="section-head"><h3>閾值比較</h3><span class="tag">固定示意電平 · 無音訊</span></div>
          <div class="gain-sliders"><label for="metal-threshold"><span>Gate 閾值 <output id="metal-threshold-value" for="metal-threshold"></output></span>
            <input id="metal-threshold" type="range" min="-70" max="-10" step="1" value="${startThreshold}"></label></div>
          <ul class="metal-gate-result" id="metal-gate-result" aria-live="polite">
            ${gateExamples.map(({ name, level }) => `<li><span>${name} <small>${formatDb(level)}</small></span><strong></strong></li>`).join("")}
          </ul>
          <button type="button" class="secondary" id="metal-reset">重置閾值</button>
        </div>
        <p>示意只比較電平和閾值。實機若提供 Decay 或 Release，還可以調低於閾值後收聲的速度。尾音被切斷時，先分辨弱音有沒有通過，再決定要降低閾值或延長收聲時間。<a href="https://www.boss.info/uk/products/ns-2/downloads/">BOSS Noise Suppressor 控制說明</a></p>
      </section>
      <section class="section" id="double-tracking"><h2>雙軌的寬度來自兩次演奏</h2>
        <p>同一段 Riff 錄兩次，第一軌偏左，第二軌偏右。先對齊兩次的起音和停拍，再和單軌做同音量比較。若用同一個錄音複製到左右並等量播放，兩邊訊號完全相同，聲像會留在中央。</p>
        <p>把兩軌放回 Bass 和鼓裡再調低頻。若碰到 Kick 時輪廓就不見了，先降低其中一組軌道的低頻或音量，一次改一處。單獨聽比較薄的設定，回到混音裡仍可能保有重量與清晰度。</p>
      </section>
      <section class="section" id="experiment"><h2>到 MG-50Li 做三次對照</h2>
        <ol><li>複製一份節奏 Preset 作比較。固定琴橋拾音器、AMP、CAB／IR 與監聽，用包含輕重悶音、和弦和停拍的同一段 Riff 當素材。</li><li>先只退 AMP Gain，補齊聽感音量，聽複雜和弦是否更清楚。恢復基準，再試前置低 Drive 的 OD 開關，聽低弦起音和重量。</li><li>留下較合適的設定，從低閾值慢慢提高 Gate。輪流彈輕音、重音和停拍，確認空拍穩定而且弱音仍在。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：經典搖滾音色實驗室</a><a href="${next}">下一章：從零建立完整 Preset</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
