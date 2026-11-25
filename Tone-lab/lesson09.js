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

export function metalLesson({ quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#riff">悶音與起音</a><a href="#boost">前置 Boost 與低頻</a><a href="#metal-gate">Noise Gate 練習</a><a href="#double-tracking">雙軌與混音</a><a href="#experiment">悶音的重量和空拍的安靜</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 10 章</p><h1>現代金屬音色實驗室</h1>
        <p class="lede">「噔、噔、鏘——」最後那一下和弦聽起來特別大。把前面兩下低弦也拉長一點，再在腦中哼一次，整句的重心就換了。</p>
      </header>
      <section class="section" id="riff"><h2>低弦一下一下刷，怎麼全黏在一起了？</h2>
        <div class="scene-strip"><figure><img src="${asset("pick-detail-v001.webp?rev=count-in-1")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手舉起黑色 Pick，準備起拍。"><figcaption>「來，最後一下讓它響！」</figcaption></figure>
          <p>聽 Metallica〈Master of Puppets〉的主 Riff。低弦悶音一個緊跟一個，每一下撥片咬到弦的聲音卻還是聽得見。等和弦放開來，才發現前面那串低音收得有多短。<a href="https://www.metallica.com/songs/master-of-puppets.html">聽 Metallica 的演出版本</a></p>
        </div>
        <p>唱片裡還藏著好幾把「一起停手」的吉他。製作人 Flemming Rasmussen 回憶，他們換用 James 和 Kirk 的琴，把同一段節奏錄了好幾遍。Kirk 也提過，這張專輯多處混用了 Boogie 和 Marshall 機頭。想用自己的一把琴抓到那股衝勁，可以先聽清楚其中一件事：每一下低弦從哪裡開始？</p>
        <p><a href="https://www.mixonline.com/recording/classic-tracks/classic-track-master-of-puppets-metallica">Rasmussen 談這首歌的疊錄</a> · <a href="https://www.guitarworld.com/magazine/prime-cuts-metallicas-james-hetfield-and-kirk-hammett-critique-key-songs-band-s-harsh-noble-history">Hetfield 與 Hammett 談錄音器材</a></p>
      </section>
      <section class="section" id="boost"><h2>把 Gain 退一點，那兩下低弦呢？</h2>
        <p>拿 MG-50Li 試試。AMP 在 Deep Image 裡選 <strong>CLAYMORE MKIII CRUSH</strong>，IR 配 <strong>MBOS412+V30</strong>，當作高增益節奏的起點。彈兩下短促的低弦，再刷一個 Power Chord。如果前兩下像一聲拖長的「嗡」，把 AMP Gain 往回轉一點，用後端 Level 補到跟剛才差不多大聲，再彈一次。撥片的起音冒出來了嗎？最後的和弦還有你喜歡的厚度嗎？<a href="https://nux.cherubtechnology.com/download/Manual/Effects/Multi_Effects/MG50Li/NUX_MG50Li_UserManual_English.pdf#page=17">NUX 音箱與 IR 對照表</a></p>
        <p>如果每一下都聽得見撥片，下面卻拖著一團低頻，高增益節奏常用的做法是在音箱前收一些低頻。帶低頻削減的 OD 能讓低弦少一點能量進入失真級，後面的和弦仍有厚度。MG 可用低 DRIVE 的 T SCREAMER 推 AMP；只想收低頻又喜歡原來的破音顆粒，前置 6-BAND EQ 也能做到。</p>
      </section>
      <section class="section" id="metal-gate">
        <h2>停了一拍，怎麼還有聲音？</h2>
        <div class="lesson-sticker-row"><p>雙手把弦停住，留一拍空白。還有一點「嘶——」嗎？在 MG-50Li 的 NG 選 NOISE GATE，放在 AMP 後、空間效果前，讓它在停手時收掉高增益音箱的底噪。</p><img src="${asset("tone-buddy-metal-stop-v001.png")}" data-animated-src="${asset("gate-peek-loop.gif")}" width="384" height="384" loading="lazy" alt="紫髮吉他手比了個噓，等著聽空拍。"></div>
        <p>接著輕輕撥一下。如果連這個音都消失了，Gate 的門檻就設得太高。下方可以拖動門檻，看輕音在哪裡被擋住。實機用 SENS 調整靈敏度，DECAY 控制收聲速度。</p>
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
        <p>第一次聽回放，吉他在正中央。把這一軌複製一份，兩邊等量分到左右，聲音還是黏在中間。換個做法：把同一段 Riff 再彈錄一遍。</p>
        <figure style="margin:1rem 0"><img src="${asset("metal-double-track.webp")}" width="1440" height="480" style="display:block;width:100%;height:auto" loading="lazy" alt="兩格漫畫：戴耳機的吉他手起初一臉疑惑，聽到兩次演奏分居左右，眼睛亮了起來。"><figcaption>「欸，這次兩邊都有一把吉他了！」</figcaption></figure>
        <p>把第一次演奏放左邊，第二次放右邊，調到和單軌差不多大聲再聽。兩遍撥弦的細微差異讓左右分得開；最後一下若能一起收住，整段依然俐落。</p>
        <p>把兩軌放回 Bass 和鼓裡再調低頻。若碰到 Kick 時輪廓就不見了，先降低其中一組軌道的低頻或音量，一次改一處。單獨聽比較薄的設定，回到混音裡仍可能保有重量與清晰度。</p>
      </section>
      <section class="section" id="experiment"><h2>悶音的重量和空拍的安靜</h2>
        <p>金屬 Riff 的衝擊感常落在聲音突然收住的瞬間。彈奏時，手掌決定弦能振動多久；雙手停弦後，高增益鏈仍可能留下底噪。Gate 的閾值如果高到把弱音也關掉，空拍雖乾淨，下一個輕起音卻可能少一截。</p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
