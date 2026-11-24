export const diagnosisQuiz = [
  ["同一個 Preset 戴耳機正常，接 PA 明顯刺耳。第一輪要做什麼？", ["先把共用 Preset 的高頻削掉","先換較暗的 IR 再回家比耳機","先核對 PA 路由和通道設定"], 2, "兩個地方的差異可能在輸出、處理或監聽環境。先查差異從哪一段開始。"],
  ["只旁路前置 OD，匹配音量後悶音變緊。這一輪能確定什麼？", ["OD 的啟用狀態影響這段悶音","變緊主要來自 OD 的低頻濾波","變緊主要來自 OD 的輸出音量"], 0, "旁路整顆 OD 會一起改變頻譜、電平和非線性。要區分原因，下一輪還要拆開驗證。"],
  ["減少 Reverb Mix 後，下一句依然被回聲蓋住。下一輪怎麼做？", ["保留新 Mix，再一起降低兩顆效果","回到基準，只旁路 Delay","改用短 Hall，同時縮短 Delay Time"], 1, "恢復基準再測第二個假設，比累積多項改動更容易辨認哪一段在影響尾音。"],
  ["Lead 切換突然太大聲，但破音量剛好。優先調整哪裡？", ["調兩段共用的監聽輸出","退較大聲一側的 AMP Gain","調較大聲一側的後端 Level"], 2, "有餘裕的後端 Level 主要動音量，較能保留已確認的前級失真與動態。"],
  ["音色越調越亮，回到原版也一時聽不出差別。這時怎麼做？", ["休息後回到固定音量重測","立刻在較高音量下重新選版","以最後一次試彈的亮度作基準"], 0, "聽久後比較基準會漂移。把目前版本留著，休息後用固定的參考與原版重測。"],
];

const cases = {
  pa: {
    label: "耳機好聽，接 PA 就走樣",
    first: "保留原 Preset，記下 PA 那一路的輸出模式與 CAB／IR 狀態。若直接進混音台卻旁路了 CAB／IR，先只恢復這一段；若已啟用，和音控確認後，單獨比較通道 EQ 的開關。兩次都在同一位置聽。",
    cue: "撥弦的尖銳感、和弦厚度，以及強彈時混音台輸入有沒有削波。",
    improved: "記下該路的設定與聆聽位置，再換個觀眾位置確認。換位置時保持所有參數不動。",
    retry: "恢復原設定。維持同一個混音台通道和音量，只換聆聽位置。若症狀跟著位置變，先查揚聲器覆蓋或房間反射，再決定要不要改 Preset。",
  },
  harsh: {
    label: "強彈時太刺耳",
    first: "先判斷是否只有重彈會發生。略降失真後的高頻 EQ，用相同的重彈與輕彈做 A/B。",
    cue: "強音刺感是否下降，以及弱音與和弦有沒有因此變得太暗。",
    improved: "回到伴奏做一次同音量確認。若弱音也失去輪廓，縮小削減量再試。",
    retry: "回到原 EQ。若重彈才冒出刺耳碎裂聲，先檢查輸入和混音台的削波指示。若各種力度都尖，只換 CAB／IR 做下一輪。",
  },
  muddy: {
    label: "和弦聽起來混濁",
    first: "固定 CAB／IR，小幅降低 AMP Gain，用後段 Level 匹配音量後重刷原來的和弦。",
    cue: "外側兩弦還能不能聽清，低弦尾音有沒有拖過下一拍。",
    improved: "確認單音延音還夠用。若只有節奏改善，先把這個設定留在節奏 Scene，再分別驗證 Lead。",
    retry: "恢復原 Gain。只旁路 Reverb 再彈一次。若乾聲仍糊，下一輪才比較 CAB／IR 或後段低中頻。",
  },
  mids: {
    label: "單獨聽夠大聲，進樂團就消失",
    first: "固定伴奏和聆聽位置，小幅提高失真後的中頻，將整體聽感音量對回基準。",
    cue: "能否聽清音高與起音，同時保留 Bass、鼓或人聲的空間。",
    improved: "在另一段伴奏重測。若只在某一段要這樣做，可留成該段專用的 Scene。",
    retry: "恢復原 EQ。先用相同的吉他音色比較完整伴奏和只有鼓、Bass 的伴奏，找出哪一組聲部進來時開始互蓋。",
  },
  loose: {
    label: "低弦 Palm Mute 又大又鬆",
    first: "固定悶弦手勢。用 AMP 前 EQ 小幅減低頻，再用後端 Level 補齊音量。若無可用的 AMP 前 EQ，先固定設定，只測試稍靠近琴橋的悶弦位置。",
    cue: "低弦的音頭是否更集中，停手後的低頻是否收得比較快。",
    improved: "用原版再彈一遍確認差異。若是前置 EQ 有效，可以恢復它後單試後段低頻，聽兩處對起音與低頻份量各有什麼影響。",
    retry: "恢復原設定與手勢。只退 AMP Gain，再用相同的重手悶音驗證。若症狀只在喇叭上出現，再獨立測聆聽位置。",
  },
  compressed: {
    label: "輕彈重彈聽起來都差不多",
    first: "有前置 Compressor 就先旁路；沒有的話，本輪只小幅退 AMP Gain。用後段 Level 對齊音量。",
    cue: "同一顆音的輕重起音、和弦重刷時的變化，以及延音是否仍足夠。",
    improved: "留下足夠的動態，再以更小的改動重測延音。兩種力度都要能在伴奏裡辨認。",
    retry: "恢復基準。若前一輪旁路 Compressor，改測小幅降低 AMP Gain；若已試過 AMP Gain，再分別檢查前置 Drive 的推入量或輸入削波。",
  },
  jump: {
    label: "換 Scene 或 Preset 時音量跳太多",
    first: "在伴奏裡反覆踩同一對切換點，只調較大聲一側有餘裕的後端 Level。",
    cue: "切換後第一下與持續段落的音量落差，以及 Lead 是否還能從伴奏裡浮起來。",
    improved: "沿歌曲順序再踩一次。記下刻意保留的 Lead 音量提升與兩側的後端設定。",
    retry: "恢復原 Level。若只在第一下突兀，下一輪只暫停前一段的 Delay 尾音或相關延續功能，聽是否為兩段疊在一起。",
  },
  tails: {
    label: "Delay／Reverb 尾音蓋住下一句",
    first: "把有問題的兩句接在一起彈。一次只減少其中一個空間效果的 Mix，先試尾音最明顯的那一個。",
    cue: "停頓處剩下多少聲音，以及新一句的起音在伴奏裡能不能聽清。",
    improved: "若尾音仍拖太久，固定新 Mix。依造成問題的效果選一項，降低 Delay Feedback 讓回聲更快衰減，或縮短 Reverb Decay。",
    retry: "恢復原 Mix，只旁路另一個空間效果重測。若乾聲也黏在一起，再檢查失真、消音或房間反射。",
  },
};
const asset = name => new URL("./art/" + name, import.meta.url).href;

const frequencyBands = [
  { label: "低頻", range: "70–160 Hz", center: "110 Hz", listen: "第 2 拍低弦的重量，以及停弦後的低頻是否仍拖著。" },
  { label: "低中頻", range: "160–400 Hz", center: "250 Hz", listen: "第 3 拍和弦的厚度，以及外側兩弦能不能分開聽。" },
  { label: "中頻", range: "400 Hz–1.6 kHz", center: "800 Hz", listen: "第 3 拍和弦的音高在伴奏裡是否更清楚，或是否變得過於鼻音。" },
  { label: "高中頻", range: "1.6–3.2 kHz", center: "2.2 kHz", listen: "第 1、2 拍的撥弦起音，有沒有從背景裡突出，或變得太硬。" },
  { label: "高頻", range: "3.2–6.4 kHz", center: "4.5 kHz", listen: "第 2 拍尖銳的邊緣，以及第 1 拍是否也因此變暗。" },
];

const frequencyCases = {
  harsh: {
    label: "重彈太刺耳", band: 4,
    first: "在 AMP 和 CAB／IR 之後用 EQ 小幅削減，先從高頻試。輕、重兩拍都彈，確認刺感有沒有減少，也保留輕彈的輪廓。",
    retry: "恢復原 EQ。只在重彈出現碎裂聲時，先查輸入或混音台是否過載。若各種力度都尖，再單獨 A/B 一個 CAB／IR。",
  },
  muddy: {
    label: "和弦混濁", band: 1,
    first: "先保持 Gain 和 CAB／IR，用後段 EQ 小幅削減低中頻。刷同一個和弦，聽外側兩弦能否分辨，以及聲音有沒有變薄。",
    retry: "恢復原 EQ，再單獨退一點 AMP Gain，以後端 Level 匹配音量。若混濁只出現在空拍或下一句，另測 Reverb／Delay 的旁路。",
  },
  loose: {
    label: "低弦悶音鬆散", band: 0,
    first: "若設備可把 EQ 放在 AMP 前，先小幅削減低頻，再用後端 Level 匹配音量。若只有 AMP 後的 EQ，這輪先聽低頻份量，下一輪再獨立驗證 AMP Gain 對起音的影響。",
    retry: "恢復原 EQ。固定悶弦手勢，只小幅退 AMP Gain 再比一次。若只有喇叭會轟，保留設定另換聆聽位置。",
  },
};

export function mountFrequencyExplorer(root) {
  const symptom = root.querySelector("#frequency-symptom");
  const slider = root.querySelector("#frequency-band");
  const selected = root.querySelector("#frequency-selected");
  const first = root.querySelector("#frequency-first");
  const cue = root.querySelector("#frequency-cue");
  const retry = root.querySelector("#frequency-retry");
  const bands = root.querySelectorAll(".frequency-strip li");

  function showBand() {
    const index = slider.valueAsNumber;
    const band = frequencyBands[index];
    const active = frequencyCases[symptom.value];
    selected.value = band.label + " · " + band.range;
    slider.setAttribute("aria-valuetext", selected.value);
    bands.forEach((item, step) => { item.dataset.selected = String(step === index); });
    cue.textContent = band.listen;
    first.textContent = index === active.band
      ? active.first + " 若可選中心頻率，可先試約 " + band.center + "。"
      : "對照頻帶可從約 " + band.center + " 附近小幅試調一次。先恢復上一輪的 EQ，維持同一個 EQ 位置、演奏和監聽。";
    retry.textContent = active.retry;
  }

  function resetBand() {
    slider.value = frequencyCases[symptom.value].band;
    showBand();
  }

  symptom.addEventListener("change", resetBand);
  slider.addEventListener("input", showBand);
  root.querySelector("#frequency-reset").addEventListener("click", resetBand);
  resetBand();
}

export function mountDiagnosisPractice(root) {
  const select = root.querySelector("#diagnosis-case");
  const first = root.querySelector("#diagnosis-first");
  const cue = root.querySelector("#diagnosis-cue");
  const result = root.querySelector("#diagnosis-result");
  const outcomes = root.querySelectorAll('input[name="diagnosis-outcome"]');

  const listeningFace = root.querySelector(".diagnosis-face");
  function resetOutcome() {
    listeningFace.hidden = true;
    for (const option of outcomes) option.checked = false;
    result.textContent = "完成第一輪後，選擇結果來看下一步。";
  }
  function showCase() {
    const active = cases[select.value];
    first.textContent = active.first;
    cue.textContent = active.cue;
    resetOutcome();
  }
  select.addEventListener("change", showCase);
  for (const option of outcomes) {
    option.addEventListener("change", () => {
      listeningFace.hidden = option.value !== "unsure";
      result.textContent = option.value === "unsure" ? "先保留原版。兩版從同一拍開始，把音量調到接近，只重聽剛才那一拍。仍分不清，就記下這次沒有穩定差異。" : cases[select.value][option.value];
    });
  }
  root.querySelector("#diagnosis-reset").addEventListener("click", resetOutcome);
  showCase();
}

export function diagnosisLesson({ previous, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#method">建立診斷基準</a><a href="#monitoring">耳機、音箱與 PA</a><a href="#diagnosis">互動診斷</a><a href="#frequency-explorer">頻帶探索</a><a href="#experiment">MG-50Li 實作</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 11</p><h1>中階實戰與音色診斷</h1>
        <p class="lede">同一個 Preset，在耳機裡清楚，排練時卻聽不見。這章用一段熟悉的演奏找出症狀出現的條件，再沿訊號鏈逐段驗證。</p>
      </header>
      <section class="section" id="method"><h2>先找出症狀在哪一拍、哪一路發生</h2>
        <ol><li>用一句話記下環境、切換點和聽到的問題。例：「主歌切獨奏，PA 裡第一下太大聲，後面的長音正常。」</li>
        <li>另存原設定。選同一段演奏，固定 Pickup、監聽和位置，先確認問題能重現。若只在伴奏裡發生，就在伴奏裡比較。</li>
        <li>提出一個假設，只改一項。比較音色時匹配聽感音量；若正在測切換落差，就直接比較兩段的音量。有效就反切一次確認，沒改善就恢復基準再測別處。</li></ol>
        <p>若連原版和試驗版都越聽越難區分，先留存兩版、休息一會。回來用同一段熟悉的參考音樂與固定音量重建基準。</p>
      </section>
      <section class="section" id="monitoring"><h2>從家裡耳機走到現場 PA</h2>
        <p>先畫出三條實際路徑：耳機、吉他音箱與 PA。吉他音箱可能有自己的前級和喇叭，PA 路徑則可能經過 CAB／IR、混音台與擴聲系統。把每路的輸出模式、CAB／IR 狀態和音量寫下來。</p>
        <figure class="amp-illustration"><img src="${asset("diagnosis-home-pa-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手在家戴耳機彈白色 Les Paul，也在暖色排練室聆聽擴聲。">
          <figcaption class="single-caption">在觀眾區固定一個位置先聽，再去另一個位置複查。兩次之間先保留原設定。</figcaption></figure>
        <p>耳機和喇叭的聽感會受不同環境影響。只在房間某處發生的低頻堆積，先比較聆聽位置；只有整團進來才聽不清時，回到混音裡找互蓋的聲部。<a href="https://hub.yamaha.com/proaudio/recording/recording-basics-better-monitoring-for-better-mixes-part-1/">Yamaha 監聽與房間說明</a></p>
      </section>
      <section class="section" id="diagnosis">
        <h2>選一個症狀，根據結果走下一步</h2><p>先在自己的設備上做第一輪，再回來選聽到的結果。這份練習提供測試方向，聲音由你的實機驗證。</p>
        <div class="console" id="diagnosis-lab">
          <label for="diagnosis-case">目前症狀</label>
          <select id="diagnosis-case">${Object.entries(cases).map(([id, data]) => `<option value="${id}">${data.label}</option>`).join("")}</select>
          <div class="amp-observation" aria-live="polite"><p><strong>第一輪</strong>　<span id="diagnosis-first"></span></p><p><strong>聽哪裡</strong>　<span id="diagnosis-cue"></span></p></div>
          <fieldset><legend>第一輪聽起來怎樣？</legend>
            <label class="option"><input type="radio" name="diagnosis-outcome" value="improved">有改善</label>
            <label class="option"><input type="radio" name="diagnosis-outcome" value="retry">沒改善或變差</label><label class="option"><input type="radio" name="diagnosis-outcome" value="unsure">差異聽不穩</label></fieldset>
          <p class="diagnosis-next"><img hidden class="diagnosis-face" src="${asset("tone-buddy-diagnosis-v001.png")}" width="74" height="74" alt=""><strong>下一步</strong>　<span id="diagnosis-result" role="status"></span></p>
          <button type="button" class="secondary" id="diagnosis-reset">清除本輪結果</button>
        </div>
      </section>
      <section class="section" id="frequency-explorer"><h2>頻帶探索</h2>
        <p>用<a href="../00/index.html#goal">第 00 章的四拍 Riff</a>做 A/B。選一個症狀，從建議頻帶開始。移動滑桿可以看其他頻帶要聽什麼。每輪只改一段 EQ，有需要時用後端 Level 匹配聽感音量。</p>
        <div class="console">
          <p class="muted">頻帶為試聽起點。此工具無音訊，也不顯示實測頻譜或 EQ 曲線。</p>
          <label for="frequency-symptom">目前症狀</label>
          <select id="frequency-symptom">${Object.entries(frequencyCases).map(([id, item]) => `<option value="${id}">${item.label}</option>`).join("")}</select>
          <ol class="frequency-strip" aria-hidden="true">${frequencyBands.map(band => `<li>${band.label}</li>`).join("")}</ol>
          <div class="gain-sliders"><label for="frequency-band"><span>試聽頻帶 <output id="frequency-selected" for="frequency-band"></output></span>
            <input id="frequency-band" type="range" min="0" max="${frequencyBands.length - 1}" step="1" value="4"></label></div>
          <div class="amp-observation">
            <p><strong>怎麼試</strong>　<span id="frequency-first"></span></p>
            <p><strong>聽哪一拍</strong>　<span id="frequency-cue"></span></p>
            <p><strong>沒改善時</strong>　<span id="frequency-retry"></span></p>
          </div>
          <div class="actions"><button type="button" class="secondary" id="frequency-reset">回到建議頻帶</button></div>
        </div>
        <p>頻帶界線只是方便排查的分區，同一句「刺耳」也可能來自削波或收音。Presence 是某些擴大機用來改變高中頻和高頻的控制，作用區域與電路或模型有關。<a href="https://manuals.line6.com/en/helix-stadium/live/amp-blocks">Line 6 原廠 Presence 說明</a></p>
      </section>
      <section class="section" id="experiment"><h2>帶一個排練問題來做期末實作</h2>
        <p>在 MG-50Li 複製一份待診斷的 Preset。在會出問題的監聽上重彈八小節，記下輸出、CAB／IR、音量及症狀出現的那一拍。接 PA 時先與混音台端一起確認電平與訊號路徑。<a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 官方支援</a></p>
        <p>做完一輪 A/B，把原設定、單一改動、聽到的差異與第二輪驗證寫進音色筆記。若第二輪無法重現，先保留原版。也可以用<a href="${previous}#preset-record">第 10 章的音色設計紀錄表</a>帶走這份結果。</p>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：從零建立完整 Preset</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
