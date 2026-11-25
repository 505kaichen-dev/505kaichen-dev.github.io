export const cabQuiz = [
  ["想知道收音位置的影響，哪種比較最容易判讀？", ["固定單體和角度，平移麥克風","對準同一點，更換麥克風型號","固定距離，平移時一起轉向"], 0, "一次只動位置，後續才容易把差異歸因到這個變數。平移和轉向可以分開測。"],
  ["看到 4×12，能確定什麼？", ["每顆單體使用四支麥克風","四顆 12 吋單體","四個可獨立切換的箱體模型"], 1, "數字表示單體數量和尺寸。單體、結構、收音與混音方式才會共同決定聽感。"],
  ["一份靜態線性 CAB IR 能重現哪類行為？", ["單體隨驅動電平改變的失真","後級電源受強音影響的下沉","一次收音的頻率與時間響應"], 2, "卷積會依固定響應處理訊號。會隨電平或溫度改變的非線性反應需要另外建模。"],
  ["兩份 IR 混起來反而變薄，應該先查什麼？", ["兩份 IR 的時間對齊與極性","兩個 IR 檔案的平均大小","兩個檔名標出的箱體尺寸"], 0, "同一訊號經過不同路徑後，疊加時可能在某些頻率相消。先確認對齊和極性，再判斷是否值得混合。"],
  ["接到實體吉他音箱的 Return 後，由吉他喇叭發聲。先怎麼測？", ["固定 CAB，同時換前級和後級","固定音量，比較 CAB 開與關","只比較耳機輸出的箱體音色"], 1, "實體吉他喇叭已有自己的頻率響應，常由旁路模擬箱體開始，但是否保留仍看接法和想要的結果。"],
];

const cabinets = {
  single: ["1×12", 1, "一顆 12 吋單體。箱體可以是開背或封閉，單體和箱體尺寸仍會影響低頻與擴散。"],
  twin: ["2×12", 2, "兩顆 12 吋單體，MG 的 IR 可參考 AC30+AlnicoBlue。並排或直排、同款或混裝都可能改變聽感。實錄時也可能只收其中一顆。"],
  quad: ["4×12", 4, "MG 可用 MBOS412+V30 對照四顆 12 吋單體的箱體。近距離只收一顆，與站在箱體前聽四顆的合成聲場，可能是兩回事。"],
};

const micPositions = {
  center: ["中央", "可先聽高頻與撥弦輪廓是否比較突出。"],
  cap: ["防塵帽邊界", "可從這裡找起音與柔和度的平衡，再少量往內或往外移。"],
  edge: ["紙盆外圈", "可比較尖銳感是否減少，以及和弦細節有沒有被抹平。"],
};

export function mountCabPractice(root) {
  const cab = root.querySelector("#cab-size");
  const pos = root.querySelector("#cab-position");
  const boxes = root.querySelector("#cab-front");
  const target = root.querySelector("#mic-target");
  const result = root.querySelector("#cab-observation");
  const baseline = root.querySelector("#cab-baseline");
  const response = root.querySelector("#cab-response");
  let saved = { cab: "single", pos: "center" };

  function paint() {
    const [size, count, cabinetCue] = cabinets[cab.value];
    const [position, micCue] = micPositions[pos.value];
    boxes.dataset.cabinet = cab.value;
    boxes.innerHTML = "<i></i>".repeat(count);
    target.dataset.position = pos.value;
    result.textContent = size + " · " + position + "。實機試聽時，" + micCue + " " + cabinetCue;
    baseline.textContent = "A · " + cabinets[saved.cab][0] + "／" + micPositions[saved.pos][0] + "　B · " + size + "／" + position;
    response.textContent = saved.cab !== cab.value
      ? "換了箱體。記下收音條件，在實機聽同一段和弦。"
      : saved.pos === pos.value ? "A 和 B 的收音位置相同。改選 B 的位置，對照圖上麥克風落點。"
      : "把這兩個位置記下來。到實機用同一個和弦各錄一次，比較撥弦起音和高音弦的輪廓。";
  }

  root.addEventListener("change", paint);
  root.querySelector("#cab-keep-a").addEventListener("click", () => {
    saved = { cab: cab.value, pos: pos.value };
    paint();
  });
  root.querySelector("#cab-reset").addEventListener("click", () => {
    cab.value = "single";
    pos.value = "center";
    saved = { cab: "single", pos: "center" };
    paint();
  });
  paint();
}

const asset = name => new URL("./assets/" + name, import.meta.url).href;

export function cabLesson({ quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#cabinets">箱體與喇叭</a><a href="#microphone">麥克風位置</a><a href="#ir">IR 怎麼工作</a><a href="#cab-practice">固定 AMP 比較</a><a href="#experiment">一個箱體，可以有幾種收音？</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 05 章</p><h1>CAB、Speaker、Mic、IR</h1>
        <p class="lede">音箱前的強力和弦厚度剛好，錄下來卻是撥片碰弦那一下特別刺。錄音師可以留住音箱設定，只移動喇叭前的麥克風。效果器裡的箱體和收音位置，也給了這種選擇。</p>
      </header>
      <section id="cabinets" class="section"><h2>CAB 是箱體，Speaker 是單體</h2><figure class="gear-inset" id="cabinet-tower"><img src="${new URL("./assets/cabinet-tower.webp", import.meta.url).href}" width="700" height="1050" loading="lazy" decoding="async" alt="她拎著迷你音箱，在高聳的箱體牆前仰頭張望。"></figure>
        <p>在實體設備上，擴大機（AMP）的後級驅動喇叭單體（Speaker），單體裝在箱體（CAB）裡。兩者會一起影響頻率響應與聲音傳播方向。同一顆 AMP 換一個箱體組合，失真音色的亮度、低頻與中頻輪廓都可能改變。在效果器介面上，CAB 也可能指包含收音在內的模擬區塊。</p>
        <p>Marshall 1960A 是一座箱體，裡面裝了四顆 12 吋 Celestion G12T-75。於是「1960A」說的是箱體型號，「4×12」交代數量與尺寸，「G12T-75」才指向單體。讀 MG 的箱體或 IR 名稱時，光看 4×12 還無法知道裡頭是哪種喇叭。<a href="https://www.marshall.com/us/en/product/1960a-4x12-angled-cabinet">Marshall 1960A 喇叭配置</a></p>
      </section>
      <section id="microphone" class="section"><h2>把麥克風從中央移往外圈，刷弦會怎麼變？</h2>
        <p><strong>位置</strong>是麥克風落在中央、防塵帽邊界或紙盆外圈的哪裡。<strong>角度</strong>是收音軸怎麼轉，<strong>距離</strong>是麥克風離網罩或單體多遠。換麥克風型式，也會改變頻率、指向性與對起音的反應。</p>
        <p>想像一支 Shure SM57 架在箱體網罩前。同樣貼近喇叭，從中央往紙盆外圈挪，刷弦的亮邊往往會柔和一些。MG-50Li 的 Cyber IR 把錄音師的三個動作搬上畫面：換一支麥克風是 <strong>Microphone</strong>，沿著紙盆移動是 <strong>Position</strong>，把整支麥克風往後拉是 <strong>Distance</strong>。其中只有最後一個動作改變了收音距離。<a href="https://www.shure.com/en-US/docs/education/microphone-techniques-for-recording">Shure 箱體收音指南</a> · <a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 說明</a></p>
        
      </section>
      <section id="ir" class="section"><h2>IR 留下的是那次收音條件下的響應</h2>
        <p>脈衝響應（Impulse Response，IR）描述系統對理想脈衝的反應。吉他箱體 IR 常包含喇叭、箱體、麥克風和量測路徑。處理器用卷積把這個固定響應套用到輸入訊號，重現該量測條件下的頻率和時間特性。<a href="https://celestion.com/blog/celestion-speaker-ir-the-difference-a-mic-makes/">Celestion 的不同麥克風與 IR 範例</a></p>
        <p>固定線性 IR 無法單靠自身重現單體隨音量或溫度改變的非線性失真與壓縮。動態模擬可以用額外模型處理這些變化，實作依產品而定。</p>
        <div class="callout"><h3>兩路各自聽都很厚，混起來怎麼反而薄了？</h3><p>同一顆音箱用兩支麥克風收音，各自獨聽都有低頻，推起第二路時，和弦的底卻可能凹下去。兩路收進同一個音的時間略有差異，混合時某些頻率就可能互相抵消。箱體 IR 也保留了收音的時間特徵。在 MG-50Li 裡，若同一顆 AMP 分送 M 1960+G12M 和 MBOS412+V30，合流後才出現的凹陷，就值得回頭聽兩路的比例和相位關係。</p></div>
      </section>
      <section id="cab-practice" class="section">
        <h2>固定 AMP，看兩種收音設定差在哪裡</h2><p>圖上先留在 1×12，只換麥克風位置。用 MG 對照時可選 IR 的 FPrice112+Ten30，在同一箱體內移動 Position，聽撥片起音的亮度。再把位置切回相同選項，改選箱體，想一下這兩輪各在比較什麼。</p>
        <div class="console" id="cab-lab">
          <div class="section-head"><h3>箱體與麥克風位置示意</h3><span class="tag">概念示意 · 無音訊</span></div>
          <p class="amp-fixed"><strong>AMP 固定</strong> · 同一段 Riff、同一監聽，位置測試維持同一支麥克風、角度與距離</p>
          <div class="mic-desk">
        <figure class="amp-illustration">
          <img src="${asset("cab-mic-placement-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="短紫髮吉他手蹲在吉他箱體旁，調整一支朝向箱體網罩的麥克風。">
          <figcaption class="single-caption">同一個和弦、同一顆音箱。只把麥克風往喇叭外圈挪一點，再聽撥片碰弦的那一下。</figcaption>
        </figure>
          <div class="rig-controls">
            <label>箱體 <select id="cab-size"><option value="single">1×12</option><option value="twin">2×12</option><option value="quad">4×12</option></select></label>
            <label>收音位置 <select id="cab-position"><option value="center">中央</option><option value="cap">防塵帽邊界</option><option value="edge">紙盆外圈</option></select></label>
            <button type="button" class="secondary" id="cab-reset">重置</button>
          </div>
          </div>
          <div class="cab-visuals" aria-hidden="true">
            <div><p>箱體正面</p><div id="cab-front" class="cab-front"></div></div>
            <div><p>單體正面 · 收音位置</p><div id="mic-target" class="mic-target"><i class="mic-dot"></i></div></div>
          </div>
          <p class="amp-observation" id="cab-observation" role="status"></p>
          <h4>A、B 收音設定對照</h4>
          <p class="muted">以下為聆聽假設，無音訊或實測曲線。先將目前組合設為 A，再更換位置或箱體得到 B。</p>
          <button type="button" class="secondary" id="cab-keep-a">將目前組合設為 A</button>
          <p id="cab-baseline" role="status"></p>
          <p id="cab-response" aria-live="polite"></p>
        </div>
        <p class="muted">標記表示麥克風對準喇叭正面的落點。兩張圖不按實物比例，也沒有預測任何頻率曲線。</p>
        <p>要比較收音位置，可以用同一段乾錄吉他重放兩次，固定 AMP、箱體和麥克風，只改收音位置。把兩版錄下來，對齊起點與聽感音量，再<a href="../../labs/index.html#audio-ab">用自己的錄音做 A/B</a>。</p>
      </section>
      <section class="section" id="experiment"><h2>一個箱體，可以有幾種收音？</h2>
        <p>Punk 副歌裡，連刷的強力和弦需要一點亮邊才能穿過鼓聲。同一顆喇叭，近距離收中央通常比較亮，往紙盆外圈移，撥片的尖銳感往往會收一些。MG-50Li 的 Cyber IR 把麥克風、位置和距離列成不同選項，正好對應這三件事。<a href="https://nuxaudio.com/product/mg50li/">NUX 的 Cyber IR 說明</a></p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
