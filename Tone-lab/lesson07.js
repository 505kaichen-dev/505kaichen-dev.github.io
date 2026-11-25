import { blocks, orderExerciseChain, eqDriveObservation } from "./chain.js?v=model-guide-1";

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

export function routingLesson({ quiz, note, pager }) {
  const builder = new URL("./labs/signal-chain/index.html", import.meta.url).href;
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#minimal">最少的 Block</a><a href="#order">交換 EQ 和 Drive</a><a href="#parallel">串聯與 Wet/Dry</a><a href="#four-cable">四線法與出口</a><a href="#experiment">同樣少一點低頻，Riff 的手感也會不同</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 08 章</p><h1>訊號鏈設計實驗室</h1>
        <p class="lede">低弦連刷時，若每一下都轟成一團，削一點低頻可能有用。可是把 EQ 放在破音前，改到的是撥弦推動失真的方式；放在破音後，收的是已經響起來的低頻。兩種接法回答的是不同問題。</p>
      </header>
      <section id="minimal" class="section"><h2>從最少的 Block 開始</h2>
        <p>假設你的目標是悶音要俐落，停下後還能留一點空間。以 MG 為例，BRIT 800 接 M 1960+G12M 先定下悶音，再在 IR 後串 RVB 的 ROOM，比較空拍時剩多少尾音。</p>
        <figure class="amp-illustration">
          <img src="${asset("signal-chain-rehearsal-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手坐在練團室整理兩顆效果器，旁邊架著白色 Les Paul Custom。">
          <figcaption class="single-caption">「低弦有點轟。這顆 EQ 放在破音前面，刷起來會怎樣？」</figcaption>
        </figure>
        <p>ROOM 的殘響太搶，可以降低 LEVEL。若量合適但拖得太久，再單獨縮短 Decay。每加一顆效果都切回旁路聽一次。</p>
      </section>
      <section id="order" class="section">
        <h2>只交換 EQ 和 Drive</h2><p>實體效果盤上，把等化器接在過載單塊前面，削低頻會改變哪些音推動失真；把同一顆等化器接到後面，修的是已經破音的成品。在 MG 畫面上交換 6-BAND EQ 與 T SCREAMER，就相當於把這兩顆單塊的接線順序對調。</p>
        <figure id="swap-shift" class="song-scene"><img src="${asset("swap-shift.webp")}" width="1200" height="400" loading="lazy" alt="她按一下，小小的自己就把單塊搬過去。才剛坐下喘口氣，那根手指又來了。"></figure>
        <div class="console" id="order-lab">
          <div class="section-head"><h3>兩種順序，固定其他條件</h3><span class="tag">串聯示意 · 無音訊</span></div>
          <div class="diagram monitor-route" aria-label="目前訊號順序"><ol id="order-chain"></ol></div>
          <p id="order-observation" role="status" class="amp-observation"></p>
          <div class="actions"><button type="button" id="order-swap" class="secondary swap-control">交換 EQ 和 Drive</button><a class="primary" id="order-builder-link" href="${builder}">用這個順序開啟 Builder</a></div>
        </div>
        <p>比較 Delay 或 Reverb 時也一樣。放在重破音之前，尾音會和乾音一起被推入失真；擺到 AMP 後，可以先定好破音，再聽空間效果怎麼疊上去。真實結果還要看 Mix、後級處理與監聽。</p>
      </section>
      <section id="parallel" class="section"><h2>原音走上路、回聲走下路，最後在哪裡碰面？</h2>
        <p>串聯是前一顆的結果進下一顆。並聯可以在 AMP／CAB 後把訊號分成兩條，一路留乾音，一路用 REVERSE 加入倒放回聲，再在同一個輸出合流。若分支已保留乾音，效果支線可用全 Wet（如果支援）。</p>
        <div class="routing-branches"><p><strong>乾音支線</strong>保留已經成形的吉他音色。</p><p><strong>效果支線</strong>送出 Delay 重複聲，再用分支電平混入。</p></div>
        <p>Wet/Dry 也常指把乾音和效果聲分送到不同輸出或喇叭。機內能分支，仍要確認能否各自指派輸出，以及合流或單聲道相容性。MG-50Li 官方列有串聯、並聯與分流路由。<a href="https://nuxaudio.com/product/mg50li/">NUX 官方路由資料</a></p>
        <p><strong>Ambient 分解和弦。</strong>實體乾濕混音器會留一路吉他原音，另一路送進只輸出殘響的 Reverb，再把兩路混回來。MG 的 Parallel 路由也能這樣理解：原音保留指尖碰弦的瞬間，效果支線可串 RVB 的 SHIMMER，以 MIX 調濕聲比例、DECAY 決定這層帶泛音的霧留多久。</p>
      </section>
      <section id="four-cable" class="section"><h2>四線法把實體前級放進效果鏈</h2><figure class="song-scene" id="amp-hello"><img src="${asset("amp-hello.webp")}" width="1440" height="810" loading="lazy" decoding="async" alt="排練室裡，她抱著白色效果器仰望黑金色音箱，團員扶著器材箱笑著看她。"></figure>
        <p>Marshall JCM800 2203 復刻版有串聯 FX Loop，FX Send 送出前級處理過的聲音，FX Return 則把訊號接回後級。搭配 MG-50Li 的一組 Send／Return，真音箱的前級就能成為 MG 鏈中的一站。放在 S/R 前的 Drive 會推動真前級；放在 S/R 後的 Delay 收到的是已經破音的吉他，回聲可以保留每一下的輪廓。<a href="https://www.marshall.com/us/en/product/jcm800-2203-vintage-reissue-head">Marshall 2203 面板與規格</a> · <a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 說明</a></p>
        <figure class="diagram">
          <figcaption>四條訊號線的起點與終點</figcaption>
          <ol class="four-cable-flow">
            <li>吉他 Output <span aria-label="接到">→</span> 綜合效果器 Input</li>
            <li>綜合效果器 Send <span aria-label="接到">→</span> 吉他音箱 Input</li>
            <li>吉他音箱 FX Send <span aria-label="接到">→</span> 綜合效果器 Return</li>
            <li>綜合效果器 Output <span aria-label="接到">→</span> 吉他音箱 FX Return</li>
          </ol>
          <p>效果器內部可排成 T SCREAMER → S/R → DIGITAL DELAY。這樣 Overdrive 會進實體前級，Delay 則接收實體前級送回的訊號。</p>
        </figure>
        <p>將對應的 S/R Block 啟用，並照音箱手冊保持正確的喇叭負載。Speaker Out 是功率輸出，不能當這四條訊號接線的替代。</p>
        <p>接耳機或全頻 PA 時，可先從模擬 AMP／CAB 開始。依靠實體音箱前級與吉他喇叭時，先確認哪些由實機提供，哪些需要效果器補，再檢查是否重複塑形。</p>
      </section>
      <section class="section" id="experiment"><h2>同樣少一點低頻，Riff 的手感也會不同</h2>
        <p>放在 Drive 前的 EQ 會改變哪些頻率推動破音。低弦進去前先收一些，悶音的起頭可能更俐落。換到 Drive 後，EQ 面對的是已經失真的聲音，可以修掉成品的低頻隆起，前面那次失真卻已經發生。</p>
      </section>
      ${quiz}${note}${pager}
    </article>
  </main>`;
}
