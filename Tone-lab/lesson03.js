export const ampQuiz = [
  ["想知道 AMP 模型的變化，第一輪應如何安排？", ["固定 CAB，比兩顆 AMP 並對齊音量","兩顆 AMP 各搭慣用箱體再對齊音量","固定兩顆 AMP 的 Gain 與 Master 刻度"], 0, "固定 CAB／IR 才能縮小差異來源。各用原廠搭配適合比較完整組合。不同模型的 Gain 刻度相同，響度和破音仍可能不同。"],
  ["何謂 Edge of Breakup？", ["輕重都乾淨，只有尾音變長","輕彈乾淨，重彈剛開始破","輕重都破，後端音量剛好"], 1, "破音邊緣描述的是輸入和 AMP 如何互動。換 Pickup 或改變彈奏力度都可能讓反應不同。"],
  ["想讓破音特性接近原來，只把 A/B 音量拉到接近，先找哪一類控制？", ["失真級之前的 Input Trim","會推動模擬後級的 Master","失真級之後的 Level"], 2, "某些 Master 會改變後級工作點。先用裝置說明確認哪個 Level 適合做音量匹配。"],
  ["為什麼兩個 AMP 都把 Treble 設在中間，亮度仍可能差很多？", ["音色電路與作用位置不同","相同刻度代表相同高頻增益","Treble 只改變後端輸出音量"], 0, "不同模型可能有不同音色電路、頻帶和前後級配置。旋鈕刻度是設定值，並非跨模型標準。"],
  ["想比較 Sag 對起音與回彈的影響，怎樣做較有意義？", ["換後級模型，同時比較兩種 Sag","固定模型與演奏，只改 Sag","固定旋鈕數值，改用另一顆拾音器"], 1, "Sag 和模型工作點有關。固定其他條件，換不同力度重彈，才能觀察起音與延音的差異。"],
];

const modelNames = ["高餘裕 Clean · 如 JAZZ CLEAN", "早起破音 Crunch · 如 PLEXI 45", "多級增益 High Gain · 如 DUAL RECT"];
const driveNames = ["偏低", "中等", "偏高"];
const behaviorNames = ["較乾淨", "接近破音邊緣", "有明顯 Crunch", "較飽和"];
const softBehavior = [[0, 0, 1], [0, 1, 2], [1, 2, 3]];
const hardBehavior = [[0, 1, 2], [1, 2, 3], [2, 3, 3]];
const ampControls = {
  Master: ["可能較少推動被模擬的後級，弱音的音量也可能下降。", "若模型讓 Master 推動後級，重彈時可能多一些壓縮或破音。先用後端 Level 對齊音量。"],
  Bass: ["聽低弦悶音是否收得較快，和弦有沒有變薄。", "聽低弦是否更飽滿。若這個 EQ 在失真前，也要留意起音會不會變鬆。"],
  Mid: ["和弦可能少一些厚度。在伴奏裡確認音高還能不能分辨。", "和弦可能更容易在伴奏裡辨認。也聽聽是否變得太集中或帶鼻音。"],
  Treble: ["聽撥弦是否較柔和，以及輕彈的輪廓有沒有一起消失。", "聽撥弦是否更清楚。重彈時再注意是不是多了不想要的尖銳感。"],
  Presence: ["若模型支援，後級的高頻存在感可能下降。與 Treble 分開試。", "某些模型會增加後級的高中頻或高頻存在感。受模型與 CAB／IR 影響。"],
};

export function ampExample(model, drive, picking) {
  const soft = softBehavior[model][drive];
  const hard = hardBehavior[model][drive];
  const light = picking === "light";
  const result = light ? soft : hard;
  const comparison = soft === hard
    ? "這個例子中，輕彈和重彈落在同一類反應，仍可能有起音、音量或延音差異。"
    : "同樣的 Gain，另一種力道是「" + behaviorNames[light ? hard : soft] + "」。";
  return { result: behaviorNames[result], comparison };
}

export function mountAmpPractice(root) {
  const model = root.querySelector("#amp-model");
  const drive = root.querySelector("#amp-drive");
  const picking = root.querySelector("#amp-picking");
  const answer = root.querySelector("#amp-result");
  const description = root.querySelector("#amp-description");
  const control = root.querySelector("#amp-control");
  const direction = root.querySelector("#amp-direction");
  const controlCue = root.querySelector("#amp-control-cue");
  function paint() {
    const example = ampExample(Number(model.value), Number(drive.value), picking.value);
    answer.textContent = example.result;
    description.textContent = example.comparison;
    controlCue.textContent = direction.value === "base"
      ? "先聽原設定，固定模型、Gain 和 CAB／IR，再選擇往下或往上調。"
      : ampControls[control.value][Number(direction.value)];
  }
  root.addEventListener("change", paint);
  root.querySelector("#amp-reset").addEventListener("click", () => {
    model.value = "1";
    drive.value = "1";
    picking.value = "light";
    control.value = "Master";
    direction.value = "base";
    paint();
  });
  paint();
}

const asset = name => new URL("./assets/" + name, import.meta.url).href;
const options = (names, active) => names.map((name, index) =>
  `<option value="${index}" ${index === active ? "selected" : ""}>${name}</option>`
).join("");

export function ampLesson({ quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#amp-stages">AMP 前後級</a><a href="#dynamics">彈奏力道</a><a href="#controls">Gain 與旋鈕</a><a href="#amp-practice">固定 CAB 比較</a><a href="#experiment">破音有力，和弦也要分得開</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 04 章</p><h1>AMP 擴大機建模</h1>
        <p class="lede">同一把 Les Paul，可以輕彈乾淨、重彈帶一點毛邊，也可以一碰弦就進入厚實破音。讓箱體留在原位，再刷一次同樣的和弦。輕重之間多出來的那層沙啞，就是挑音箱的線索。</p>
      </header>
      <section id="amp-stages" class="section"><h2>擴大機的前級與後級</h2>
        <p>實體音箱裡，前級接收微弱的吉他訊號，把它放大、塑形，也能產生失真；後級再提供驅動喇叭的功率。以 Marshall 2203 復刻機頭為例，兩段各有各的真空管。MG-50Li 的 TS/AC-4K 也把前後級分開建模，所以選好 AMP 之後，仍有後級管型可以影響聲音。<a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 說明</a></p>
        <div class="diagram monitor-route"><ol><li>吉他訊號</li><li>前級 · 放大與塑形</li><li>後級 · 驅動與動態</li><li>CAB／IR · 箱體與收音</li></ol></div>
        <p>Modeling 用演算法重現這些反應，Profiling 則根據測試訊號和設備輸出建立模型。以 MG-50Li 為例，NUX 同時提供 TS/AC-4K 與 Deep Image，並介紹可分開模擬前級、後級的設計。可調項目依你選的模型或模式而定。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方建模說明</a></p>
      </section>
      <section id="dynamics" class="section"><h2>先聽你的手，再看 Gain 刻度</h2>
        <figure class="amp-illustration">
          <img src="${asset("amp-picking-dynamics-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="">
          <figcaption><span>同一個和弦輕撥時，聽弦音清楚的開頭。</span><span>加重下撥，聽音頭多出的那層毛邊。</span></figcaption>
        </figure>
        <p>彈奏動態（Picking Dynamics）最容易用同一個音反覆測。Clean 通常還有足夠餘裕，輕重差主要表現在起音和音量；在破音邊緣（Edge of Breakup），輕彈可能仍乾淨，重彈才長出毛邊。再往上會進入 Crunch 或更飽和的 High Gain，音量差可能變小，但起音、延音和顆粒仍可能不同。</p>
        <p>British 與 American 常用來描述某些音箱家族的音色傾向。實際可先聽中頻落點、低頻鬆緊和起音，再決定要不要用那個模型。</p>
        <p>Les Paul 上的 Volume 在 AMP 前面。當 AMP 正好靠近破音邊緣，琴上音量收一點，和弦就比較乾淨；推回去，單音的毛邊又冒出來。整段從節奏走到短 Solo，腳下可以留在同一個 Preset。</p>
      </section>
      <section id="controls" class="section">
        <h2>Gain、Master、Level 各管哪裡？</h2><figure class="gear-inset" id="giant-dial"><img src="${new URL("./assets/giant-dial.webp", import.meta.url).href}" width="800" height="800" loading="lazy" decoding="async" alt="她使勁扳動音箱上比人還大的旋鈕；回到桌前，只用一根手指就轉了一格。"></figure>
        <p>Marshall JCM800 2203 面板上有兩顆寫著 Volume 的旋鈕。<strong>Preamp Volume</strong> 推高時，重刷和弦更容易起毛邊；<strong>Master Volume</strong> 控制送往後級的電平，前級已經形成的破音仍會留下。回到 MG，如果節奏音色的粗糙感剛好，只想讓獨奏大聲一點，V1.1.1 的 Preset Volume 就能調整整組音色的音量。<a href="https://www.marshall.com/us/en/product/jcm800-2203-vintage-reissue-head">Marshall 2203 面板與規格</a> · <a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 說明</a></p>
        <dl class="amp-controls-list">
          <dt>Gain／Drive</dt><dd>常用來調前級被推動的程度。先用小幅調整聽破音和起音怎麼變。</dd>
          <dt>Master</dt><dd>在有模擬這一段的模型裡，可能改變推進後級的程度。名稱相同，電路配置也可能不同。</dd>
          <dt>Channel Volume／Block Level</dt><dd>若確認是失真級之後的音量，可用來做 A/B 音量匹配。Output Volume 則要看是這條鏈的輸出還是全域音量。</dd>
          <dt>Bass／Mid／Treble</dt><dd>塑造頻譜。EQ 若在失真前，還可能改變哪段頻率先推進失真。不同模型的同一刻度無法直接對照。</dd>
          <dt>Presence／Resonance</dt><dd>某些機型藉後級回授改變高頻存在感或低頻力度，實作和可調範圍依設備而異。</dd>
        </dl>
        <p>想用具體頻率比對刺耳、混濁或低弦鬆散，可以到<a href="../11/index.html#frequency-explorer">頻帶探索</a>。</p>
        <div class="callout"><h3>Sag 與 Bias 先小幅試</h3><p>Sag 對應供電在重負載時下沉的一類反應，可能帶來較軟的起音和回彈。Bias 對應管子的工作偏壓，可能改變失真及動態。例如 MG 的 BRIT 800 提供 BIAS。固定 GAIN 與 MASTER 後，比較同一個低音的起音與回彈。<a href="https://nux.cherubtechnology.com/download/Manual/Effects/Multi_Effects/MG50Li/NUX_MG50Li_UserManual_English.pdf#page=15">NUX AMP 參數表</a></p></div>
      </section>
      <section id="amp-practice" class="section"><h2>固定 CAB／IR，只比較 AMP</h2>
        <p>先保持同一把琴、同一個 Pickup、同一個 CAB／IR 和監聽路徑。選一種 AMP 傾向和 Gain 工作點，再切輕彈與重彈，看看你可以預期什麼。</p>
        <div class="console" id="amp-lab">
          <div class="section-head"><h3>AMP 反應示意</h3><span class="tag">概念示意 · 無音訊</span></div>
          <p class="amp-fixed"><strong>CAB／IR 固定</strong> · 2×12 示意箱體</p>
          <div class="rig-controls">
            <label>AMP 傾向 <select id="amp-model">${options(modelNames, 1)}</select></label>
            <label>Gain <select id="amp-drive">${options(driveNames, 1)}</select></label>
            <label>彈奏力道 <select id="amp-picking"><option value="light">輕彈</option><option value="hard">重彈</option></select></label>
            <button type="button" class="secondary" id="amp-reset">重置</button>
          </div>
          <div class="amp-observation" role="status"><p>示意反應：<strong id="amp-result"></strong></p><p id="amp-description"></p></div>
          <h4>固定其他設定，只試一顆旋鈕</h4>
          <div class="rig-controls">
            <label>旋鈕 <select id="amp-control">${Object.keys(ampControls).map(key => `<option>${key}</option>`).join("")}</select></label>
            <label>相對原設定 <select id="amp-direction"><option value="base">原設定</option><option value="0">略降</option><option value="1">略升</option></select></label>
          </div>
          <p class="amp-observation" id="amp-control-cue" role="status"></p>
        </div>
        <p class="muted">這個互動用類型幫你建立聆聽假設。因實機模型、輸入和演奏而不同的破音門檻及聽感，留給下方實作驗證。</p>
      </section>
      <section class="section" id="experiment"><h2 id="rhythm-gain">破音有力，和弦也要分得開</h2>
        <p>同一顆 AMP 彈單音時，厚一點的失真能讓尾音更飽滿。換成整個和弦，多條弦同時進入失真級，會產生額外的頻率成分。Gain 越高，內聲部的走向就越容易被蓋住。這也是節奏吉他常比獨奏少用一點 Gain 的原因。</p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
