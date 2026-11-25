import { chapters, topicPaths, glossary, quiz } from "./course.js?v=reading-flow-2";
import { blocks, mgExamples, initialChain, validChain, chainObservations, orderExerciseChain } from "./chain.js?v=model-guide-1";
import { signalLesson, signalQuiz, renderSignalPath } from "./lesson01.js?v=duo-editorial-1";
import { rigLesson, rigQuiz, mountRigPractice } from "./lesson02.js?v=gear-world-1";
import { ampLesson, ampQuiz, mountAmpPractice } from "./lesson03.js?v=gear-world-1";
import { cabLesson, cabQuiz, mountCabPractice } from "./lesson04.js?v=gear-world-1";
import { gainLesson, gainQuiz, mountGainPractice } from "./lesson05.js?v=animated-stickers-2";
import { effectsLesson, effectsQuiz, mountDelayPractice, mountReverbPractice } from "./lesson06.js?v=animated-stickers-1";
import { routingLesson, routingQuiz, mountOrderPractice } from "./lesson07.js?v=animated-stickers-2";
import { rockLesson, rockQuiz, recipes, rockExerciseChain, mountRockPractice } from "./lesson08.js?v=animated-stickers-1";
import { metalLesson, metalQuiz, mountMetalPractice } from "./lesson09.js?v=animated-stickers-1";
import { presetLesson, presetQuiz, mountPresetPractice } from "./lesson10.js?v=bandmates-1";
import { diagnosisLesson, diagnosisQuiz, mountDiagnosisPractice, mountFrequencyExplorer } from "./lesson11.js?v=bass-cover-1";

const home = new URL("./", import.meta.url);
const url = path => new URL(path, home).href;
const lesson = url("lessons/00/index.html");
const chapterQuizzes = { "00": quiz, "01": signalQuiz, "02": rigQuiz, "03": ampQuiz, "04": cabQuiz, "05": gainQuiz, "06": effectsQuiz, "07": routingQuiz, "08": rockQuiz, "09": metalQuiz, "10": presetQuiz, "11": diagnosisQuiz };
// URLs and saved progress keep the original zero-based IDs.
const chapterNumber = id => String(Number(id) + 1).padStart(2, "0");
const chapterIds = chapters.map(([id]) => id).filter(id => Object.hasOwn(chapterQuizzes, id));
const lessonUrls = Object.fromEntries(chapterIds.map(id => [id, url("lessons/" + id + "/index.html")]));
const lab = url("labs/signal-chain/index.html");
const labs = url("labs/index.html");
const page = document.body.dataset.page;
const exerciseName = page === "lab" ? new URLSearchParams(location.search).get("exercise") : null;
const rockChain = rockExerciseChain(exerciseName);
const exerciseChain = exerciseName === "intro" ? ["od","amp","cab"].map(id => ({id, on:true})) : rockChain ?? orderExerciseChain(exerciseName);
const lessonId = document.body.dataset.lesson || "00";
const lessonQuiz = chapterQuizzes[lessonId];
const progressKey = id => id === "00" ? "" : "lesson" + id;
const chapterProgress = (saved, id) => progressKey(id) ? saved[progressKey(id)] : saved;
const app = document.querySelector("#app");
const storageKey = "guitar-tone-lab:v1";
function readAnswers(value, questions) {
  const answers = {};
  questions.forEach(([, options], index) => {
    const answer = value?.[index];
    if (Number.isInteger(answer) && answer >= 0 && answer < options.length) answers[index] = answer;
  });
  return answers;
}

function load() {
  const state = { note: "", answers: {}, chain: initialChain() };
  for (const id of chapterIds.slice(1)) state[progressKey(id)] = { answers: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (typeof parsed?.note === "string") state.note = parsed.note;
    if (validChain(parsed?.chain)) state.chain = parsed.chain;
    state.board = parsed?.board ?? {};
    for (const id of chapterIds) {
      const prior = parsed ? chapterProgress(parsed, id) : undefined;
      const current = chapterProgress(state, id);
      current.answers = readAnswers(prior?.answers, chapterQuizzes[id]);
    }
  } catch { /* A fresh session is still usable. */ }
  return state;
}
const state = load();
const progress = chapterProgress(state, lessonId);
function save(field, message) {
  const status = document.querySelector("#save-status");
  try {
    localStorage.setItem(storageKey, JSON.stringify({ ...load(), [field]: state[field], ...(field === "chain" ? {board:state.board} : {}) }));
    if (status) status.textContent = message;
    return true;
  } catch {
    if (status) status.textContent = "此瀏覽器無法儲存，目前變更只保留在這個頁面。";
    return false;
  }
}

function navLink(href, label, key) {
  return `<a href="${href}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`;
}
const header = `<a class="skip" href="#main">跳到主要內容</a>
  <header class="top"><div class="wrap bar">
    <a class="brand" href="${home.href}"><svg class="pick-mark" aria-hidden="true" viewBox="0 0 48 48"><path fill="#554267" d="M24 3C15 3 5 7 5 15c0 10 11 24 17 29q2 2 4 0c6-5 17-19 17-29 0-8-10-12-19-12Z"/><path fill="none" stroke="#fff4df" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M11 22h6l3-8 4 17 4-13 2 4h7"/></svg><span class="brand-type">Guitar <em>Tone</em> Lab</span></a>
    <nav class="quick-nav" aria-label="快速導覽">${page !== "home" ? `<a class="home-btn" href="${home.href}">← 回音色首頁</a>` : ""}<a href="${labs}">練習室</a><a href="${home.href}#course">音色指南</a>${navLink(lab, "玩訊號鏈", "lab")}</nav>
    ${page === "home" ? "" : `<details class="chapter-menu"><summary>章節索引</summary><nav aria-label="主導覽">${navLink(home.href, "音色首頁", "home")}${chapterIds.map(id => navLink(lessonUrls[id], chapterNumber(id) + " " + chapters.find(row=>row[0]===id)[1], lessonId === id ? "lesson" : "")).join("")}${navLink(lab, "玩訊號鏈", "lab")}</nav></details>`}
  </div></header>`;
const footer = `<footer class="wrap footer"><span>Guitar Tone Lab</span>${page !== "home" ? `<a href="${home.href}">回音色首頁</a>` : ""}${/\/Tone-lab\/$/i.test(home.pathname) ? `<a href="${new URL("../",home).href}">回 Kai AI Workshop 首頁</a>` : ""}<a href="${home.href}#course">音色指南</a></footer>`;
const note = `<section class="note section" id="notes"><h2>音色筆記</h2>
  <label for="note-field">有想留著的音色或想法嗎？</label>
  <textarea id="note-field" maxlength="10000" rows="6" placeholder="例如：喜歡 Le Freak 裡夾在和弦之間的悶刷聲。"></textarea>
  <div class="actions"><button type="button" id="save-note" class="primary">儲存筆記</button><span class="muted">全站共用一份筆記，儲存在目前的瀏覽器。</span></div>
  <p class="feedback" id="save-status" role="status"></p>
</section>`;
// Display positions vary by chapter while saved answers retain their original IDs.
const answerLayouts = ["BACBC", "CCABA", "BABCA", "CBAAC", "ACBAC", "BCACB", "CACBB", "BBCCA", "ABCCB", "CBBAC", "CABAB", "BCCAA"];
function quizSection(questions, answers) {
  const layout = answerLayouts[Number(lessonId)];
  return `<section id="quiz" class="section"><details class="optional-check"><summary>自己試五題</summary><p class="muted">每題選完就能查看解析。</p>
    ${questions.map(([question, options, correct], i) => {
      const order = options.map((_, j) => j).filter(j => j !== correct);
      order.splice("ABC".indexOf(layout[i]), 0, correct);
      return `<fieldset><legend>${i + 1}. ${question}</legend>${order.map(j => `<label class="option"><input type="radio" name="q${i}" value="${j}" ${answers[i] === j ? "checked" : ""}> ${options[j]}</label>`).join("")}<p id="answer-${i}" aria-live="polite" class="answer"></p></fieldset>`;
    }).join("")}
    <button type="button" class="secondary" id="reset-quiz">重新作答</button></details>
  </section>`;
}

function readingShortcut() {
  let id;
  try { id = localStorage.getItem("guitar-tone-lab:last-lesson"); } catch { /* Storage is optional. */ }
  return chapterIds.includes(id)
    ? `<a href="${lessonUrls[id]}">繼續讀：${chapters.find(row => row[0] === id)[1]} ↗</a>`
    : "";
}

function homeContent() {
  return `<main class="wrap" id="main" tabindex="-1">
    <section class="desk-intro tone-door">
      <div class="desk-title"><h1>來玩音色吧<span>。</span></h1>
        <p>從喜歡的吉他聲開始。聽 AC/DC 的和弦怎麼收、U2 的回聲怎麼接，再拿手上的效果器試試。</p></div>
      <figure class="door-scene"><img src="${url("assets/home-pedal-shop.webp")}" width="1440" height="720" fetchpriority="high" alt="左格，吉他手低頭看著桌上的白色效果器。右格，螢幕裡的 Q 版主角站在單塊店中，笑著向她揮手。"></figure>
    </section>
    <section class="section" id="course" aria-labelledby="catalog-title">
      <div class="section-head"><h2 id="catalog-title">音色指南 · 完整目錄</h2>${readingShortcut()}</div>
      <ol class="chapter-directory">${chapters.map(([id, title]) => {
        const number = chapterNumber(id);
        const revision = number === "09" ? "-v2" : "";
        const cover = width => url(`assets/chapter-cover-${number}-${width}${revision}.webp`);
        const description = id === "00" ? "從 AC/DC 的和弦到 CHIC 的切音，聽懂四種吉他聲。" : topicPaths[id][0][1];
        return `<li><a href="${lessonUrls[id]}">
          <img src="${cover(480)}" srcset="${cover(480)} 480w, ${cover(800)} 800w" sizes="(min-width:1100px) 240px, (max-width:600px) 37vw, (max-width:1000px) 38vw, 365px" width="800" height="450" loading="lazy" decoding="async" alt="">
          <span><span class="chapter-num">${number}</span><strong>${title}</strong><small>${description}</small></span>
        </a></li>`;
      }).join("")}</ol>
    </section>
    <section class="stuck-strip"><h2>調音色卡住了？</h2><a href="${lessonUrls["03"]}#rhythm-gain">破音一開，和弦就糊了</a><a href="${lessonUrls["09"]}#metal-gate">Gate 把輕音吃掉了</a><a href="${lessonUrls["06"]}#lead-echo">回聲蓋過下一句</a></section>
    <section id="practice" class="desk-routes" aria-label="接著玩什麼">
      <a href="${labs}"><img src="${url("assets/tone-buddy-listen-close-v001.png")}" alt=""><span><strong>去聽 A/B</strong><small>去練習室，比一比回聲的尾巴。</small></span><b>↗</b></a>
      <a href="${lab}"><img src="${url("assets/tone-buddy-swap-v001.png")}" alt=""><span><strong>換個效果順序</strong><small>聽聽過載放在音箱前、後的差別。</small></span><b>↗</b></a>
    </section>

  </main>`;
}

function lessonContent(pager) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#classic-tones">四種經典音色</a><a href="#goal">建立音色目標</a><a href="#method">反推訊號鏈</a><a href="#experiment">Solo 的長音</a><a href="#terms">術語</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 01 章</p><h1>從想聽到的聲音出發</h1>
        <p class="lede">同樣是一把電吉他，硬搖滾的和弦一落下就有重量，Funk 吉他卻可以像小鼓一樣切出節奏。差別從手碰到弦的那一刻就開始了。</p>
      </header>
      <section class="section classic-tones" id="classic-tones"><h2>四首歌裡的吉他聲</h2>
        <p>聽熟悉的歌，挑一個瞬間就好：和弦斷開的空隙、低弦的衝勁，或是一個拉長的推弦。下面用原曲指路，MG-50Li 的選項是接近各段聽感的起點。機上名稱依<a href="https://nux.cherubtechnology.com/download/Manual/Effects/Multi_Effects/MG50Li/NUX_MG50Li_UserManual_English.pdf#page=14">NUX 手冊的 V1.0.8 內建效果參數表</a>。</p>
        <details open><summary>硬搖滾節奏｜AC/DC〈Back in Black〉</summary>
          <figure class="song-scene" id="back-in-black-stage"><img src="${url("assets/back-in-black-stage.webp")}" width="1440" height="600" alt="紫髮吉他手戴著學生帽、甩開紅領帶，背著白色 Les Paul 踢向舞台前方，台下跟著舉拳。"></figure>
          <p>開頭的和弦一齊撞進來，高音弦還帶著亮邊。和弦一收，鼓點就露出來。這段 Riff 的重量，一半來自重刷，一半來自和弦之間留出的空隙。</p>
          <p>原版唱片裡，右邊是 Angus Young 的 Gibson SG，左邊是 Malcolm Young 的 Gretsch。兄弟倆回憶錄這張專輯時，Angus 用 Marshall 100 瓦 Super Lead，Malcolm 用 Marshall 貝斯機頭彈吉他。開頭那記和弦的寬度，可以從左右兩把琴各自的亮邊去聽。<a href="https://www.bmi.com/advice/Tips_From_the_Top_Tony_Platt_on_Back_in_Black">錄音師 Tony Platt 談兩把吉他</a> · <a href="https://www.guitarworld.com/features/angus-malcolm-young-dirty-deeds">Young 兄弟談錄音用的音箱</a></p>
          <p>想靠近 Angus 那一側的聲音，MG-50Li 的 AMP 可選 <strong>PLEXI 100W</strong>，IR 搭 <strong>M 1960+G12M</strong>。前者取英式百瓦機頭重刷時的粗邊，後者提供箱體收音的輪廓。開頭那幾下和弦還能聽清高音弦，就已經有需要的咬勁。<a href="https://www.youtube.com/watch?v=pAgnJDJN4VA">聽 AC/DC 原曲</a></p></details>
        <details><summary>金屬低弦｜Metallica〈Master of Puppets〉</summary>
          <figure class="song-scene" id="puppet-theatre"><img src="${url("assets/puppet-theatre.webp")}" width="1440" height="576" loading="lazy" decoding="async" alt="紫髮吉他手踏上鑄鐵舞台，巨大的木偶從上方扯線，把聚光燈拉向她的白色 Les Paul。"></figure>
          <p>主 Riff 裡，低弦連續幾下短促有力，一放開悶音，和弦便整片響起來。手掌靠近琴橋限制弦的振動，讓密集的音符各有一道清楚的開頭。</p>
          <p>錄這張專輯時，Kirk Hammett 回憶多數段落混用了 Mesa/Boogie 和 Marshall 機頭。同名曲的厚度還有另一個來源：製作人 Rasmussen 說，節奏吉他至少疊了四軌，有些地方達八軌。每一遍下撥都得跟其他軌咬在一起。<a href="https://www.guitarworld.com/magazine/prime-cuts-metallicas-james-hetfield-and-kirk-hammett-critique-key-songs-band-s-harsh-noble-history">Hetfield 與 Hammett 訪談</a> · <a href="https://www.mixonline.com/recording/classic-tracks/classic-track-master-of-puppets-metallica">製作人 Flemming Rasmussen 談錄音</a></p>
          <p>在 MG-50Li 的 AMP 裡，<strong>Deep Image → CLAYMORE MKIII CRUSH</strong> 可以作為這類高增益節奏的起點，IR 可配 <strong>MBOS412+V30</strong>。一把琴先抓每一下低弦的起音；唱片裡左右疊奏的厚度來自好幾次演奏，把 Gain 繼續推高只會讓悶音更容易黏在一起。<a href="https://www.metallica.com/songs/master-of-puppets.html">Metallica 官方曲目與演出</a></p></details>
        <details><summary>Funk 切音｜CHIC〈Le Freak〉</summary>
          <p>這段節奏吉他裡，有些刷弦聽得出和弦，有些只剩一聲短短的「喀」。右手維持律動，左手一鬆壓、指尖仍貼著弦，琴弦就很快停下來。短和弦和悶刷交錯，吉他也成了打擊樂的一部分。</p>
          <p>Nile Rodgers 錄這首歌時，用的是綽號「Hitmaker」的 Fender Stratocaster。吉他經 DI 直接送進錄音系統，錄音室使用 Neve 8078 控台。原版裡那聲短短的「喀」，正好讓人聽見他鬆開左手以後，右手還在刷。<a href="https://www.soundonsound.com/techniques/classic-tracks-chic-le-freak">Nile Rodgers 回顧〈Le Freak〉錄音</a></p>
          <p>如果 MG-50Li 接耳機或全頻監聽，最貼近 DI 思路的選擇是旁路 <strong>AMP 和 IR</strong>，讓刷弦的尖峰直接通過。自己的琴若重拍特別突出，再於 CMP 選 <strong>STUDIO COMP</strong> 輕輕收住尖峰。短促的「喀」仍由左手鬆壓決定。<a href="https://www.youtube.com/watch?v=aXgSHL7efKg">聽 CHIC 原曲</a></p>
        <figure id="funk-release" class="song-scene"><img src="${url("assets/le-freak-dancefloor.webp")}" width="1440" height="576" loading="lazy" decoding="async" alt="鏡球下，紫髮吉他手坐在舞池邊刷著白色 Les Paul，朝踩著拍子指向她的舞者眨眼。"><figcaption>腳下的拍子一直走。仔細聽，吉他在短和弦之間塞了幾聲「喀」。</figcaption></figure></details>
        <details><summary>旋律型 Lead｜Guns N’ Roses〈Sweet Child O’ Mine〉</summary>
          <figure class="song-scene" id="rooftop-roses"><img src="${url("assets/rooftop-roses.webp")}" width="1440" height="576" loading="lazy" decoding="async" alt="主角戴上別著玫瑰的高帽，在落日屋頂閉眼彈奏，花瓣順著長音飛過觀眾頭頂。"></figure>
          <p>後段 Solo 的推弦像人聲把一個音唱上去。音高抵達後，揉弦讓長音繼續起伏。即使手指都停在同一格，這句旋律裡也有方向和重音。</p>
          <p>Slash 回憶錄《Appetite for Destruction》時，經理人替他找來一把手工製作的 Les Paul 仿製琴，裝了 Seymour Duncan 拾音器；他和製作人 Mike Clink 另外挑了一顆從 S.I.R. 租來的 Marshall 機頭。這是他錄專輯時的主奏器材背景。<a href="https://www.slashparadise.com/media/interviews-slash/return-to-the-jungle-guitar-one-june-2002.pdf">Slash 回顧《Appetite for Destruction》錄音</a></p>
          <p>手上的 Les Paul 接 MG-50Li，可以用 AMP 的 <strong>BRIT 800</strong> 配 IR 的 <strong>M 1960+G12M</strong> 取得英式破音底色。Gain 夠推弦延續到揉弦那一下就好；音高怎麼爬、在哪裡停，仍然要聽得到手指。<a href="https://www.youtube.com/watch?v=1w7OgIMMRc4">聽 Guns N’ Roses 原曲</a></p></details>

      </section>
      <section id="goal" class="section"><h2>第 4 拍停手時，你還想留下什麼聲音？</h2>
        
        <div class="editorial listening-example" data-art-slot="lesson00-tone-notes">
          <div><h3>一小節裡的強弱和空白</h3><p>想像前兩拍都是低弦悶音，第一下輕、第二下重。AMP 剛好在破音邊緣時，第二下會多一層粗糙的聲音。</p><p class="example-note">第三拍刷開和弦，聽得見各條弦一起響；第四拍把弦按停，留下來的回聲或殘響才特別明顯。「有力」可以來自第二拍的重音，「有空間」則可能藏在第四拍。</p></div>
          <figure class="editorial-art"><img src="${url("assets/listening-notebook-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手抱著白色 Les Paul Custom，托著下巴，桌上攤著筆記本。"></figure>
        </div>
        <p>你可以從明暗、低頻輪廓、強弱差、延音與空間尾音五個角度描述目標。同一個「厚」可能指較多低中頻、飽滿的延音，或錄音中左右各錄一軌的疊加感。指定哪個演奏動作會暴露差異，就能收斂該測什麼。</p>
      </section>
      <section id="method" class="section"><h2>從聽者的位置反推訊號鏈</h2>
        <figure class="diagram"><ol><li>吉他與演奏</li><li>效果與增益</li><li>擴大機（AMP）</li><li>箱體與收音（CAB／IR）</li><li>監聽</li></ol><figcaption>概念示意。實際順序取決於設備和接法。</figcaption></figure>
        <p>訊號鏈（Signal Chain）的每一段都會影響下一段。提高 AMP 前的電平，可能讓原本接近破音邊緣的 AMP 更早失真。提高一個仍有餘裕的線性後級電平，主要會讓結果更大聲。若聽到的是和弦糊成一團，先用這個差異決定要測哪個增益（Gain）。</p>
        <p>同一個 AMP 模型，從吉他喇叭和從耳機聽，亮度可能差很多。吉他喇叭本身就會替聲音染色；耳機直出時，常由箱體脈衝響應（IR）帶入喇叭和收音位置的特徵。</p>
        <div class="callout"><h3>常見誤判</h3><p>和弦不清楚，可能來自增益過高、低頻先推入失真，或 Reverb 尾音累積。分別降低增益、旁路空間效果來比對，再決定下一步。若是 Clean AMP，調高輸入電平也可能只增加音量，視該工作點是否開始失真而定。</p></div>
      </section>
      <section id="experiment" class="section"><h2>進 Solo 以後，為什麼長音容易被伴奏吃掉？</h2><p>聽〈Sweet Child O’ Mine〉後段的 Solo：推弦抵達音高後，還聽得見手指慢慢揉動。自己的琴若在這一刻就瘦下去，先聽它在哪裡消失。單獨彈，尾音也很快退掉，想補的是延音；單獨彈很飽滿，鼓和節奏吉他一進來才聽不清，要找的是旋律在伴奏裡的位置。</p>
        <div class="callout">
          <div><h3>踩下去以後，哪裡變了？</h3><p>節奏吉他手進 Solo 時，常用一顆 Overdrive 推音箱。像 MG-50Li 的 T SCREAMER 放在微破的 BRIT 800 前，輕撥也可能多一點沙啞。若關掉伴奏，原本的尾音其實一直都在，想調的就是旋律在合奏裡的音量或頻段。</p><p><a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 官方支援</a></p></div>
        </div>
        <p>同一顆踏板，為什麼有時讓聲音更厚，有時讓聲音更大？<a href="${lessonUrls["05"]}#boost">聽聽 Boost 放在失真級前後的差別</a>。</p>
        <a class="primary" href="${lab}?exercise=intro">操作 Signal Chain Builder</a>
        <p>節奏音色已經喜歡了？<a href="${lessonUrls["06"]}#lead-echo">看看 Delay 怎麼填進 Solo 的空拍 ↗</a></p>
      </section>
      <section id="terms" class="section"><h2>術語</h2>
        ${glossary.map(([zh, en, plain, principle, when]) => `<details><summary>${zh} <span class="muted">· ${en}</span></summary><p>${plain}</p><p><strong>原理</strong>　${principle}</p><p><strong>使用時機</strong>　${when}</p></details>`).join("")}
      </section>
      ${quizSection(lessonQuiz, progress.answers)}${note}${pager}
    </article>
  </main>`;
}
function labsContent() {
  const entries = [
    [lab, "排列自己的訊號鏈"],
    [lessonUrls["01"]+"#outputs","訊號從哪個出口走？"], [lessonUrls["02"]+"#rig","切 Scene 會動到什麼？"],
    [lessonUrls["06"]+"#delay","調整回聲間隔與次數"], [lessonUrls["09"]+"#metal-gate","調 Gate，保住輕音"], [lessonUrls["08"]+"#rock-practice","挑一個搖滾音色"],
    [lessonUrls["03"] + "#amp-practice", "AMP 控制"],
    [lessonUrls["04"] + "#cab-practice", "CAB／IR 比較"],
    [lessonUrls["05"] + "#gain-practice", "Gain Staging"],
    [lessonUrls["07"] + "#order", "效果順序"],
    [lessonUrls["11"] + "#frequency-explorer", "頻帶探索"],
    [lessonUrls["11"] + "#diagnosis", "音色診斷"],
    [lessonUrls["10"] + "#preset-record", "Preset 設計紀錄"],
  ];
  return `<main class="wrap lab-page" id="main" tabindex="-1">
    <header class="page-head listening-host"><img src="${url("assets/tone-buddy-listen-v001.png")}" width="92" height="92" alt=""><div><h1>練習室</h1><p class="lede">載入兩段自己的錄音比較音色，或試聽 Delay 的回聲。</p></div></header>
    <section class="section" id="audio-ab">
      <div class="lesson-sticker-row"><h2>用自己的錄音做 A/B</h2>
        <img src="${url("assets/ab-listen-still.webp")}" data-animated-src="${url("assets/ab-listen-loop.gif")}" width="240" height="240" loading="lazy" alt="">
      </div>
      <p>選擇你有權使用的兩段本機錄音。用同一段 Riff、相同起點，先把聽感音量拉近，再比較唯一改動。音檔由瀏覽器本機播放。</p>
      <div class="console audio-ab-grid">${["A","B"].map(letter => `<div>
        <label>${letter} 版錄音 <input class="preset-json-file" type="file" accept="audio/*"></label>
        <audio aria-label="${letter} 版錄音播放器" controls preload="metadata"></audio>
        <p class="feedback" role="status"></p>
      </div>`).join("")}</div>
      <figure hidden id="ab-second-thought" class="song-scene" style="max-width:24rem"><img src="${url("assets/ab-second-thought.webp")}" width="800" height="308" alt="她聽得很有把握，在便條紙上打勾；再聽一次，又偷偷拿起橡皮擦。"></figure>
    </section>
    ${listeningExercise()}
    <section class="section"><h2>挑一個練習</h2>
      <ul class="lab-directory">${entries.map(([href,label]) => `<li><a class="secondary" href="${href}">${label}</a></li>`).join("")}</ul>
    </section>

  </main>`;
}

function labContent() {
  const exerciseChapter = rockChain ? "08" : exerciseName === "intro" ? "00" : "07";
  const context = exerciseChain
    ? `<p class="amp-observation">${rockChain ? recipes[exerciseName.slice(5)].name + "。" + recipes[exerciseName.slice(5)].cue : exerciseName === "intro" ? "只切換 Overdrive，預測第 2 拍的起音會怎麼變。" : ""} 已載入第 ${chapterNumber(exerciseChapter)} 章的順序範例。按「儲存訊號鏈」才會將它寫入存檔。 <a href="${lab}">開啟已儲存的訊號鏈</a></p>`
    : "";
  const source = exerciseChain
    ? lessonUrls[exerciseChapter] + "?exercise=" + encodeURIComponent(exerciseName) + (rockChain ? "#rock-practice" : exerciseName === "intro" ? "#experiment" : "#order")
    : lesson + "#experiment";
  const backLabel = exerciseChain ? "返回第 " + chapterNumber(exerciseChapter) + " 章練習" : "返回第 01 章實驗步驟";
  return `<main class="wrap lab-page" id="main" tabindex="-1">
    <header class="page-head"><p class="eyebrow">訊號鏈實驗室</p><h1>Signal Chain Builder</h1>
      <p class="lede">這裡用合成 Riff 聽效果順序。以 MG-50Li 為例，6-BAND EQ 放在 T SCREAMER 前可收緊低弦，放在後面則能修整破音的厚度。點選模組可查看對應的機上選項。</p>${context}
    </header>
    <section class="console" aria-labelledby="routing-title">
      <div class="section-head"><h2 id="routing-title">訊號鏈工作桌</h2><label>外觀 <select id="skin"><option value="lcd">電子介面</option><option value="pedal">單塊桌面</option></select></label></div>
      <div class="workdesk" id="desk"><div class="patchbar"><b>01A</b> Riff &amp; Echo <select aria-label="訊號路由" id="route"><option value="serial">串聯 Serial</option><option value="parallel">並聯 Parallel</option><option value="split">分送 Split · L / R</option></select></div>
      <div class="track-scroll"><ol id="chain" class="chain"></ol></div>
      <div class="inspector"><strong id="picked"></strong><div id="edit-actions"></div><div id="dial-label"></div></div></div>
      <div class="actions"><button type="button" id="riff">▶ 播放 Riff</button><small>合成吉他循環 · 教學效果模型</small></div>
      <p class="muted" id="route-help"></p>
      <div class="actions lab-actions">
        <img hidden id="two-pedals" width="90" height="90" src="${url("assets/two-pedals.webp")}" alt=""><label for="block-select">加入 Block</label><select id="block-select"></select><button type="button" id="add-block" class="secondary">加入</button>
        <button type="button" id="reset-chain" class="secondary">重置</button><button type="button" id="save-chain" class="primary">儲存訊號鏈</button>
      </div>
      <p role="status" id="lab-status" class="feedback"></p>
    </section>
    <section class="section chain-reaction" aria-labelledby="observations-title"><img hidden src="${url("assets/tone-buddy-swap-v001.png")}" width="88" height="88" alt=""><h2 id="observations-title">這個順序可能帶來什麼？</h2><ul id="observations"></ul></section>
    ${note}<a href="${source}">${backLabel}</a>
  </main>`;
}

function chapterPager(index) {
  function neighbor(offset, direction, label) {
    const chapter = chapters[index + offset];
    if (!chapter) return "";
    const [id, title] = chapter;
    return `<a class="pager-${direction}" href="${lessonUrls[id]}"><small>${label} · ${chapterNumber(id)}</small><strong>${title}</strong></a>`;
  }
  return `<nav class="chapter-pager" aria-label="章節導覽">${neighbor(-1,"prev","上一章")}<a class="pager-index" href="${home.href}#course">回完整目錄</a>${neighbor(1,"next","下一章")}</nav>`;
}
function currentLesson() {
  const render = { "01": signalLesson, "02": rigLesson, "03": ampLesson, "04": cabLesson, "05": gainLesson, "06": effectsLesson, "07": routingLesson, "08": rockLesson, "09": metalLesson, "10": presetLesson, "11": diagnosisLesson }[lessonId];
  const index = chapterIds.indexOf(lessonId);
  const pager = chapterPager(index);
  if (!render) return lessonContent(pager);
  return render({
    previous: lessonUrls[chapterIds[index - 1]],
    quiz: quizSection(lessonQuiz, progress.answers),
    listeningExercise,
    note,
    pager,
  });
}
const renderPage = { lesson: currentLesson, lab: labContent, labs: labsContent, home: homeContent }[page] ?? homeContent;
app.innerHTML = header + renderPage() + footer;

if(page==="home"){
  const resolveOldGuide=()=>{
    if(!["#understand","#play-tone"].includes(location.hash)) return;
    history.replaceState(null,"","#course");
    document.getElementById("course").scrollIntoView();
  };
  resolveOldGuide();
  window.addEventListener("hashchange",resolveOldGuide);
}
if(page==="lesson"){
  const paths=topicPaths[lessonId];
  paths.forEach(([anchor],i)=>{
    const section=document.getElementById(anchor)?.closest("section");
    if(!section || lessonId==="06") return;
    const [nextAnchor,label]=paths[1-i];
    const link=document.createElement("a");
    link.className="topic-bridge";
    link.href="#"+nextAnchor;
    link.textContent=label+" ↗";
    section.append(link);
  });
}

const contents = document.querySelector(".contents");
if (contents) {
  const menu = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "本章目錄";
  menu.append(summary, contents.querySelector("nav"));
  const locationLine=document.createElement("p");
  locationLine.className="chapter-location";
  const title=chapters.find(([id])=>id===lessonId)[1];
  locationLine.innerHTML=`<a href="${home.href}#course">音色指南</a><span>第 ${chapterNumber(lessonId)} 章 · ${title}</span>`;
  contents.replaceChildren(locationLine,menu);
}
const mobileLayout = matchMedia("(max-width: 760px)");
const menus = document.querySelectorAll(".contents details");
function syncMenus() {
  for (const menu of menus) menu.open = !mobileLayout.matches;
}
syncMenus();
mobileLayout.addEventListener("change", syncMenus);

const noteField = document.querySelector("#note-field");
if (noteField) {
  noteField.value = state.note;
  document.querySelector("#save-note").addEventListener("click", () => {
    state.note = noteField.value;
    save("note", "音色筆記已儲存");
  });
}

if (page === "lesson") {
  try { localStorage.setItem("guitar-tone-lab:last-lesson", lessonId); } catch { /* Reading works without storage. */ }
  const saveProgress = (field, message) => {
    const key = progressKey(lessonId);
    if (key) state[key] = { ...chapterProgress(load(), lessonId), [field]: progress[field] };
    save(key || field, message);
  };
  lessonQuiz.forEach(([, , correct, explanation], index) => {
    const feedback = document.querySelector("#answer-" + index);
    const paint = () => {
      if (Number.isInteger(progress.answers[index])) {
        feedback.textContent = (progress.answers[index] === correct ? "答對了。 " : "再想一下。 ") + explanation;
      }
    };
    paint();
    for (const radio of document.querySelectorAll('[name="q' + index + '"]')) radio.addEventListener("change", () => {
      const latestAnswers = chapterProgress(load(), lessonId).answers;
      progress.answers = { ...latestAnswers, [index]: Number(radio.value) };
      paint();
      saveProgress("answers", "答案已儲存");
    });
  });
  document.querySelector("#reset-quiz").addEventListener("click", () => {
    progress.answers = {};
    for (const radio of document.querySelectorAll('#quiz input[type="radio"]')) radio.checked = false;
    for (const answer of document.querySelectorAll("#quiz .answer")) answer.textContent = "";
    saveProgress("answers", "已清除測驗答案");
  });
  const route = document.querySelector("#monitor-route");
  if (route) for (const radio of document.querySelectorAll('[name="monitor-path"]')) {
    radio.addEventListener("change", () => { route.innerHTML = renderSignalPath(Number(radio.value)); });
  }
  const rig = document.querySelector("#rig-practice");
  if (rig) mountRigPractice(rig);
  const ampLab = document.querySelector("#amp-lab");
  if (ampLab) mountAmpPractice(ampLab);
  const cabLab = document.querySelector("#cab-lab");
  if (cabLab) mountCabPractice(cabLab);
  const gainLab = document.querySelector("#gain-lab");
  if (gainLab) mountGainPractice(gainLab);
  const delayLab = document.querySelector("#delay-lab");
  if (delayLab) mountDelayPractice(delayLab);
  const reverbLab = document.querySelector("#reverb-lab");
  if (reverbLab) mountReverbPractice(reverbLab);
  const orderLab = document.querySelector("#order-lab");
  if (orderLab) mountOrderPractice(orderLab);
  const rockLab = document.querySelector("#rock-lab");
  if (rockLab) mountRockPractice(rockLab);
  const metalLab = document.querySelector("#metal-lab");
  if (metalLab) mountMetalPractice(metalLab);
  const presetForm = document.querySelector("#preset-workbook");
  if (presetForm) mountPresetPractice(presetForm);
  const diagnosisLab = document.querySelector("#diagnosis-lab");
  if (diagnosisLab) mountDiagnosisPractice(diagnosisLab);
  const frequencyExplorer = document.querySelector("#frequency-explorer");
  if (frequencyExplorer) mountFrequencyExplorer(frequencyExplorer);


}

const motion = matchMedia("(prefers-reduced-motion: reduce)");
const stickers = document.querySelectorAll("img[data-animated-src]");
if (stickers.length && !motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const { target, intersectionRatio } of entries) {
      if (intersectionRatio < 0.5) continue;
      observer.unobserve(target);
      if (!motion.matches) target.src = target.dataset.animatedSrc;
    }
  }, { threshold: 0.5 });
  stickers.forEach(sticker => observer.observe(sticker));
}

if (page === "lab") {
  let chain = (exerciseChain ?? state.chain).map(item => ({ ...item }));
  let dragging = "";
  const list = document.querySelector("#chain");
  const observations = document.querySelector("#observations");
  const select = document.querySelector("#block-select");
  const add = document.querySelector("#add-block");
  const notice = document.querySelector("#lab-status");
  const swapSticker = document.querySelector(".chain-reaction img");
  function eqDriveOrder() {
    const eq = chain.findIndex(block => block.id === "eq" && block.on);
    const od = chain.findIndex(block => block.id === "od" && block.on);
    return eq < 0 || od < 0 ? null : eq < od;
  }
  const el = id => document.getElementById(id);
  const route = el("route"), skin = el("skin");
  const saved = exerciseChain ? {} : state.board ?? {};
  route.value = ["parallel","split"].includes(saved.route) ? saved.route : "serial";
  skin.value = saved.skin === "pedal" ? "pedal" : "lcd";
  let picked = chain[0]?.id;
  const params = {od:["Drive",1,12,5],amp:["Drive",1,12,3],eq:["低頻 dB",-15,15,-6],cab:["截止頻率 Hz",700,6500,3200],delay:["Time ms",100,800,375],reverb:["殘響量 %",0,80,30],gate:["閾值 dB",-65,-20,-45],comp:["壓縮比",1,12,4]};
  const value = item => Number.isFinite(item.value) ? Math.max(params[item.id][1],Math.min(params[item.id][2],item.value)) : params[item.id][3];
  const icons={
    od:"M2 19h5l5-11h6l-2 12h6l6-12h9",amp:"M3 5h32v20H3z M4 13h29 M8 9h4m4 0h4 M8 18h22m-22 3h22",
    cab:"M3 4h32v22H3z M15 15a4 4 0 1 0-8 0 4 4 0 1 0 8 0 M30 15a4 4 0 1 0-8 0 4 4 0 1 0 8 0",
    delay:"M2 22h4V5h4v17h6V10h4v12h6v-8h4v8h5",eq:"M6 4v21M18 4v21M30 4v21 M2 9h8m4 9h8m4-12h8",
    gate:"M2 23h11V7h12v16h11",comp:"M3 25L17 11l17-5",reverb:"M2 22l4-17 4 18 4-15 4 15 4-11 4 11 4-7 4 7"
  };
  const playback = builderPlayer();
  function refreshAudio(){ playback.update(chain,route.value,value); }
  function render(){
    swapSticker.hidden = true;
    el("two-pedals").hidden = chain.length !== 0;
    if (!chain.some(x=>x.id===picked)) picked=chain[0]?.id;
    el("desk").dataset.skin=skin.value;
    const branched=route.value!=="serial";
    const fork=branched ? chain.findIndex(x=>x.wet) : -1;
    let upper=0,lower=0;
    const tiles=chain.map((item,i)=>{
      const wet=branched && item.wet;
      const column=wet ? fork+2+lower++ : 2+upper++;
      const name=blocks[item.id][0];
      return `<li data-id="${item.id}" style="grid-column:${column};grid-row:${wet?2:1}" title="${name} · ${item.on?"啟用":"旁路"}" class="module ${item.on?"":"off"}" draggable="true"><button type="button" aria-pressed="${picked===item.id}" aria-label="${name}，${item.on?"啟用":"旁路"}"><svg aria-hidden="true" viewBox="0 0 38 30"><path d="${icons[item.id]}"/></svg>${name}</button></li>`;
    });
    const end=Math.max(upper+2,fork+2+lower,3);
    list.style.gridTemplateColumns=`4rem repeat(${end-2},minmax(6rem,1fr)) 5rem`;
    list.innerHTML=`<li class="jack" style="grid-column:1;grid-row:1">IN</li>${tiles.join("")}<li class="jack" style="grid-column:${end};grid-row:1">${route.value==="split"?"OUT L":"OUT"}</li>`+
      (fork>=0 ? `<li aria-hidden="true" class="spur ${route.value}" style="grid-column:${fork+2}/${end+1};grid-row:1/3"></li>` : "")+
      (route.value==="split" ? `<li class="jack" style="grid-column:${end};grid-row:2">OUT R</li>`:"");
    list.dataset.route=route.value;
    const item=chain.find(x=>x.id===picked);
    el("picked").textContent=item ? blocks[picked][0] + "｜MG-50Li 對照：" + mgExamples[picked] : "訊號直通";
    const actions=el("edit-actions");
    actions.innerHTML=item ? [["earlier","← 前移"],["later","後移 →"],["toggle",item.on?"旁路":"啟用"],...(branched?[["lane",item.wet?"移到主線":"移到支線"]]:[]),["remove","移除"]].map(([a,t])=>`<button type="button" data-action="${a}" ${(a==="earlier"&&item===chain[0]||a==="later"&&item===chain.at(-1))?"disabled":""}>${t}</button>`).join("") : "";
    const sliders=item ? [[params[picked][0],"value",params[picked][1],params[picked][2],value(item)]] : [];
    if(picked==="delay"){
      sliders.push(["Feedback %","feedback",0,80,item.feedback??35]);
      if(!branched||!item.wet) sliders.push(["Mix %","mix",0,100,item.mix??25]);
    }
    el("dial-label").innerHTML=sliders.map(([label,key,min,max,n])=>`<label>${label} <input data-key="${key}" type="range" min="${min}" max="${max}" value="${n}"><output>${n}</output></label>`).join("");
    el("route-help").textContent=route.value==="serial"?"由左向右串聯。拖曳模組換序，或點選後用前移、後移。":route.value==="parallel"?"第一顆支線模組之前共用同一段訊號。分岔後上下兩路在 OUT 合流，支線 Delay 只送回聲。":"第一顆支線模組之前共用同一段訊號，之後主線送左聲道、支線送右聲道。戴耳機可分開聽。";
    refreshAudio();
    const remaining = Object.entries(blocks).filter(([id]) => !chain.some(item => item.id === id));
    select.innerHTML = remaining.length ? remaining.map(([id, data]) => `<option value="${id}">${data[0]}</option>`).join("") : "<option>所有 Block 都已加入</option>";
    select.disabled = add.disabled = remaining.length === 0;
    observations.replaceChildren(...(fork<0 ? chainObservations(chain) : [route.value==="split"?"左右聲道分開輸出，可輪流旁路兩路的效果來比較。":"主線和支線相加。兩路都保留乾音時，合流的音量也會改變。"]).map(description => {
      const item = document.createElement("li");
      item.textContent = description;
      return item;
    }));
  };
  function reorder(id, destination, action) {
    const start = chain.findIndex(item => item.id === id);
    if (start < 0 || destination < 0 || destination >= chain.length || start === destination) return;
    const previousOrder = eqDriveOrder();
    if (!action && route.value!=="serial") chain[start].wet=Boolean(chain[destination].wet);
    const [item] = chain.splice(start, 1);
    chain.splice(destination, 0, item);
    render();
    swapSticker.hidden = previousOrder === eqDriveOrder();
    notice.textContent = blocks[id][0] + " 已移到第 " + (destination + 1) + " 個位置";
    if (action) el("edit-actions").querySelector(`[data-action="${action}"]:enabled`)?.focus();
  }
  list.addEventListener("click",event=>{
    const tile=event.target.closest("[data-id]");
    if(tile){picked=tile.dataset.id;render();list.querySelector(`[data-id="${picked}"] button`).focus();}
  });
  el("edit-actions").addEventListener("click",event=>{
    const action=event.target.dataset.action, i=chain.findIndex(x=>x.id===picked);
    if(i<0||!action)return;
    if(action==="earlier"||action==="later")return reorder(picked,i+(action==="earlier"?-1:1),action);
    if(action==="toggle")chain[i].on=!chain[i].on;
    if(action==="lane")chain[i].wet=!chain[i].wet;
    if(action==="remove")chain.splice(i,1);
    render();
    (el("edit-actions").querySelector(`[data-action="${action}"]:enabled`)||add).focus();
  });
  el("dial-label").addEventListener("input",event=>{
    chain.find(x=>x.id===picked)[event.target.dataset.key]=event.target.valueAsNumber;
    event.target.nextElementSibling.value=event.target.value;refreshAudio();
  });
  skin.addEventListener("change",()=>{el("desk").dataset.skin=skin.value;});
  route.addEventListener("change",()=>{
    if(route.value!=="serial"&&!chain.some(x=>x.wet)){
      let delay=chain.find(x=>x.id==="delay");
      if(!delay){delay={id:"delay",on:true};chain.push(delay);}
      delay.wet=true;picked="delay";
    }
    render();
  });
  el("riff").addEventListener("click",async()=>{
    try {await playback.toggle();refreshAudio();el("riff").textContent=playback.active()?"■ 停止":"▶ 播放 Riff";}
    catch {playback.stop();el("riff").textContent="▶ 播放 Riff";notice.textContent="瀏覽器未能啟動音訊。";}
  });
  window.addEventListener("pagehide",()=>{playback.stop();el("riff").textContent="▶ 播放 Riff";});
  list.addEventListener("dragstart", event => {
    dragging = event.target.closest("[data-id]")?.dataset.id || "";
    if (dragging) event.dataTransfer.setData("text/plain", dragging);
  });
  list.addEventListener("dragover", event => {
    if (dragging && event.target.closest("[data-id]")) event.preventDefault();
  });
  list.addEventListener("drop", event => {
    const target = event.target.closest("[data-id]");
    if (!target || !dragging) return;
    event.preventDefault();
    reorder(dragging, chain.findIndex(item => item.id === target.dataset.id));
    dragging = "";
  });
  list.addEventListener("dragend", () => { dragging = ""; });
  add.addEventListener("click", () => {
    const id = select.value;
    if (!Object.hasOwn(blocks, id) || chain.some(item => item.id === id)) return;
    chain.push({ id, on: true }); picked=id;
    render();
    list.querySelector(`[data-id="${id}"] button`).focus();
    notice.textContent = blocks[id][0] + " 已加入";
  });
  document.querySelector("#reset-chain").addEventListener("click", () => {
    route.value="serial";
    chain = exerciseChain ? exerciseChain.map(item => ({ ...item })) : initialChain();
    render();
    notice.textContent = exerciseChain ? "已還原本章範例的順序。" : "已恢復初始訊號鏈。按儲存可覆蓋先前存檔。";
  });
  document.querySelector("#save-chain").addEventListener("click", () => {
    state.board={route:route.value,skin:skin.value};
    state.chain = chain.map(item => ({ ...item }));
    notice.textContent = save("chain", "訊號鏈已儲存") ? "訊號鏈已儲存於此瀏覽器" : "無法儲存，請確認瀏覽器的儲存設定。";
  });
  render();
}
if (page === "labs") {
  const cards = document.querySelectorAll(".audio-ab-grid > div");
  const players = [...cards].map(card => card.querySelector("audio"));
  const heard = new Set();
  const reaction = document.getElementById("ab-second-thought");
  for (const [index, card] of cards.entries()) {
    const input = card.querySelector("input");
    const player = players[index];
    const status = card.querySelector("[role=status]");
    let audioUrl;
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      heard.delete(index);
      reaction.hidden = true;
      player.pause();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = URL.createObjectURL(file);
      player.src = audioUrl;
      status.textContent = "已選擇 " + file.name;
    });
    player.addEventListener("playing", () => {
      heard.add(index);
      reaction.hidden = heard.size !== players.length;
    });
    player.addEventListener("error", () => {
      status.textContent = "瀏覽器無法播放這個檔案。可以換用 PCM WAV 或 MP3 測試。";
    });
    player.addEventListener("play", () => { const other = players[1-index]; stopListening?.(); if (!other.paused) { const time=other.currentTime; other.pause(); if(Number.isFinite(player.duration)) player.currentTime=Math.min(time,player.duration); } });
  }
}
if (location.hash) requestAnimationFrame(() => {
  const target = document.getElementById(location.hash.slice(1));
  if (target) {
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
    target.scrollIntoView();
  }
});

// Render the same synthetic guitar take through two controlled processing paths.
function listeningPair(context) {
  const rate = 24000;
  const length = rate * 3;
  const dry = new Float32Array(length);
  function pluck(start, hz, duration, level) {
    const offset = Math.round(start * rate);
    for (let i = 0; i < duration * rate; i++) {
      const t = i / rate;
      let sample = 0;
      for (let h = 1; h <= 14; h++) {
        sample += Math.sin(2 * Math.PI * hz * h * t) * Math.exp(-t * (4 + h)) / h;
      }
      dry[offset + i] += sample * level * Math.min(1, i / 30, (duration * rate - i) / 100);
    }
  }
  for (const [index, hz] of [82.41,123.47,164.81].entries()) pluck(index * .008, hz, .32, .32);
  return [0,1].map(version => {
    const buffer = context.createBuffer(1,length,rate);
    const samples = buffer.getChannelData(0);
    const repeats = new Float32Array(length);
    for (let i=0; i<length; i++) {
      const amp = Math.tanh(3 * dry[i]);
      const prev = i - rate * .375;
      repeats[i] = prev < 0 ? 0 : ampSignal(prev) + repeats[prev] * (version ? .65 : .15);
      samples[i] = .45 * (amp + .45 * repeats[i]);
    }
    return buffer;
  });
  function ampSignal(i) { return Math.tanh(3 * dry[i]); }
}

function listeningExercise() {
  return `<section class="console audition" data-listen="delay">
    <h3>哪一版的回聲留得久？</h3><p class="audition-source">合成吉他 · 短和弦與回聲</p><p>在 MG-50Li 上，可把 DLY 的 DIGITAL DELAY 串在 AMP 後。保持 D.TIME 相同，增加 F.BACK，後面的回聲就會多留幾下。</p>
    <div class="audition-keys">${["A","B"].map((label,i)=>`<button type="button" data-play="${i}" aria-label="播放 ${label}" aria-pressed="false"><i aria-hidden="true"></i><strong>${label}</strong><span>播放</span></button>`).join("")}</div>
    <div class="transport"><span>切換時接在同一拍</span><button type="button" data-stop>■ 停止</button></div>
    <div class="audition-vote">${["A","B"].map((label,i)=>`<button type="button" data-answer="${i}">我選 ${label}</button>`).join("")}</div>
    <p role="status" data-feedback></p></section>`;
}

let stopListening;
for (const panel of document.querySelectorAll("[data-listen]")) {
  const target = Math.random() < .5 ? 0 : 1;
  const answer = target ? "B" : "A";
  let ctx, buffers, sources = [], gains = [];
  const stop = () => {
    for(const source of sources) { source.stop(); source.disconnect(); }
    for(const gain of gains) gain.disconnect();
    sources=[]; gains=[];
    panel.querySelectorAll("[data-play]").forEach(b=>b.setAttribute("aria-pressed","false"));
  };
  panel.querySelector("[data-stop]").onclick = stop;
  panel.querySelectorAll("[data-play]").forEach((button,index) => {
    button.onclick = async () => {
      try {
        ctx ??= new AudioContext();
        await ctx.resume();
        if (stopListening !== stop) stopListening?.();
        stopListening = stop;
        document.querySelectorAll("audio").forEach(a=>a.pause());
        if (!sources.length) {
          buffers ??= listeningPair(ctx);
          const start = ctx.currentTime + .025;
          buffers.forEach((_,i) => {
            const src=ctx.createBufferSource(), gain=ctx.createGain();
            src.buffer=buffers[i === target ? 1 : 0]; src.loop=true; gain.gain.value=Number(i===index);
            src.connect(gain).connect(ctx.destination); src.start(start);
            sources.push(src); gains.push(gain);
          });
        }
        gains.forEach((gain,i)=>gain.gain.setTargetAtTime(Number(i===index),ctx.currentTime,.006));
        panel.querySelectorAll("[data-play]").forEach((b,i)=>b.setAttribute("aria-pressed",String(i===index)));
      } catch { panel.querySelector("[data-feedback]").textContent="無法播放，請確認瀏覽器允許音訊後重試。"; }
    };
  });
  panel.querySelectorAll("[data-answer]").forEach((button,index)=>button.onclick=()=>{
    panel.querySelector("[data-feedback]").textContent = (index===target ? "答對了。" : "再聽一次 " + answer + "。") + "兩版的回聲間隔都是 375 ms。" + answer + " 的 Feedback 較高，後幾下衰減較慢。";
  });
  window.addEventListener("pagehide",stop);
}

// Render two passes so delayed samples from the previous bar reach the loop seam.
function builderPlayer() {
  const rate=24000, bar=rate*2;
  const riff=new Float32Array(bar*2);
  for(const [beat,notes,level,length] of [[0,[82.41],.4,.14],[.5,[82.41],.75,.21],[1,[82.41,123.47,164.81],.5,.51]]){
    notes.forEach((hz,n)=>{
      for(let i=0;i<length*rate;i++){
        const t=i/rate, phase=2*Math.PI*hz*t;
        const attack=Math.min(1,i/60,(length*rate-i)/140);
        const sample=.35*level*attack*Math.exp(-5*t)*(Math.sin(phase)+.45*Math.sin(2*phase)+.24*Math.sin(3*phase)+.12*Math.sin(7*phase));
        const offset=Math.floor((beat+n*.008)*rate)+i;
        riff[offset]+=sample;riff[offset+bar]+=sample;
      }
    });
  }
  function process(input,item,amount,wet){
    if(!item.on)return input;
    const out=new Float32Array(input.length);
    let low=0, env=0;
    const cutoff=item.id==="eq"?280:amount;
    const alpha=1-Math.exp(-2*Math.PI*cutoff/rate);
    const gain=10**(amount/20), lag=Math.round(rate*amount/1000);
    const echoes=new Float32Array(input.length);
    const feedback=(item.feedback??35)/100, mix=(item.mix??25)/100;
    for(let i=0;i<input.length;i++){
      const x=input[i];
      switch(item.id){
        case "od": case "amp": out[i]=Math.tanh(x*amount*(item.id==="amp"?1.4:2))/Math.sqrt(amount);break;
        case "cab": low+=alpha*(x-low);out[i]=low;break;
        case "eq": low+=alpha*(x-low);out[i]=x+(gain-1)*low;break;
        case "gate": case "comp":
          env=Math.max(Math.abs(x),env*.998);
          out[i]=item.id==="gate"?x*Math.min(1,env/gain):x*(env>.1?(.1+(env-.1)/amount)/env:1);break;
        case "delay":
          echoes[i]=i>=lag?input[i-lag]+feedback*echoes[i-lag]:0;
          out[i]=wet?echoes[i]:(1-mix)*x+mix*echoes[i];break;
        case "reverb":
          echoes[i]=(i>1031?input[i-1031]:0)+(i>1657?.45*echoes[i-1657]:0)+(i>2273?.33*echoes[i-2273]:0);
          out[i]=x+amount/100*echoes[i];break;
      }
    }
    return out;
  }
  let ctx, source, fader, origin=0, playing=false;
  function release(){
    if(!source)return;
    const old=source, gain=fader;
    gain.gain.setTargetAtTime(0,ctx.currentTime,.008);
    old.onended=()=>{old.disconnect();gain.disconnect();};
    old.stop(ctx.currentTime+.05);source=null;
  }
  return {
    active:()=>playing,
    stop(){playing=false;release();},
    async toggle(){
      if(playing){this.stop();return;}
      ctx??=new AudioContext();playing=true;
      await ctx.resume();origin=ctx.currentTime;
    },
    update(chain,route,value){
      if(!playing||ctx.state!=="running")return;
      let main=riff, branch=null;
      for(const item of chain){
        if(route!=="serial" && item.wet){
          branch=process(branch??main,item,value(item),true);
        }else main=process(main,item,value(item),false);
      }
      const stereo=route==="split";
      const buffer=ctx.createBuffer(stereo?2:1,bar,rate);
      for(let ch=0;ch<buffer.numberOfChannels;ch++){
        const out=buffer.getChannelData(ch);
        for(let i=0;i<bar;i++){
          const j=i+bar, x=main[j], y=branch?.[j]??0;
          out[i]=.55*Math.tanh(stereo?(ch?y:x):x+(route==="parallel"?.45*y:0));
        }
      }
      release();
      source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
      fader=ctx.createGain();fader.gain.value=0;source.connect(fader).connect(ctx.destination);
      const now=ctx.currentTime;fader.gain.setTargetAtTime(1,now,.008);
      source.start(now,(now-origin+2)%2);
    }
  };
}
