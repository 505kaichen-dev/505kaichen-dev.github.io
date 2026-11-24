export const cabQuiz = [
  ["想知道收音位置的影響，哪種比較最容易判讀？", ["固定單體和角度，平移麥克風","對準同一點，更換麥克風型號","固定距離，平移時一起轉向"], 0, "一次只動位置，後續才容易把差異歸因到這個變數。平移和轉向可以分開測。"],
  ["看到 4×12，能確定什麼？", ["每顆單體使用四支麥克風","四顆 12 吋單體","四個可獨立切換的箱體模型"], 1, "數字表示單體數量和尺寸。單體、結構、收音與混音方式才會共同決定聽感。"],
  ["一份靜態線性 CAB IR 能重現哪類行為？", ["單體隨驅動電平改變的失真","後級電源受強音影響的下沉","一次收音的頻率與時間響應"], 2, "卷積會依固定響應處理訊號。會隨電平或溫度改變的非線性反應需要另外建模。"],
  ["兩份 IR 混起來反而變薄，應該先查什麼？", ["兩份 IR 的時間對齊與極性","兩個 IR 檔案的平均大小","兩個檔名標出的箱體尺寸"], 0, "同一訊號經過不同路徑後，疊加時可能在某些頻率相消。先確認對齊和極性，再判斷是否值得混合。"],
  ["接到實體吉他音箱的 Return 後，由吉他喇叭發聲。先怎麼測？", ["固定 CAB，同時換前級和後級","固定音量，比較 CAB 開與關","只比較耳機輸出的箱體音色"], 1, "實體吉他喇叭已有自己的頻率響應，常由旁路模擬箱體開始，但是否保留仍看接法和想要的結果。"],
];

const cabinets = {
  single: ["1×12", 1, "一顆 12 吋單體。箱體可以是開背或封閉，單體和箱體尺寸仍會影響低頻與擴散。"],
  twin: ["2×12", 2, "兩顆 12 吋單體。並排或直排、同款或混裝都可能改變聽感。實錄時也可能只收其中一顆。"],
  quad: ["4×12", 4, "四顆 12 吋單體。近距離只收一顆，與站在箱體前聽四顆的合成聲場，可能是兩回事。"],
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
    result.textContent = size + " · " + position + "。 " + micCue + " " + cabinetCue;
    baseline.textContent = "A · " + cabinets[saved.cab][0] + "／" + micPositions[saved.pos][0] + "　B · " + size + "／" + position;
    response.textContent = saved.cab !== cab.value
      ? "換了箱體。記下收音條件，在實機聽同一段和弦。"
      : saved.pos === pos.value ? "A 和 B 的位置相同。移動 B，再聽第 3 拍。"
      : "比較第 3 拍：哪個位置的撥弦聲比較柔？和弦裡的高音弦還聽得見嗎？";
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

export function cabLesson({ previous, next, course, quiz, note, completion, listeningExercise }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#cabinets">箱體與喇叭</a><a href="#microphone">麥克風位置</a><a href="#ir">IR 怎麼工作</a><a href="#cab-practice">固定 AMP 比較</a><a href="#experiment">實機練習</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 04</p><h1>CAB、Speaker、Mic、IR</h1>
        <p class="lede">先別動 AMP。把麥克風往喇叭外圈移一點，原本太刺的 Riff 就可能好聽很多。這章要拆開你聽到的箱體、喇叭與收音。</p>
      </header>
      <section id="cabinets" class="section"><h2>CAB 是箱體，Speaker 是單體</h2>
        <p>在實體設備上，擴大機（AMP）的後級驅動喇叭單體（Speaker），單體裝在箱體（CAB）裡。兩者會一起影響頻率響應與聲音傳播方向。同一顆 AMP 換一個箱體組合，失真音色的亮度、低頻與中頻輪廓都可能改變。在效果器介面上，CAB 也可能指包含收音在內的模擬區塊。</p>
        <p>1×12、2×12、4×12 表示 12 吋單體有幾顆。箱體開背或封閉、容積、選用的單體、排列和收音位置都會改變結果。看到尺寸時，可以先問「收了哪一顆、從哪裡收」，再用耳朵比較。</p>
      </section>
      <section id="microphone" class="section"><h2>平移、轉向和拉遠，分開比較</h2>
        <p><strong>位置</strong>是麥克風落在中央、防塵帽邊界或紙盆外圈的哪裡。<strong>角度</strong>是收音軸怎麼轉，<strong>距離</strong>是麥克風離網罩或單體多遠。換麥克風型式，也會改變頻率、指向性與對起音的反應。</p>
        <p>以常見動圈麥克風近收為例，可先比較中央的起音輪廓與移向外圈後的柔和度。這是聆聽方向，實際上會因單體、麥克風和間距而變。部分指向性麥克風貼得很近時會有近講效應，拉遠則可能收進更多房間反射。<a href="https://www.shure.com/en-US/docs/guide/sm57">Shure SM57 原廠收音示例</a></p>
      </section>
      <section id="ir" class="section"><h2>IR 留下的是那次收音條件下的響應</h2>
        <p>脈衝響應（Impulse Response，IR）描述系統對理想脈衝的反應。吉他箱體 IR 常包含喇叭、箱體、麥克風和量測路徑。處理器用卷積把這個固定響應套用到輸入訊號，重現該量測條件下的頻率和時間特性。<a href="https://celestion.com/blog/celestion-speaker-ir-the-difference-a-mic-makes/">Celestion 的不同麥克風與 IR 範例</a></p>
        <p>固定線性 IR 無法單靠自身重現單體隨音量或溫度改變的非線性失真與壓縮。動態模擬可以用額外模型處理這些變化，實作依產品而定。</p>
        <div class="callout"><h3>混兩份 IR，先聽有沒有互相抵消</h3><p>IR 長度限制能保留多少時間訊息，例如反射的尾段。取樣率則要依裝置可接受的格式，必要時由設備或工具重取樣。混合時先單聽 A、B，再聽兩者疊加；時間偏移或極性差異可能讓某段頻率相消。別只看檔案長度判斷音色。</p></div>
      </section>
      <section id="cab-practice" class="section">
        <h2>固定 AMP，換一樣東西聽</h2><p>先留在 1×12，只換麥克風位置。再把位置切回相同選項，改選箱體，想一下這兩輪各在比較什麼。</p>
        <div class="console" id="cab-lab">
          <div class="section-head"><h3>箱體與麥克風位置示意</h3><span class="tag">概念示意 · 無音訊</span></div>
          <p class="amp-fixed"><strong>AMP 固定</strong> · 同一段 Riff、同一監聽，位置測試維持同一支麥克風、角度與距離</p>
          <div class="mic-desk">
        <figure class="amp-illustration">
          <img src="${asset("cab-mic-placement-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="短紫髮吉他手蹲在吉他箱體旁，調整一支朝向箱體網罩的麥克風。">
          <figcaption class="single-caption">架好麥克風，先保持角度和距離，只沿喇叭正面平移。</figcaption>
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
          <h4>收音響應對照</h4>
          <p class="muted">以下為聆聽假設，無音訊或實測曲線。先將目前組合設為 A，再更換位置或箱體得到 B。</p>
          <button type="button" class="secondary" id="cab-keep-a">將目前組合設為 A</button>
          <p id="cab-baseline" role="status"></p>
          <p id="cab-response" aria-live="polite"></p>
        </div>
        <p class="muted">標記表示麥克風對準喇叭正面的落點。兩張圖不按實物比例，也沒有預測任何頻率曲線。</p>
        ${listeningExercise("cab")}
      </section>
      <section id="experiment" class="section"><h2>到 MG-50Li 聽一次中央與外圈</h2>
        <p>沿用<a href="../00/index.html#goal">第 00 章的四拍 Riff</a>。把注意力放在第 3 拍，聽同一個和弦的撥弦聲是否更柔和，以及外側兩弦是否仍有輪廓。</p>
        <p>NUX 將 Cyber IR 的可調項列為 Microphone、Position 和 Distance。請依你目前選的 IR 或模式與機上選項操作。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方 Cyber IR 說明</a></p>
        <ol><li>固定 AMP、琴、Pickup、監聽和同一段 Riff。在同一個 CAB 下固定 Mic 和 Distance，只改 Position。</li><li>用後端 Level 把兩邊聽感音量拉近，再聽起音、和弦分離度和刺耳感。</li><li>下一輪若要比較箱體，先把位置等收音條件對到盡量相同。比較不得不一起改變的 IR 條件，也記在筆記裡。</li></ol>
        <p>把兩個收音位置、匹配音量的方式，以及第 3 拍的差異寫進筆記。耳機、FRFR 和全頻 PA 通常由保留 CAB／IR 起步。走實體吉他音箱 Return、由吉他喇叭發聲時，常從旁路 CAB／IR 起步，再比較是否要疊色。</p>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：AMP 擴大機建模</a><a href="${next}">下一章：Gain Staging 增益結構</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
