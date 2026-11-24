export const effectsQuiz = [
  ["為了保留彈奏起音，壓縮器可以優先比較什麼？", ["固定 Ratio，比較快慢 Attack","固定 Attack，只增加 Makeup Gain","固定輸出，同時提高 Ratio 和 Threshold"], 0, "較慢的 Attack 可能讓一部分起音先通過。固定其他條件才容易聽出差異。"],
  ["第一下回聲的大小和間隔都已合適，想讓後幾下慢一點消失，先改哪個？", ["提高 Mix","提高 Feedback","延長 Time"], 1, "Mix 會改變第一下回聲相對乾音的比例，Time 會改變間隔。提高 Feedback 主要讓後續回聲衰減較慢。"],
  ["哪一個效果典型上是週期性地改變音量？", ["Phaser","Flanger","Tremolo"], 2, "Tremolo 的基本操作是音量調變。Chorus、Flanger 和 Phaser 各用不同方式改變路徑或相位。"],
  ["Reverb 放在重破音 AMP 前，常見的反應是什麼？", ["尾音與原音一起推動失真級","尾音在箱體收音後才加入","只有乾聲會經過失真級"], 0, "AMP 的非線性處理會作用在它接收到的混合訊號。這種黏在一起的聲音也可以是刻意選擇。"],
  ["原音已經在獨立分支，另一條分支只想加殘響。可從哪個設定開始？", ["效果支線先保留一半乾音","效果支線設全 Wet","效果支線只留 Dry 並降低 Level"], 1, "乾音可由原音分支保留，效果分支專送殘響。這樣好控制尾音，也減少重複混入 Dry 的變因。"],
];

const horizon = 2000;
const initial = { time: 300, feedback: 45, mix: 35 };

export function delayEvents(time, feedback, mix) {
  if (!Number.isFinite(time) || time < 100) return [];
  const wet = mix / 100;
  const returned = feedback / 100;
  const events = [];
  if (wet < 1) events.push({ time: 0, amplitude: 1 - wet, dry: true });
  for (let n = 1; n * time <= horizon; n++) {
    const amplitude = wet * returned ** (n - 1);
    if (amplitude < .01) break;
    events.push({ time: n * time, amplitude, dry: false });
  }
  return events;
}

export function mountDelayPractice(root) {
  const fields = Object.fromEntries(Object.keys(initial).map(key => [key, root.querySelector("#delay-" + key)]));
  const timeline = root.querySelector("#delay-timeline");
  const observation = root.querySelector("#delay-observation");

  function paint() {
    const settings = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, Number(field.value)]));
    for (const [key, value] of Object.entries(settings)) {
      root.querySelector("#delay-" + key + "-value").textContent = value + (key === "time" ? " ms" : "%");
    }
    const echoes = delayEvents(settings.time, settings.feedback, settings.mix);
    timeline.innerHTML = echoes.map(event => `<i class="echo-pulse${event.dry ? " is-dry" : ""}" style="--position:${event.time / horizon * 100}%;--height:${event.amplitude * 100}%"></i>`).join("");
    const repeats = echoes.filter(event => !event.dry);
    const dry = echoes.find(event => event.dry);
    const measured = repeats.map(event => event.time + " ms（" + Math.round(event.amplitude * 100) + "%）");
    observation.textContent = "乾音 " + (dry ? Math.round(dry.amplitude * 100) : 0) + "%。" +
      (measured.length ? "圖中回聲：" + measured.join("、") + "。" : "圖中沒有達到顯示門檻的回聲。");
  }

  root.addEventListener("input", paint);
  root.querySelector("#delay-reset").addEventListener("click", () => {
    for (const [key, value] of Object.entries(initial)) fields[key].value = String(value);
    paint();
  });
  paint();
}

const routes = {
  before: [["吉他", "Reverb", "AMP", "CAB／IR", "輸出"], "原音與殘響一起進 AMP。失真可能把尾音壓密，也可能帶來你想要的模糊感。"],
  middle: [["吉他", "AMP", "Reverb", "CAB／IR", "輸出"], "AMP 先處理吉他，乾音與殘響一同送入後面的 CAB／IR。若 CAB 和 Reverb 都是單聲道、固定的線性處理，互換結果相同。"],
  after: [["吉他", "AMP", "CAB／IR", "Reverb", "輸出"], "先取得經箱體與收音塑形的訊號，再送入 Reverb。若涉及立體聲路由、調變或非線性處理，就要依實際鏈路做 A/B。"],
};

export function mountReverbPractice(root) {
  const select = root.querySelector("#reverb-placement");
  const route = root.querySelector("#reverb-route");
  function paint() {
    const [chain, note] = routes[select.value];
    route.innerHTML = `<ol>${chain.map(item => `<li${item === "Reverb" ? ' class="reverb-active"' : ""}>${item}</li>`).join("")}</ol><p>${note}</p>`;
  }
  select.addEventListener("change", paint);
  paint();
}

const asset = name => new URL("./art/" + name, import.meta.url).href;
const slider = (key, label, min, max, step) => `<label for="delay-${key}"><span>${label}<output id="delay-${key}-value" for="delay-${key}"></output></span><input id="delay-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${initial[key]}"></label>`;

export function effectsLesson({ previous, next, course, quiz, note, completion, listeningExercise }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#dynamics">動態與破音</a><a href="#modulation">四種調變</a><a href="#delay">Delay 時間軸</a><a href="#reverb">Reverb 擺位</a><a href="#experiment">實機練習</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 06</p><h1>動態、調變與空間效果</h1>
        <p class="lede">一個音可以被壓平、搖晃、重複，也可以在房間裡多留一下。先分清它改變的是起音、音色的移動，還是你停手以後的尾巴。</p>
      </header>
      <section id="dynamics" class="section"><h2>先決定要保留多少彈奏力道</h2>
        <p>壓縮器（Compressor）在超過 <strong>Threshold</strong> 的區域減少電平變化。理想穩態下，<strong>Ratio</strong> 4:1 表示高過閾值 4 dB 的輸入變化，輸出約只增加 1 dB。<strong>Attack</strong> 決定壓縮跟上的速度，<strong>Release</strong> 決定增益回復的速度。若輕彈和重彈太接近，先對照旁路，再檢查壓縮量與補償音量。<a href="https://articles.boss.info/five-creative-ways-to-use-a-compressor-pedal-for-guitar/">BOSS 壓縮器實例</a></p>
        <p>Overdrive 常追求較輕或較有彈奏反應的破音，Distortion 常用在較明顯的削波與厚度，Fuzz 常追求更強烈或特殊的顆粒。名稱會重疊，實際比較起音、和弦分離和把琴上 Volume 轉小後的變化更有用。</p>
      </section>
      <section id="modulation" class="section"><h2>都是在搖，搖的東西不同</h2>
        <dl class="amp-controls-list">
          <dt>Chorus</dt><dd>把短延遲調變的聲音和原音混在一起，常聽到雙重感與微幅音高搖晃。</dd>
          <dt>Flanger</dt><dd>更短的變動延遲與原音混合，常有掃過去的梳狀濾波感。部分模型有 Feedback。</dd>
          <dt>Phaser</dt><dd>調變相位網路，與原音混合後形成移動的頻率凹陷。</dd>
          <dt>Tremolo</dt><dd>主要是週期性的音量起伏。先聽節奏，再用 Rate 和 Depth 調速度與起伏大小。</dd>
        </dl>
      </section>
      <section id="delay" class="section"><h2>Delay：回聲隔多久、會剩多少</h2>
        <p><strong>Time</strong> 決定回聲間隔，<strong>Feedback</strong> 決定回送比例，<strong>Mix</strong> 設定原音（Dry）與效果音（Wet）的混合。想把四分音符對到節拍時，120 BPM 的一拍是 500 ms，八分音符則是 250 ms。<a href="https://articles.boss.info/the-delay-pedal-glossary/">BOSS Delay 術語</a></p>
        <div class="echo-audition"><figure class="amp-illustration">
          <img src="${asset("delay-echoes-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手彈著白色 Les Paul，旁邊用逐漸淡去的音符畫出回聲。">
        </figure>
          ${listeningExercise("delay")}
        </div>
        <div class="console" id="delay-lab">
          <div class="section-head"><h3>撥一下之後的兩秒</h3><span class="tag">回聲示意 · 無音訊</span></div>
          <div class="gain-sliders">${slider("time","Time",100,800,50)}${slider("feedback","Feedback",0,80,5)}${slider("mix","Mix",0,100,5)}</div>
          <div class="echo-plot" aria-hidden="true"><div id="delay-timeline"></div><div class="echo-axis"><span>0 ms</span><span>1,000 ms</span><span>2,000 ms</span></div></div>
          <p class="muted">深藍是原音，紫色是回聲。高度為簡化相對振幅，低於 1% 的回聲省略。</p>
          <p id="delay-observation" role="status" class="amp-observation"></p>
          <button type="button" class="secondary" id="delay-reset">重置 Delay</button>
        </div>
      </section>
      <section id="reverb" class="section">
        <h2>Reverb：先想尾音經過哪些處理</h2><p>Room 常用來加近距離的空間感，Plate 常用來加密集的尾音，Hall 常用來做更大的空間感。<strong>Decay</strong> 影響尾音長短，<strong>Pre-delay</strong> 讓乾音的起音與殘響開始錯開。</p>
        <div class="console" id="reverb-lab">
          <div class="section-head"><h3>移動 Reverb</h3><span class="tag">串聯示意</span></div>
          <label>放置位置 <select id="reverb-placement"><option value="before">AMP 前</option><option value="middle">AMP 後、CAB／IR 前</option><option value="after">CAB／IR 後</option></select></label>
          <div class="diagram monitor-route" id="reverb-route" aria-live="polite"></div>
        </div>
        <p>在實體音箱裡，效果迴路通常在前級和後級之間，仍會經過後級與實體喇叭。錄音後製的 Reverb 則可以在收完音之後才加。綜合效果器能移到哪裡，要看它的數位路由和 Block 限制。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方路由與模組規格</a></p>
        <p>串聯通常讓 Block 自己混 Dry／Wet。並聯如果已有獨立乾音路徑，效果分支可從全 Wet 或 Kill Dry 起步，再用分支 Level 調整比例。若兩支線都送出乾音，合流後要留意音量與相位。</p>
      </section>
      <section id="experiment" class="section"><h2 id="lead-echo">回聲留在空拍，下一句還能清楚進來</h2>
        <p>把節奏 Preset 另存成 Lead，在 AMP／CAB 後開一顆 Delay。先固定 Time 和 Mix，彈一句 Solo，空一拍再接下一句。若聽到好幾聲回音疊到下一句，逐步退 Feedback；若只有第一聲回音就搶過撥弦，先還原 Feedback，改退 Mix。彈回原速度，聽清下一句的第一個音，再儲存。</p>
        <p>沿用<a href="../00/index.html#goal">第 00 章的四拍 Riff</a>。第 3 拍刷短和弦，第 4 拍停弦，下一輪按原速度接回第 1 拍。</p>
        <ol><li>固定同一個 AMP、CAB／IR、監聽與演奏。Delay 先以低 Mix 測 Time 和 Feedback，每次只改一個。</li><li>換成 Reverb。若你的效果器允許，先把 RVB 放在 AMP 前和後各試一次。維持同樣的 Decay、Mix 與聽感音量。</li><li>聽空拍還剩多少尾音，下一輪第 1 拍的起音是否仍清楚。記下效果位置、唯一改動，以及尾音有沒有蓋過下一輪的起音。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：Gain Staging 增益結構</a><a href="${next}">下一章：訊號鏈設計實驗室</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
