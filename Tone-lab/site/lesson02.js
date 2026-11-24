export const rigQuiz = [
  ["同一首歌的節奏和 Solo 共用 AMP 和 CAB，只想一起切 Boost 與 Delay。支援時先試什麼？", ["叫回同一 Preset 的 Scene","切換一組全域輸出設定","旁路整條 Preset 訊號鏈"], 0, "Scene 可以召回同一套 Preset 裡的一組狀態。先確認你的機器能讓 Scene 控哪些項目。"],
  ["原本是 Overdrive → AMP。交換兩顆之後，吉他訊號先進哪一顆？", ["Overdrive","AMP","兩顆並聯接收"], 1, "串聯時，上游的輸出是下游的輸入。移動順序會改變加強或失真的位置。"],
  ["Delay 已設好參數，現在只想暫時不讓它處理音訊。該做什麼？", ["把 Feedback 調到零","把 Delay Time 調到最短","旁路 Delay"], 2, "旁路停用這個位置的處理，通常保留參數。尾音如何處理要看裝置與設定。"],
  ["每個 Preset 接到同一套 PA 都整體偏亮。已排除接線與 PA 設定後，優先檢查什麼？", ["檢查該輸出的全域 EQ","分別修改每個 Lead 的前級 Gain","逐一降低所有 Delay 的 Mix"], 0, "全域調整適合處理跨音色的共同偏差，也會影響其他使用同一輸出的 Preset。"],
  ["要用外部 MIDI 控制器叫出某個 Preset，哪個描述正確？", ["把控制器送出的 Tempo 對齊歌曲","核對 Program Change 與 MIDI 通道","把表情踏板校正到完整行程"], 1, "Program Change 是控制訊息。裝置支援、通道和映射需要對照手冊或設定。"],
];

const rigs = {
  rock: {
    label: "Rock Rig",
    chain: [["od", "Overdrive"], ["amp", "British AMP"], ["cab", "4×12 IR"], ["delay", "Delay"], ["reverb", "Room Reverb"]],
    scenes: {
      rhythm: ["amp", "cab", "reverb"],
      lead: ["od", "amp", "cab", "delay", "reverb"],
    },
  },
  clean: {
    label: "Clean Rig",
    chain: [["comp", "Compressor"], ["amp", "Clean AMP"], ["cab", "2×12 IR"], ["delay", "Delay"], ["reverb", "Plate Reverb"]],
    scenes: {
      rhythm: ["comp", "amp", "cab", "reverb"],
      lead: ["comp", "amp", "cab", "delay", "reverb"],
    },
  },
};

export function mountRigPractice(root) {
  const preset = root.querySelector("#rig-preset");
  const scene = root.querySelector("#rig-scene");
  const blocks = root.querySelector("#rig-blocks");
  const summary = root.querySelector("#rig-summary");
  let enabled = new Set();

  function paint() {
    const rig = rigs[preset.value];
    blocks.innerHTML = rig.chain.map(([id, label]) => {
      const on = enabled.has(id);
      return `<li><button type="button" class="rig-block" data-block="${id}" aria-label="${label} 啟用" aria-pressed="${on}"><strong>${label}</strong><span>${on ? "啟用" : "旁路"}</span></button></li>`;
    }).join("");
  }

  function recall(message) {
    enabled = new Set(rigs[preset.value].scenes[scene.value]);
    paint();
    summary.textContent = message;
  }

  preset.addEventListener("change", () => {
    scene.value = "rhythm";
    recall("已載入 " + rigs[preset.value].label + " 的 Rhythm。整套 Block 清單已重新載入。");
  });
  scene.addEventListener("change", () => {
    recall("已切換 Scene。Block 順序和模型保留，開關狀態依 Scene 重新載入。");
  });
  blocks.addEventListener("click", event => {
    const button = event.target.closest("button[data-block]");
    if (!button) return;
    const id = button.dataset.block;
    const on = !enabled.has(id);
    if (on) enabled.add(id);
    else enabled.delete(id);
    button.setAttribute("aria-pressed", String(on));
    button.lastElementChild.textContent = on ? "啟用" : "旁路";
    summary.textContent = button.firstElementChild.textContent + (on ? " 已啟用。" : " 已旁路。") + " 再叫回 Scene 會還原這次的暫時變更。";
  });
  root.querySelector("#rig-recall").addEventListener("click", () => {
    recall("已重新叫回這個 Scene 的開關狀態。");
  });
  recall("試著切換 Scene，看看哪些 Block 的啟用狀態改變。");
}

export function rigLesson({ previous, next, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#blocks">讀懂 Block</a><a href="#routing">看懂路由</a><a href="#rig">Preset 與 Scene 實驗</a><a href="#controls">腳下的控制</a><a href="#experiment">實機練習</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 02</p><h1>綜合效果器的內部世界</h1>
        <p class="lede">節奏彈得正起勁，下一拍就要進 Solo。你可以開一顆 Boost、叫回一組 Scene，或切到另一個 Preset。先弄清每種動作會改變哪一段，台上才知道要踩哪顆。</p>
        <p class="muted">讀完應能讀懂一條數位訊號鏈，分辨切換層級，並查出一顆 Footswitch 實際控制什麼。</p>
      </header>
      <section id="blocks" class="section"><h2>Block 是訊號鏈上的一站</h2>
        <p>數位訊號處理（DSP）依訊號鏈的順序與路由處理 A/D 送來的樣本。處理區塊（Block）是鏈上的一站，像 Overdrive、擴大機（AMP）或延遲效果（Delay）。模型決定這一站用哪種方式處理，參數則決定這個模型怎麼工作。</p>
        <p>旁路（Bypass）通常讓訊號略過該 Block 的處理。它仍可留在原位置，也保留原參數，方便下次再打開。部分效果的尾音能不能繼續響，要看旁路或切換方式與機器設定。</p>
      </section>
      <section id="routing" class="section"><h2>看線，別只看方塊排在哪裡</h2>
        <p>串聯會讓前一顆的輸出進入下一顆。把 Overdrive 放在 AMP 前，可能會把 AMP 推得更容易失真。放到 AMP 後，則先由 AMP 處理，再讓結果進 Overdrive。</p>
        <p>並聯會讓訊號分到兩條路。讀圖時先找分岔點，再找每條支線進到哪裡、有沒有合流、混合比例如何。例如一條保留原音，另一條只有 Delay 尾音，最後再混回去。若延遲支線仍帶有乾訊號，疊回去的結果也可能變。</p>
        <a href="#rig">試試不同層級的切換</a>
      </section>
      <section id="rig" class="section">
        <div class="lesson-sticker-row"><div><h2>同一個 Solo，可以怎麼切？</h2>
          <p>Preset 是整套可叫回的音色設定。Scene 或 Snapshot 常用來叫回同一個 Preset 內的部分狀態，單顆 Block 則適合只臨時開關一個效果。不同設備的 Scene 可以改哪些參數、遇到手動改動會怎麼保存，都要依功能說明確認。</p></div>
          <img src="${new URL("./art/tone-buddy-aha-v001.png", import.meta.url).href}" width="384" height="384" loading="lazy" decoding="async" alt="">
        </div>
        <div id="rig-practice" class="console">
          <div class="section-head"><h3>切換練習</h3><span class="tag">概念示意 · 無音訊</span></div>
          <div class="rig-controls">
            <label>Preset <select id="rig-preset"><option value="rock">Rock Rig</option><option value="clean">Clean Rig</option></select></label>
            <label>Scene <select id="rig-scene"><option value="rhythm">Rhythm</option><option value="lead">Lead</option></select></label>
            <button type="button" class="secondary" id="rig-recall">重新叫回 Scene</button>
          </div>
          <ol id="rig-blocks" class="rig-blocks" aria-label="依序排列的效果 Block"></ol>
          <p class="feedback" id="rig-summary" role="status"></p>
        </div>
        <p>先在 Rock Rig 切到 Lead，確認 Overdrive 與 Delay 同時啟用。再手動把 Delay 旁路，按「重新叫回 Scene」觀察它回來。最後換到 Clean Rig，注意 AMP、IR 和其他 Block 也跟著改變。</p>
      </section>
      <section id="controls" class="section"><h2>從腳踏或外部控制來叫回設定</h2>
        <p>把第 00 章的 Riff 接到一個獨奏長音。先確認腳踏已指派成切 Scene，再跟著兩格各做一次動作。</p>
        <div class="scene-strip">
          <figure><img src="${new URL("./art/footswitch-pause-v002.jpg", import.meta.url).href}" width="1440" height="720" loading="lazy" alt="黑色皮靴停在白色效果器旁。"><figcaption><strong>空拍，踩下去。</strong>讓節奏段最後一個音自然收尾，聽切換時尾音有沒有被截斷。</figcaption></figure>
          <figure><img src="${new URL("./art/scene-next-beat-v002.webp", import.meta.url).href}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手抱著白色 Les Paul Custom，在練團室準備接進獨奏。"><figcaption><strong>下一拍，進 Solo。</strong>彈一個長音，聽第一下撥弦有沒有清楚冒出來。</figcaption></figure>
        </div>
        <p>腳踏開關（Footswitch）可被指派成切單顆效果、切整組 Scene 或換 Preset。表情踏板（Expression Pedal）用腳跟到腳尖之間的行程連續改變參數，例如掃動哇音（Wah）的頻率。外部 MIDI 控制則看裝置支援，Program Change 常用來換 Preset，Control Change 可用於指定功能或參數。接線後要確認 MIDI Channel 和功能映射。</p>
        <p>全域設定適合影響多個音色的需求，例如硬體輸出或針對共享監聽的 EQ。如果只有一個 Lead Preset 太亮，先從那套音色下手比較容易回復。</p>
        <div class="callout"><h3>在 MG-50Li 上看</h3><p>NUX 公開的 V1.1.1 更新說明列有 TAP／SCENE、STOMP LATCH 和 Global Settings 的 Patch Tail 開關。看螢幕目前在哪個模式，再比對你的韌體與腳踏指派。練習上方的 Rig 是課程示意。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方版本與操作資料</a></p></div>
      </section>
      <section id="experiment" class="section"><h2>踩下去以前，先猜會改什麼</h2>
        <ol><li>在自己設備叫出一套熟悉的音色，找出 AMP、CAB／IR 和 Delay 的順序。</li><li>只切一次 Delay 旁路，確認 AMP 和音量設定是否保留。若已指派 Scene，再切一次 Scene，看有哪幾顆 Block 一起變。</li><li>彈一個長音，在音符還沒完全消失時切換，聽尾音是保留還是中斷。寫下使用的操作模式和觀察到的結果。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：電吉他訊號的旅程</a><a href="${next}">下一章：AMP 擴大機建模</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
