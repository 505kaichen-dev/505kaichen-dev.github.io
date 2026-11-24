import { blocks } from "./chain.js";

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
    start: "先選高餘裕 Clean AMP，Gain 偏低。固定一個熟悉的 CAB／IR，試琴頸 Pickup；若太暗，再比較琴橋。",
    check: "輕彈分解和弦、重掃一次。若強音先髒，降低進前級的電平，再用後端 Level 補響度。",
  },
  edge: {
    name: "Edge of Breakup · 重彈有毛邊", blocks: ["amp", "cab"],
    cue: "輕彈仍乾淨，重彈時才出現少量破音。",
    start: "沿用上一個 CAB／IR 和 Pickup，小幅增加 AMP Gain。用同一個音釐清開始破音的點。",
    check: "先輕彈再重彈。兩者都太髒時先退 Gain，直到輕彈回到較乾淨的區域。",
  },
  crunch: {
    name: "British Crunch · 和弦有稜角", blocks: ["amp", "cab"],
    cue: "開放和弦出現粗粒感，低弦依然有短而清楚的起音。",
    start: "試較早起破音的 British 類 AMP，Gain 先保守。先用同一個 CAB 比，再另外試箱體是否幫到中頻輪廓。",
    check: "彈開放和弦接低弦悶音。若尾巴拖成一團，先降 Gain，或檢查低頻是不是在失真前堆太多。",
  },
  hard: {
    name: "80s Hard Rock · 俐落的 Power Chord", blocks: ["od", "amp", "cab", "eq"],
    cue: "Power Chord 有份量，悶音收得住，和弦保持分離。",
    start: "先試 Master Volume 類 British AMP 與 4×12 類 CAB。前置 OD 可從低 Drive 起步，聽它有沒有讓低頻更受控。後段 EQ 留作小幅修整。",
    check: "旁路 OD 做同音量對照。若只是變大聲、起音反而變鈍，可以先拿掉它。",
  },
  lead: {
    name: "Slash 類型 Lead · 中頻與延音", blocks: ["amp", "cab", "eq", "delay"],
    cue: "推弦在伴奏中還有輪廓，顫音收尾可辨認，下一句進來時空間尾音不搶位。",
    start: "先試 British 類 AMP、4×12 類 CAB 與 Humbucker。從有延音但仍聽得出力道的 Gain 起步。後段小幅調中頻，Delay 用低 Mix。",
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

const asset = name => new URL("./art/" + name, import.meta.url).href;

export function rockLesson({ previous, next, course, quiz, note, completion }) {
  const builder = new URL("./labs/signal-chain/index.html", import.meta.url).href;
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#goals">從聲音特徵開始</a><a href="#lead">Slash 類型 Lead</a><a href="#rock-practice">五個音色起點</a><a href="#experiment">MG-50Li 實作</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 08</p><h1>經典搖滾音色實驗室</h1>
        <p class="lede">同一把 Les Paul，輕彈可以有空氣感，重刷可以長出粗邊，推弦又能在伴奏上浮起來。這章練習從聽得出來的差異，選擇合適的 AMP、CAB 與效果位置。</p>
      </header>
      <section id="goals" class="section"><h2>先挑你想保留的那一拍</h2>
        <p>彈一個分解和弦、兩下 Power Chord，再留一個可推弦的長音。想保留每條弦的清楚輪廓，先找 Clean。想讓力道決定有沒有毛邊，往破音邊緣試。要 Crunch 或硬搖滾節奏，就把注意力放在重刷後起音是否還能分辨。</p>
        <p>先固定 Pickup、IR 和監聽，在同一段材料裡比較 AMP 和 Gain。箱體、收音與後段 EQ 可以在下一輪才改。選一項音色目標，比追一串器材名字更容易重做。</p>
      </section>
      <section id="lead" class="section"><h2>Slash 類型 Lead，先聽中頻與延音</h2>
        <div class="stage-listen"><p><strong>推一個長音，留一拍空白。</strong>先聽撥弦的音頭和手指的顫音，再聽 Delay 怎麼退到伴奏後面。</p>
          <figure class="amp-illustration">
          <img src="${asset("classic-rock-stage-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手肩背黑色皮背帶，在暖色小舞台上用白色 Les Paul 演奏 Lead。">
        </figure></div>
        <p>長音被伴奏蓋住時，先單獨試後段 EQ 的中頻、後段音量，或 Delay 的 Mix。若連推弦前的撥弦聲都變鈍，再試著退一點 Gain。每次改一項，切回原設定聽同一拍。</p>
        <p>Marshall 的器材回顧提到 Slash 在不同時期用過多種音箱，也記錄過部分現場用 4×12 的配置。Gibson 的資料也能追到他使用 Les Paul 的例子。這裡用 British 類 AMP、4×12 類 CAB 與 Humbucker 當探索方向，實際錄音還包含演奏、麥克風、疊錄和混音。<a href="https://www.marshall.com/ad/en/backstage/guitar-heroes/slash">Marshall 回顧</a> · <a href="https://www.gibson.com/pages/the-slash-collection">Gibson Slash 器材資料</a></p>
      </section>
      <section id="rock-practice" class="section">
        <h2>選一個起點，帶進 Builder</h2><p>先挑想聽到的結果，讀聆聽線索和起手設定。五個選項都是自己設備上的實驗方向。</p>
        <div class="console" id="rock-lab">
          <div class="section-head"><h3>經典搖滾音色練習</h3><span class="tag">聆聽假設 · 無音訊</span></div>
          <label>音色目標 <select id="rock-recipe">${Object.entries(recipes).map(([id, recipe]) => `<option value="${id}">${recipe.name}</option>`).join("")}</select></label>
          <div class="amp-observation" id="rock-panel" aria-live="polite"></div>
          <p class="muted">Builder 只載入 Block 順序。AMP、IR 與旋鈕設定請在實機上依方向調整。</p>
          <a id="rock-builder" class="primary" href="${builder}">用這個起點開啟 Builder</a>
        </div>
      </section>
      <section id="experiment" class="section"><h2>到 MG-50Li 做三次短對照</h2>
        <ol><li>用乾淨的起點存一份比較用 Preset。固定琴、Pickup、CAB／IR 與監聽，用同一段強弱演奏建立基準。</li><li>同模型小幅增加 Gain，聽重彈是否先進破音。再換較早起破音的 AMP，保持 CAB 和響度作第二次對照。</li><li>做 Lead 時用同一個推弦和停頓，分別驗證中頻與 Delay。成功標準是伴奏中聽得清推弦輪廓，停手後仍留有下一句的位置。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：訊號鏈設計實驗室</a><a href="${next}">下一章：現代金屬音色實驗室</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
