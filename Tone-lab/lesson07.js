import { blocks, orderExerciseChain, eqDriveObservation } from "./chain.js";

export const routingQuiz = [
  ["同一組 EQ 和 Drive，為什麼只交換先後就可能有差？", ["Drive 收到的頻譜不同","Drive 到輸出的距離決定延遲","EQ 自動改變 Drive 的旋鈕值"], 0, "非線性處理對輸入內容敏感。先等化再失真，與先失真再等化不能假設等效。"],
  ["和弦尾巴一片糊，想先驗證 Delay 是否是主因。怎麼試？", ["一起縮短 Delay Time 和 Reverb Decay","單獨旁路 Delay，對照同一處停拍","固定 Delay，只減少後端總音量"], 1, "先把原因縮小到單一 Block，再決定改擺位、調參數，或省略它。"],
  ["四線法中，實體音箱的 Send 通常回哪裡？", ["效果器的樂器 Input","音箱自身的樂器 Input","效果器迴路的 Return"], 2, "音箱 FX Send 提供前級後的訊號，回到效果器的 Return，再經後段效果送往音箱 FX Return。"],
  ["並聯 Delay 和原音在機內合成一路，哪個描述正確？", ["機內合流，輸出仍可只有一路","機內分支，乾濕便各佔一個輸出","兩條支線都需再加入一份乾音"], 0, "並聯是內部處理方式，Wet/Dry 分送還要看裝置的輸出指派及接收設備。"],
  ["目標是保住悶音的清楚起音、只在停奏後留一點空間。起手式？", ["先加長 Decay，再調前級起音","先調悶音起音，再加短 Reverb","先增加 Delay 重複，再降低總音量"], 1, "先做出必要的基礎音色，再補上一項有明確作用的效果，較容易判斷每個 Block 的貢獻。"],
];

export function mountOrderPractice(root) {
  const chain = root.querySelector("#order-chain");
  const guidance = root.querySelector("#order-observation");
  const link = root.querySelector("#order-builder-link");
  const builder = link.href;
  const exercise = new URLSearchParams(location.search).get("exercise");
  let order = orderExerciseChain(exercise) ? exercise : "eq-first";
  function paint() {
    const example = orderExerciseChain(order);
    chain.innerHTML = example.map(({id}) => `<li${id === "od" || id === "eq" ? ' class="reverb-active"' : ""}>${blocks[id][0]}</li>`).join("");
    guidance.textContent = eqDriveObservation(order === "eq-first");
    link.href = builder + "?exercise=" + order;
  }
  root.querySelector("#order-swap").addEventListener("click", () => {
    order = order === "eq-first" ? "drive-first" : "eq-first";
    paint();
  });
  paint();
}

const asset = name => new URL("./assets/" + name, import.meta.url).href;

export function routingLesson({ previous, next, course, quiz, note, completion }) {
  const builder = new URL("./labs/signal-chain/index.html", import.meta.url).href;
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#minimal">最少的 Block</a><a href="#order">交換 EQ 和 Drive</a><a href="#parallel">串聯與 Wet/Dry</a><a href="#four-cable">四線法與出口</a><a href="#experiment">實機 A/B</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 08 章</p><h1>訊號鏈設計實驗室</h1>
        <p class="lede">同樣兩個 Block，交換順序就可能換一種手感。這章從一個聽得出的問題出發，排出能驗證的訊號鏈。</p>
      </header>
      <section id="minimal" class="section"><h2>從最少的 Block 開始</h2>
        <p>假設你的目標是悶音要俐落，停下後還能留一點空間。先用吉他、AMP 和 CAB／IR 把起音調好，再加一顆 Reverb，比較空拍時剩多少尾音。</p>
        <figure class="amp-illustration">
          <img src="${asset("signal-chain-rehearsal-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手坐在練團室整理兩顆效果器，旁邊架著白色 Les Paul Custom。">
          <figcaption class="single-caption">先決定你想改哪一個聲音，再挑一顆能驗證的效果。</figcaption>
        </figure>
        <p>如果殘響量太多，先降 Mix。若量合適但拖得太久，再單獨縮短 Decay。每加一顆效果都切回旁路聽一次。</p>
      </section>
      <section id="order" class="section">
        <h2>只交換 EQ 和 Drive</h2><p>想削掉讓破音變糊的低頻，先想要從進入 Drive 的訊號下手，還是想修整 Drive 出來的結果。</p>
        <div class="console" id="order-lab">
          <div class="section-head"><h3>兩種順序，固定其他條件</h3><span class="tag">串聯示意 · 無音訊</span></div>
          <div class="diagram monitor-route" aria-label="目前訊號順序"><ol id="order-chain"></ol></div>
          <p id="order-observation" role="status" class="amp-observation"></p>
          <div class="actions"><button type="button" id="order-swap" class="secondary swap-control"><img src="${asset("tone-buddy-swap-v001.png")}" width="42" height="42" alt="">交換 EQ 和 Drive</button><a class="primary" id="order-builder-link" href="${builder}">用這個順序開啟 Builder</a></div>
        </div>
        <p>比較 Delay 或 Reverb 時也一樣。放在重破音之前，尾音會和乾音一起被推入失真；擺到 AMP 後，可以先定好破音，再聽空間效果怎麼疊上去。真實結果還要看 Mix、後級處理與監聽。</p>
      </section>
      <section id="parallel" class="section"><h2>原音走上路、回聲走下路，最後在哪裡碰面？</h2>
        <p>串聯是前一顆的結果進下一顆。並聯可以在 AMP／CAB 後把訊號分成兩條，一路留乾音，一路只加 Delay，再在同一個輸出合流。若分支已保留乾音，效果支線可用全 Wet（如果支援）。</p>
        <div class="routing-branches"><p><strong>乾音支線</strong>保留已經成形的吉他音色。</p><p><strong>效果支線</strong>送出 Delay 重複聲，再用分支電平混入。</p></div>
        <p>Wet/Dry 也常指把乾音和效果聲分送到不同輸出或喇叭。機內能分支，仍要確認能否各自指派輸出，以及合流或單聲道相容性。MG-50Li 官方列有串聯、並聯與分流路由。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方路由資料</a></p>
      </section>
      <section id="four-cable" class="section"><h2>四線法把實體前級放進效果鏈</h2>
        <p>如果綜合效果器和實體音箱都有 Send／Return，四線法（4CM）可以把實體音箱的前級放在效果器的 S/R Block。按訊號方向從上到下核對，實際端子名稱和電平以手冊為準。<a href="https://support.roland.com/hc/en-us/articles/6345128863515-GX-100-Four-Cable-Method-Connections">BOSS GX-100 原廠接線範例</a></p>
        <figure class="diagram">
          <figcaption>四條訊號線的起點與終點</figcaption>
          <ol class="four-cable-flow">
            <li>吉他 Output <span aria-label="接到">→</span> 綜合效果器 Input</li>
            <li>綜合效果器 Send <span aria-label="接到">→</span> 吉他音箱 Input</li>
            <li>吉他音箱 FX Send <span aria-label="接到">→</span> 綜合效果器 Return</li>
            <li>綜合效果器 Output <span aria-label="接到">→</span> 吉他音箱 FX Return</li>
          </ol>
          <p>效果器內部可先排 Overdrive，再放 S/R Block，最後加 Delay。這樣 Overdrive 會進實體前級，Delay 則接收實體前級送回的訊號。</p>
        </figure>
        <p>將對應的 S/R Block 啟用，並照音箱手冊保持正確的喇叭負載。Speaker Out 是功率輸出，不能當這四條訊號接線的替代。</p>
        <p>接耳機或全頻 PA 時，可先從模擬 AMP／CAB 開始。依靠實體音箱前級與吉他喇叭時，先確認哪些由實機提供，哪些需要效果器補，再檢查是否重複塑形。</p>
      </section>
      <section id="experiment" class="section"><h2>做一條可以說清楚的訊號鏈</h2>
        <ol><li>寫下你要的起音、尾音、監聽和演奏片段。</li><li>先排最短路徑，再分別試 EQ 在 Drive 前後。固定設定和 Riff，用後端音量匹配。</li><li>逐顆旁路確認作用。最後留下聽得出有幫助的 Block，記下一組保留與一組捨棄的原因。</li></ol>
      </section>
      ${quiz}${note}${completion}
      <nav class="chapter-pager" aria-label="章節導覽"><a href="${previous}">上一章 · 07　動態、調變與空間效果</a><a class="pager-index" href="${course}">回完整目錄</a><a href="${next}">下一章 · 09　經典搖滾音色實驗室</a></nav>
    </article>
  </main>`;
}
