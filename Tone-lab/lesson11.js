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
    first: "如果撥片碰弦那一下特別刺，先聽輕刷是否也有同一層亮邊。各種力度都刺，才比較像整體音色太亮，可在 MG 的 IR 後用 6-BAND EQ 小幅降低 2.6K 或 6.4K 其中一段。只有重刷才出現碎裂聲時，先查輸入電平。",
    cue: "強音刺感是否下降，以及弱音與和弦有沒有因此變得太暗。",
    improved: "回到伴奏做一次同音量確認。若弱音也失去輪廓，縮小削減量再試。",
    retry: "回到原 EQ。若重彈才冒出刺耳碎裂聲，先檢查輸入和混音台的削波指示。若各種力度都尖，只換 CAB／IR 做下一輪。",
  },
  bass: {
    label: "吉他單獨聽很厚，Bass 一進來就糊",
    first: "電吉他和 Bass 的低頻同時響起時，兩邊的輪廓可能互相遮蔽。假設保持伴奏音量，在 MG 的 IR 後串 6-BAND EQ，只收一點吉他的 100 Hz。",
    cue: "Bass 的音高和吉他的第一下撥弦是否變得容易分辨？副歌的和弦還有原來的重量嗎？",
    improved: "合奏變清楚，表示這段編曲裡，收一點吉他低頻有幫助。若和弦也薄了，可以把削減量收回一些。",
    retry: "若 Bass 加入前，悶音就已經黏在一起，線索要往前找。保持箱體不變，降低 AMP Gain，聽下一下撥弦是否露出來。",
  },
  muddy: {
    label: "和弦聽起來混濁",
    first: "以 BRIT 800 接 M 1960+G12M 為例，固定 IR，小幅降低前級增益，用後段 Level 匹配音量後重刷原來的和弦。",
    cue: "外側兩弦還能不能聽清，低弦尾音有沒有拖過下一拍。",
    improved: "確認單音延音還夠用。若只有節奏改善，先把這個設定留在節奏 Scene，再分別驗證 Lead。",
    retry: "恢復原 Gain。若尾端串了 RVB 的 ROOM，只旁路它再彈一次。若乾聲仍糊，下一輪才比較 CAB／IR 或後段低中頻。",
  },
  mids: {
    label: "單獨聽夠大聲，進樂團就消失",
    first: "固定伴奏和聆聽位置，在 IR 後串 6-BAND EQ，小幅提高 1.2K，將整體聽感音量對回基準。",
    cue: "能否聽清音高與起音，同時保留 Bass、鼓或人聲的空間。",
    improved: "在另一段伴奏重測。若只在某一段要這樣做，可留成該段專用的 Scene。",
    retry: "恢復原 EQ。先用相同的吉他音色比較完整伴奏和只有鼓、Bass 的伴奏，找出哪一組聲部進來時開始互蓋。",
  },
  loose: {
    label: "低弦 Palm Mute 又大又鬆",
    first: "固定悶弦手勢。在 MG 的 AMP 前串 6-BAND EQ，小幅降低 100 Hz，再用後端 Level 補齊音量。若無可用的 AMP 前 EQ，先固定設定，只測試稍靠近琴橋的悶弦位置。",
    cue: "低弦的音頭是否更集中，停手後的低頻是否收得比較快。",
    improved: "用原版再彈一遍確認差異。若是前置 EQ 有效，可以恢復它後單試後段低頻，聽兩處對起音與低頻份量各有什麼影響。",
    retry: "恢復原設定與手勢。只退 AMP Gain，再用相同的重手悶音驗證。若症狀只在喇叭上出現，再獨立測聆聽位置。",
  },
  compressed: {
    label: "輕彈重彈聽起來都差不多",
    first: "若 AMP 前串了 STUDIO COMP，先旁路這顆壓縮器；沒有的話，本輪只小幅退 AMP Gain。用後段 Level 對齊音量。",
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
    first: "把有問題的兩句接在一起彈。例如 IR 後串 DIGITAL DELAY 和 ROOM，第一聲回音太響可降低前者的 E.LEVEL；房間尾音太厚則降低後者的 LEVEL。一次只動其中一顆。",
    cue: "停頓處剩下多少聲音，以及新一句的起音在伴奏裡能不能聽清。",
    improved: "若尾音仍拖太久，固定新 Mix。依造成問題的效果選一項，降低 DIGITAL DELAY 的 F.BACK 讓回聲更快衰減，或縮短 ROOM 的 DECAY。",
    retry: "恢復原 Mix，只旁路另一個空間效果重測。若乾聲也黏在一起，再檢查失真、消音或房間反射。",
  },
};
const asset = name => new URL("./assets/" + name, import.meta.url).href;

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
    first: "在 IR 後用 10-BAND EQ 小幅削減，先從高頻試。輕、重兩拍都彈，確認刺感有沒有減少，也保留輕彈的輪廓。",
    retry: "恢復原 EQ。只在重彈出現碎裂聲時，先查輸入或混音台是否過載。若各種力度都尖，再單獨 A/B 一個 CAB／IR。",
  },
  muddy: {
    label: "和弦混濁", band: 1,
    first: "先保持 Gain 和 CAB／IR，在 IR 後用 10-BAND EQ 小幅削減 250 Hz。刷同一個和弦，聽外側兩弦能否分辨，以及聲音有沒有變薄。",
    retry: "恢復原 EQ，再單獨退一點 AMP Gain，以後端 Level 匹配音量。若混濁只出現在空拍或下一句，另測 Reverb／Delay 的旁路。",
  },
  loose: {
    label: "低弦悶音鬆散", band: 0,
    first: "在 MG 可把 10-BAND EQ 放在 AMP 前，小幅削減 125 Hz，再用後端 Level 匹配音量。若改放 AMP 後，這輪先聽低頻份量，下一輪再獨立驗證 AMP Gain 對起音的影響。",
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
    result.textContent = "選一種可能的結果，看看它透露了什麼。";
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

export function diagnosisLesson({ previous, quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#method">建立診斷基準</a><a href="#monitoring">耳機、音箱與 PA</a><a href="#diagnosis">互動診斷</a><a href="#frequency-explorer">頻帶探索</a><a href="#experiment">同一個 Preset，在台上太尖、台下也會嗎？</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 12 章</p><h1>中階實戰與音色診斷</h1>
        <p class="lede">同一個 Preset，在耳機裡清楚，排練時卻聽不見。把剛才那句再彈一遍，這次請 Bass 到第二小節才進來。吉他從哪一拍開始聽不清？</p>
      </header>
      <section class="section" id="method"><h2>先找出症狀在哪一拍、哪一路發生</h2>
        <p>「切進獨奏時整段太大聲」和「只有第一下特別刺」是兩種線索。前者可能是兩個 Preset 的輸出音量有落差；後者則值得留意撥弦的尖峰，或切換時前一句的尾音是否剛好疊上來。</p></section>
      <section class="section" id="monitoring"><h2>從家裡耳機走到現場 PA</h2>
        <p>耳機、吉他音箱和 PA，各自把不同的一段訊號送到耳邊。吉他音箱可能有自己的前級和喇叭，PA 路徑則可能經過 CAB／IR、混音台與擴聲系統。</p>
        <figure class="amp-illustration"><img src="${asset("diagnosis-home-pa-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手在家戴耳機彈白色 Les Paul，也在暖色排練室聆聽擴聲。">
          <figcaption class="single-caption">在觀眾區固定一個位置先聽，再去另一個位置複查。兩次之間先保留原設定。</figcaption></figure>
        <p>耳機和喇叭的聽感會受不同環境影響。只在房間某處發生的低頻堆積，先比較聆聽位置；只有整團進來才聽不清時，回到混音裡找互蓋的聲部。<a href="https://hub.yamaha.com/proaudio/recording/recording-basics-better-monitoring-for-better-mixes-part-1/">Yamaha 監聽與房間說明</a></p>
        <div class="scene-strip" id="bass-enters"><figure><img src="${asset("bass-missing-tone.webp")}" width="960" height="540" loading="lazy" decoding="async" alt="排練室裡，紫髮偵探蹲著用放大鏡找線索，貝斯手站在一旁，吉他音符正從她背後的音箱冒出來。"><figcaption>「咦？我剛剛那句跑去哪了？」</figcaption></figure><p>如果吉他獨奏時乾淨俐落，Bass 一進來才模糊，兩件樂器在相近頻帶的遮蔽就值得考慮。若吉他單獨彈也黏成一團，可以先獨聽吉他的起音，試著退一點 Gain，再讓 Bass 加回來。</p></div>
      </section>
      <section class="section" id="diagnosis">
        <h2>你遇過哪一種？</h2><p>從熟悉的聲音選一個情境。每條路都可以展開來讀，看同一個症狀在不同條件下，會指向哪一段訊號鏈。</p>
        <div class="console" id="diagnosis-lab">
          <label for="diagnosis-case">目前症狀</label>
          <select id="diagnosis-case">${Object.entries(cases).map(([id, data]) => `<option value="${id}" ${id === "bass" ? "selected" : ""}>${data.label}</option>`).join("")}</select>
          <div class="amp-observation" aria-live="polite"><p><strong>一種可能</strong>　<span id="diagnosis-first"></span></p><p><strong>聽哪裡</strong>　<span id="diagnosis-cue"></span></p></div>
          <fieldset><legend>如果這樣調，聽起來會怎樣？</legend>
            <label class="option"><input type="radio" name="diagnosis-outcome" value="improved">有改善</label>
            <label class="option"><input type="radio" name="diagnosis-outcome" value="retry">沒改善或變差</label><label class="option"><input type="radio" name="diagnosis-outcome" value="unsure">差異聽不穩</label></fieldset>
          <p class="diagnosis-next"><img hidden class="diagnosis-face" src="${asset("tone-buddy-diagnosis-v001.png")}" width="74" height="74" alt=""><strong>下一步</strong>　<span id="diagnosis-result" role="status"></span></p>
          <button type="button" class="secondary" id="diagnosis-reset">重看這個情境</button>
        </div>
      </section>
      <section class="section" id="frequency-explorer"><h2>頻帶探索</h2>
        <p>低弦的重量、和弦裡聽不清的內聲部、撥片碰到弦的亮邊，分別可能落在不同頻帶。選一個症狀，移動滑桿就能讀到各頻帶的聽感。想用 MG 對照時，可以在 IR 後串 10-BAND EQ，選靠近示意頻率的一段。</p>
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
      <section class="section" id="experiment"><h2>同一個 Preset，在台上太尖、台下也會嗎？</h2>
        <p>排練室裡，吉他手站在 4×12 旁邊，台下聽到的可能是架在其中一顆喇叭前的麥克風，再經混音台送進 PA。兩邊聽的是同一段演奏，收音位置與喇叭卻不同。換成 MG-50Li 直出，XLR 送的是效果器訊號；若這條路已帶 CAB／IR，混音台收到的聲音就已經包含模擬箱體與收音。台上監聽尖、台下正合適，此時調整舞台監聽的 EQ，就能保住觀眾正在聽的聲音。<a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 說明</a></p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
