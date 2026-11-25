import { blocks } from "./chain.js?v=model-guide-1";

export const rockQuiz = [
  ["希望輕彈仍乾淨、重彈才有毛邊，優先找哪種工作點？", ["破音邊緣","乾淨高餘裕區","持續飽和區"], 0, "破音邊緣最適合測力度如何決定起音是否進入失真。"],
  ["想比較兩個 AMP 哪個有較清楚的 Crunch，怎麼安排？", ["各用推薦 CAB，以後端 Level 對齊","固定 CAB，以後端 Level 對齊","固定 CAB，以前級 Gain 對齊音量"], 1, "調 AMP Gain 可能改變破音工作點，換箱體也會改變結果。固定其他條件，再用有餘裕的後端 Level 匹配音量。"],
  ["Lead 單獨聽夠大聲，跟伴奏一起卻聽不清。先試什麼？", ["單聽 Lead，先把長音延長","單聽吉他軌，先把峰值調高","配著伴奏比中頻與起音"], 2, "被蓋住可能是頻譜或空間太擠。先定位問題，比一律增加失真或音量更容易判讀。"],
  ["硬搖滾節奏變糊，想試減少低頻推進失真，EQ 放哪先測？", ["主要失真級之前","主要失真級之後","混音台的總輸出"], 0, "在失真前控制低頻，會改變非線性級收到的訊號。後段 EQ 更適合修整已成形的頻譜。"],
  ["學到某種 Lead 的 AMP 與箱體類型，可以推論什麼？", ["可據此確認專輯該軌的收音","可拿來當風格實驗的起點","可據此還原那場演出的旋鈕值"], 1, "工具和訊號鏈只是成品的一部分。用自己的設備對照可聽特徵，比追同一組旋鈕刻度更實用。"],
];

export const recipes = {
  clean: {
    name: "Clean · 起音透明", blocks: ["amp", "cab"],
    cue: "輕重變化都清楚，和弦外側的弦還能分辨。",
    start: "MG 可用 JAZZ CLEAN 接 JC120，保留乾淨和弦的起音，試琴頸 Pickup；若太暗，再比較琴橋。",
    check: "輕彈分解和弦、重掃一次。若強音先髒，降低進前級的電平，再用後端 Level 補響度。",
  },
  edge: {
    name: "Edge of Breakup · 重彈有毛邊", blocks: ["amp", "cab"],
    cue: "輕彈仍乾淨，重彈時才出現少量破音。",
    start: "MG 可用 PLEXI 45 接 M 1960+G12M，保持拾音器不變，小幅增加 AMP 的輸入增益。用同一個音釐清開始破音的點。",
    check: "先輕彈再重彈。兩者都太髒時先退 Gain，直到輕彈回到較乾淨的區域。",
  },
  crunch: {
    name: "British Crunch · 和弦有稜角", blocks: ["amp", "cab"],
    cue: "開放和弦出現粗粒感，低弦依然有短而清楚的起音。",
    start: "MG 用 PLEXI 100W 接 M 1960+G12M，讓重刷有粗邊。先用同一個 CAB 比，再另外試箱體是否幫到中頻輪廓。",
    check: "彈開放和弦接低弦悶音。若尾巴拖成一團，先降 Gain，或檢查低頻是不是在失真前堆太多。",
  },
  hard: {
    name: "80s Hard Rock · 俐落的 Power Chord", blocks: ["od", "amp", "cab", "eq"],
    cue: "Power Chord 有份量，悶音收得住，和弦保持分離。",
    start: "MG 可排 T SCREAMER → BRIT 800 → M 1960+G12M。T SCREAMER 的 DRIVE 從低處起步，聽它有沒有讓低頻更受控。箱體後可接 6-BAND EQ 修整成品的低中頻。",
    check: "旁路 OD 做同音量對照。若只是變大聲、起音反而變鈍，可以先拿掉它。",
  },
  lead: {
    name: "Slash 類型 Lead · 中頻與延音", blocks: ["amp", "cab", "eq", "delay"],
    cue: "推弦在伴奏中還有輪廓，顫音收尾可辨認，下一句進來時空間尾音不搶位。",
    start: "MG-50Li 可選 BRIT 800 搭配 M 1960+G12M，配雙線圈拾音器。Gain 留到推弦能延續、撥弦強弱仍清楚。若想在句尾加空間，再於 IR 後串 DIGITAL DELAY，把 E.LEVEL 壓低。",
    check: "先在伴奏裡彈一個推弦與長音。只在摘掉 Delay 或退 Gain 時更清楚，就記下這個結果，別急著再加一顆 Drive。",
  },
};

export function rockExerciseChain(exercise) {
  if (!exercise?.startsWith("rock-")) return null;
  const key = exercise.slice(5);
  if (!Object.hasOwn(recipes, key)) return null;
  return recipes[key].blocks.map(id => ({ id, on: true }));
}

export function mountRockPractice(root) {
  const select = root.querySelector("#rock-recipe");
  const panel = root.querySelector("#rock-panel");
  const link = root.querySelector("#rock-builder");
  const builder = new URL(link.href);
  const exercise = new URLSearchParams(location.search).get("exercise");
  if (rockExerciseChain(exercise)) select.value = exercise.slice(5);
  function paint() {
    const key = select.value;
    const recipe = recipes[key];
    panel.innerHTML = `<p><strong>先聽</strong>　${recipe.cue}</p><ol class="rock-blocks" aria-label="建議順序">${recipe.blocks.map(id => `<li>${blocks[id][0]}</li>`).join("")}</ol>
      <p><strong>起手設定</strong>　${recipe.start}</p><p><strong>怎麼驗證</strong>　${recipe.check}</p>`;
    builder.searchParams.set("exercise", "rock-" + key);
    link.href = builder.href;
  }
  select.addEventListener("change", paint);
  paint();
}

const asset = name => new URL("./assets/" + name, import.meta.url).href;

export function rockLesson({ quiz, note, pager }) {
  const builder = new URL("./labs/signal-chain/index.html", import.meta.url).href;
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#goals">從聲音特徵開始</a><a href="#lead">Slash 類型 Lead</a><a href="#rock-practice">五個音色起點</a><a href="#experiment">推弦、停住、揉弦：一句旋律的三個瞬間</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 09 章</p><h1>經典搖滾音色實驗室</h1>
        <p class="lede">同一把 Les Paul，輕彈可以有空氣感，重刷可以長出粗邊，推弦又能在伴奏上浮起來。聽〈Sweet Child O’ Mine〉後段那句長音：音已經推上去了，旋律還靠什麼往前走？</p>
      </header>
      <section id="goals" class="section"><h2>先挑你想保留的那一拍</h2>
        <p>彈一個分解和弦、兩下 Power Chord，再留一個可推弦的長音。想保留每條弦的清楚輪廓，先找 Clean。想讓力道決定有沒有毛邊，往破音邊緣試。要 Crunch 或硬搖滾節奏，就把注意力放在重刷後起音是否還能分辨。</p>
        <p>先固定 Pickup、IR 和監聽，在同一段材料裡比較 AMP 和 Gain。箱體、收音與後段 EQ 可以在下一輪才改。選一項音色目標，比追一串器材名字更容易重做。</p>
      </section>
      <section id="lead" class="section"><h2>Slash 的推弦，到了高音以後呢？</h2>
        <div class="stage-listen"><p><strong>〈Sweet Child O’ Mine〉後段 Solo。</strong>撥片只碰了一下，音高卻一路往上走；推到落點，還聽得見揉弦的起伏。這句旋律最值得聽的是抵達高音以後的那一刻。</p>
          <figure class="amp-illustration">
          <img src="${asset("classic-rock-stage-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手肩背黑色皮背帶，在暖色小舞台上用白色 Les Paul 演奏 Lead。">
        </figure></div>
        <p>Slash 回憶錄這張專輯時，他用的是裝 Seymour Duncan 拾音器的手工 Les Paul 仿製琴，搭配租來的 Marshall 機頭。手指決定推弦的落點和揉弦的寬度，破音讓弦音漸弱時，那些細微的起伏仍聽得見。<a href="https://www.slashparadise.com/media/interviews-slash/return-to-the-jungle-guitar-one-june-2002.pdf">Slash 回顧《Appetite for Destruction》錄音</a></p>
        <p>在 MG-50Li 可用 <strong>BRIT 800 → M 1960+G12M</strong> 對照這種分工：AMP 決定長音的飽和感，IR 則影響推弦音頭的亮邊。Slash 不同時期用過多套設備，這裡借用的是搭配思路。<a href="https://nux.cherubtechnology.com/download/Manual/Effects/Multi_Effects/MG50Li/NUX_MG50Li_UserManual_English.pdf#page=15">NUX 內建 AMP 與 IR 表</a> · <a href="https://www.marshall.com/ad/en/backstage/guitar-heroes/slash">Marshall 的 Slash 器材回顧</a> · <a href="https://www.gibson.com/pages/the-slash-collection">Gibson Slash 系列</a></p>
        
      </section>
      <section id="rock-practice" class="section">
        <h2>選一個起點，帶進 Builder</h2><p>想玩副歌的粗邊，還是 Solo 裡浮在伴奏上方的長音？挑一種，帶著它的效果順序去 Builder。</p>
        <div class="console" id="rock-lab">
          <div class="section-head"><h3>經典搖滾音色練習</h3><span class="tag">聆聽假設 · 無音訊</span></div>
          <label>音色目標 <select id="rock-recipe">${Object.entries(recipes).map(([id, recipe]) => `<option value="${id}">${recipe.name}</option>`).join("")}</select></label>
          <div class="amp-observation" id="rock-panel" aria-live="polite"></div>
          <p class="muted">開啟 Builder 會帶入這組 Block 順序。按「播放 Riff」可以比較效果開關與換序；要試上面選的 AMP 和 IR 型號，請在自己的效果器上設定。</p>
          <div class="lesson-sticker-row">
            <div><a id="rock-builder" class="primary" href="${builder}">用這個起點開啟 Builder</a></div>
            <img id="rock-sticker" src="${asset("rock-sticker-still.webp")}" data-animated-src="${asset("rock-sticker-loop.gif")}" width="240" height="240" loading="lazy" alt="">
          </div>
        </div>
      </section>
      <section class="section" id="experiment"><h2>推弦、停住、揉弦：一句旋律的三個瞬間</h2>
        <p>跟著後段 Solo 哼一句：音高往上滑，是推弦；抵達後那一瞬間的停留，讓耳朵認得目標音；接著音高有規律地起伏，才是揉弦。用同一個音色，把揉弦提早到推弦途中，或等音高落定再開始，唱出來的語氣就不同。</p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
