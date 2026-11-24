import { chapters, groups, glossary, quiz } from "./course.js";
import { blocks, initialChain, validChain, chainObservations, orderExerciseChain } from "./chain.js";
import { signalLesson, signalQuiz, renderSignalPath } from "./lesson01.js";
import { rigLesson, rigQuiz, mountRigPractice } from "./lesson02.js";
import { ampLesson, ampQuiz, mountAmpPractice } from "./lesson03.js";
import { cabLesson, cabQuiz, mountCabPractice } from "./lesson04.js";
import { gainLesson, gainQuiz, mountGainPractice } from "./lesson05.js";
import { effectsLesson, effectsQuiz, mountDelayPractice, mountReverbPractice } from "./lesson06.js";
import { routingLesson, routingQuiz, mountOrderPractice } from "./lesson07.js";
import { rockLesson, rockQuiz, recipes, rockExerciseChain, mountRockPractice } from "./lesson08.js";
import { metalLesson, metalQuiz, mountMetalPractice } from "./lesson09.js";
import { presetLesson, presetQuiz, mountPresetPractice } from "./lesson10.js";
import { diagnosisLesson, diagnosisQuiz, mountDiagnosisPractice, mountFrequencyExplorer } from "./lesson11.js";

const home = new URL("./", import.meta.url);
const url = path => new URL(path, home).href;
const lesson = url("lessons/00/index.html");
const chapterQuizzes = { "00": quiz, "01": signalQuiz, "02": rigQuiz, "03": ampQuiz, "04": cabQuiz, "05": gainQuiz, "06": effectsQuiz, "07": routingQuiz, "08": rockQuiz, "09": metalQuiz, "10": presetQuiz, "11": diagnosisQuiz };
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
  const state = { note: "", completed: false, answers: {}, chain: initialChain() };
  for (const id of chapterIds.slice(1)) state[progressKey(id)] = { completed: false, answers: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (typeof parsed?.note === "string") state.note = parsed.note;
    if (validChain(parsed?.chain)) state.chain = parsed.chain;
    state.board = parsed?.board ?? {};
    for (const id of chapterIds) {
      const prior = parsed ? chapterProgress(parsed, id) : undefined;
      const current = chapterProgress(state, id);
      current.completed = prior?.completed === true;
      current.answers = readAnswers(prior?.answers, chapterQuizzes[id]);
    }
  } catch { /* A fresh session is still usable. */ }
  return state;
}
const state = load();
const progress = chapterProgress(state, lessonId);
const completed = Object.fromEntries(chapterIds.map(id => [id, chapterProgress(state, id).completed]));
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
    <nav class="quick-nav" aria-label="快速導覽">${page !== "home" ? `<a class="home-btn" href="${home.href}">← 回音色首頁</a>` : ""}<a href="${labs}">練習室</a><a href="${home.href}#course">課程地圖</a>${page === "lesson" ? [["上一章", -1], ["下一章", 1]].map(([label, offset]) => {
      const href = lessonUrls[chapterIds[chapterIds.indexOf(lessonId) + offset]];
      return href ? `<a href="${href}">${label}</a>` : "";
    }).join("") : navLink(lab, "訊號鏈實驗", "lab")}</nav>
    <details class="chapter-menu"><summary>全部章節</summary><nav aria-label="主導覽">${navLink(home.href, "課程首頁", "home")}${chapterIds.map(id => navLink(lessonUrls[id], "第 " + id + " 章", lessonId === id ? "lesson" : "")).join("")}${navLink(lab, "訊號鏈實驗", "lab")}</nav></details>
  </div></header>`;
const footer = `<footer class="wrap footer"><span>Guitar Tone Lab</span>${page !== "home" ? `<a href="${home.href}">回音色首頁</a>` : ""}${/\/Tone-lab\/$/i.test(home.pathname) ? `<a href="${new URL("../",home).href}">回 Kai AI Workshop 首頁</a>` : ""}<a href="${home.href}#course">課程地圖</a></footer>`;
const note = `<section class="note section" id="notes"><h2>音色筆記</h2>
  <label for="note-field">寫下目標、固定條件、唯一改動與聽到的差異</label>
  <textarea id="note-field" maxlength="10000" rows="6" placeholder="例：琴橋雙線圈拾音器、耳機監聽。只切換 Overdrive 的 Bypass，強彈時比較起音與和弦分離度。"></textarea>
  <div class="actions"><button type="button" id="save-note" class="primary">儲存筆記</button><span class="muted">全站共用一份筆記，儲存在目前的瀏覽器。</span></div>
</section>`;
const status = '<p class="feedback" id="save-status" role="status"></p>';
// Display positions vary by chapter while saved answers retain their original IDs.
const answerLayouts = ["BACBC", "CCABA", "BABCA", "CBAAC", "ACBAC", "BCACB", "CACBB", "BBCCA", "ABCCB", "CBBAC", "CABAB", "BCCAA"];
function quizSection(questions, answers) {
  const layout = answerLayouts[Number(lessonId)];
  return `<section id="quiz" class="section"><h2>理解測驗</h2><p class="muted">每題選完就能查看解析。</p>
    ${questions.map(([question, options, correct], i) => {
      const order = options.map((_, j) => j).filter(j => j !== correct);
      order.splice("ABC".indexOf(layout[i]), 0, correct);
      return `<fieldset><legend>${i + 1}. ${question}</legend>${order.map(j => `<label class="option"><input type="radio" name="q${i}" value="${j}" ${answers[i] === j ? "checked" : ""}> ${options[j]}</label>`).join("")}<p id="answer-${i}" aria-live="polite" class="answer"></p></fieldset>`;
    }).join("")}
    <button type="button" class="secondary" id="reset-quiz">重做測驗</button>
  </section>`;
}
const completion = `<div class="actions"><button type="button" class="secondary" id="complete" aria-pressed="${progress.completed}">${progress.completed ? "取消完成標記" : "標記為已完成"}</button></div>${status}`;

function readingShortcut() {
  let id;
  try { id = localStorage.getItem("guitar-tone-lab:last-lesson"); } catch { /* Storage is optional. */ }
  return chapterIds.includes(id)
    ? `<a href="${lessonUrls[id]}">回到上次的第 ${id} 章 ↗</a>`
    : `<a href="${lesson}#goal">拿自己的琴彈一段 ↗</a>`;
}

function homeContent() {
  return `<main class="wrap" id="main" tabindex="-1">
    <section class="desk-intro">
      <div class="desk-title"><h1>來玩音色吧<span>。</span></h1>
        <p>同一個和弦，你喜歡哪種聲音？<br>聽完 A/B，拿起琴，用自己的綜合效果器調一次。</p>
        ${readingShortcut()}</div>
      <figure class="desk-buddy"><img src="${url("assets/tone-buddy-ready-v002.webp")}" width="720" height="900" alt="紫髮吉他手抱著白色 Les Paul Custom，托起白色 MG-50Li。"></figure>
      ${listeningExercise("cab", true)}
    </section>
    <section class="section tone-start" aria-labelledby="tone-start-title">
      <h2 id="tone-start-title">今天想調出什麼聲音？</h2>
      <p>第一次做音色，可以<a href="${lesson}#goal">從四拍 Riff 做一個節奏 Preset</a>。手上已經有一個想修改的音色，就從你聽見的那一拍開始。</p>
      <ul><li><a href="${lessonUrls["03"]}#rhythm-gain">破音要有力，刷和弦時也想聽清楚每條弦 ↗</a></li>
      <li><a href="${lessonUrls["09"]}#metal-gate">想讓停手那拍安靜，又保得住輕彈的音 ↗</a></li>
      <li><a href="${lessonUrls["06"]}#lead-echo">想讓 Solo 有回聲，下一句開頭還是清楚 ↗</a></li></ul>
    </section>
    <section id="practice" class="desk-routes" aria-label="接著玩什麼">
      <a href="${labs}"><img src="${url("assets/tone-buddy-listen-close-v001.png")}" alt=""><span><strong>再聽一組</strong><small>去練習室，比一比回聲的尾巴。</small></span><b>↗</b></a>
      <a href="${lab}"><img src="${url("assets/tone-buddy-swap-v001.png")}" alt=""><span><strong>換個效果順序</strong><small>把 Overdrive 移到 AMP 的另一邊。</small></span><b>↗</b></a>
    </section>
    <section class="section" id="course">
      <div class="section-head"><div><p class="eyebrow">COURSE MAP</p><h2>課程地圖</h2></div><p class="tag">${Object.values(completed).filter(Boolean).length} / 12 已完成</p></div>
      <p class="muted">用自己的綜合效果器跟著彈。先做出節奏底音，再加上曲子需要的效果，最後把能在排練叫回來用的 Preset 存好。實機範例使用 NUX MG-50Li。</p>
      ${groups.map(([name, start, end]) => `<section class="course-group"><h3>${name}</h3><ul class="course-list">${chapters.slice(start, end).map(([id, title, desc]) => `<li><span class="number">${id}</span><div>${lessonUrls[id] ? `<a href="${lessonUrls[id]}">${title}</a>` : `<strong>${title}</strong>`}<p>${desc}</p></div>${completed[id] ? '<span class="tag live">已完成</span>' : ""}</li>`).join("")}</ul></section>`).join("")}
    </section>
  </main>`;
}

function lessonContent() {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#goal">建立音色目標</a><a href="#method">反推訊號鏈</a><a href="#experiment">控制變因實驗</a><a href="#terms">術語</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 00</p><h1>從想聽到的聲音出發</h1>
        <p class="lede">你已經能聽出喜歡哪種音色。這一章要把那個聽感轉成可以設計、測試、重做的設定。</p>
        <p class="muted">先備知識：能彈一小段可重複的短樂句（Riff）或和弦。可用自己的效果器、音箱或錄音軟體驗證。</p>
      </header>
      <section id="goal" class="section"><h2>第 4 拍停手時，你還想留下什麼聲音？</h2>
        
        <div class="editorial listening-example" data-art-slot="lesson00-tone-notes">
          <div><h3>拿起琴，彈這四拍</h3><p>先挑一個接近你要的節奏音色，另存到可用的位置。這次的目標是輕彈有輪廓、重彈帶破音，停手時留得出空拍。</p>
            <p class="example-note">選一個能穩定重複的速度。用琴橋拾音器（Pickup），第 1 拍輕彈、第 2 拍重彈低音弦悶音（Palm Mute），第 3 拍刷一個短和弦，第 4 拍停弦。聽各拍的起音、和弦的外側兩弦，以及空拍還剩下什麼聲音。</p></div>
          <figure class="editorial-art"><img src="${url("assets/listening-notebook-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手抱著白色 Les Paul Custom，停下來記錄剛聽見的變化。"></figure>
        </div>
        <p>你可以從明暗、低頻輪廓、強弱差、延音與空間尾音五個角度描述目標。同一個「厚」可能指較多低中頻、飽滿的延音，或錄音中左右各錄一軌的疊加感。指定哪個演奏動作會暴露差異，就能收斂該測什麼。</p>
      </section>
      <section id="method" class="section"><h2>從聽者的位置反推訊號鏈</h2>
        <figure class="diagram"><ol><li>吉他與演奏</li><li>效果與增益</li><li>擴大機（AMP）</li><li>箱體與收音（CAB／IR）</li><li>監聽</li></ol><figcaption>概念示意。實際順序取決於設備和接法。</figcaption></figure>
        <p>訊號鏈（Signal Chain）的每一段都會影響下一段。提高 AMP 前的電平，可能讓原本接近破音邊緣的 AMP 更早失真。提高一個仍有餘裕的線性後級電平，主要會讓結果更大聲。若聽到的是和弦糊成一團，先用這個差異決定要測哪個增益（Gain）。</p>
        <p>耳機與現場擴聲（PA）的結果不同時，先記下輸出設定、聆聽位置和音量，並確認有沒有經過實體吉他喇叭、箱體模擬或箱體脈衝響應（IR）。箱體 IR 可重現特定箱體和收音配置的響應。先找兩條路徑從哪裡開始不同，再決定要調哪一段。</p>
        <div class="callout"><h3>常見誤判</h3><p>和弦不清楚，可能來自增益過高、低頻先推入失真，或 Reverb 尾音累積。分別降低增益、旁路空間效果來比對，再決定下一步。若是 Clean AMP，調高輸入電平也可能只增加音量，視該工作點是否開始失真而定。</p></div>
      </section>
      <section id="experiment" class="section"><h2>用一段 Riff 驗證一個假設</h2>
        <ol><li>選一小段包含弱彈、重彈與停奏的材料。固定琴、Pickup、監聽與 AMP／CAB。</li>
        <li>在 Signal Chain Builder 排出三個處理區塊（Block）：過載效果（Overdrive）、AMP、CAB／IR。預測 Overdrive 放在 AMP 前且啟用時，你會在哪一拍聽出差異。</li>
        <li>在自己的設備上做 A/B，A 為 Overdrive 旁路（Bypass），B 為啟用。用仍有餘裕的後端音量控制匹配聽感音量，避免改動 AMP Gain。若設備可重放乾錄的吉他訊號（DI），就用同一段錄音當輸入。</li>
        <li>記錄弱彈與重彈的起音、和弦分離度和結果。沒有穩定聽出差異也是可記錄的結果。</li></ol>
        <p class="muted">預期觀察：如果 B 的輸出更容易推動 AMP，可能提早破音或縮小強弱差。若 AMP 仍在乾淨區，變化可能主要來自 Overdrive 自身。</p>
        <div class="callout editorial" data-art-slot="lesson00-footswitch">
          <div><h3>在 MG-50Li 上試</h3><p>在 NUX Audio Editor 先確認你正在編輯的 Preset，挑一條已有 Drive 類效果的訊號鏈。記下目前的 AMP 和 IR，做一次該效果啟用／旁路比較。</p>
            <p>若 Footswitch 已設成切換該效果，可以用腳切換後立刻重彈同一段。選單名稱和可調項目以你的裝置版本為準。<a href="https://nuxaudio.com/product/mg50li/">NUX MG-50Li 官方支援</a></p></div>
          <figure class="editorial-art"><img src="${url("assets/footswitch-pause-v002.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="淺藍牛仔褲與黑色皮靴站在白色效果器旁，木地板上有一片白色 Pick。"></figure>
        </div>
        <p>把喜歡的版本存在效果器上，取一個排練時認得的名字，例如「副歌節奏」。切到別的音色再切回來，重彈四拍。若第 3 拍的和弦仍太糊，接著<a href="${lessonUrls["03"]}#rhythm-gain">用 AMP Gain 整理和弦</a>。</p>
        <a class="primary" href="${lab}?exercise=intro">操作 Signal Chain Builder</a>
      </section>
      <section id="terms" class="section"><h2>術語</h2>
        ${glossary.map(([zh, en, plain, principle, when]) => `<details><summary>${zh} <span class="muted">· ${en}</span></summary><p>${plain}</p><p><strong>原理</strong>　${principle}</p><p><strong>使用時機</strong>　${when}</p></details>`).join("")}
      </section>
      ${quizSection(lessonQuiz, progress.answers)}${note}${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${lessonUrls["01"]}">下一章：電吉他訊號的旅程</a><a href="${home.href}#course">返回課程地圖</a></nav>
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
    <header class="page-head listening-host"><img src="${url("assets/tone-buddy-listen-v001.png")}" width="92" height="92" alt=""><div><h1>練習室</h1><p class="lede">戴上耳機，挑一組 A/B 聽聽。也可以在下方載入自己的兩段錄音。</p></div></header>
    <div class="listen-pair">${listeningExercise("delay")}${listeningExercise("cab")}</div>
    <section class="section"><h2>挑一個練習</h2>
      <ul class="lab-directory">${entries.map(([href,label]) => `<li><a class="secondary" href="${href}">${label}</a></li>`).join("")}</ul>
    </section>
    <section class="section" id="audio-ab"><h2>用自己的錄音做 A/B</h2>
      <p>選擇你有權使用的兩段本機錄音。用同一段 Riff、相同起點，先把聽感音量拉近，再比較唯一改動。音檔由瀏覽器本機播放。</p>
      <div class="console audio-ab-grid">${["A","B"].map(letter => `<div>
        <label>${letter} 版錄音 <input class="preset-json-file" type="file" accept="audio/*"></label>
        <audio aria-label="${letter} 版錄音播放器" controls preload="metadata"></audio>
        <p class="feedback" role="status"></p>
      </div>`).join("")}</div>
    </section>
  </main>`;
}

function labContent() {
  const exerciseChapter = rockChain ? "08" : exerciseName === "intro" ? "00" : "07";
  const context = exerciseChain
    ? `<p class="amp-observation">${rockChain ? recipes[exerciseName.slice(5)].name + "。" + recipes[exerciseName.slice(5)].cue : exerciseName === "intro" ? "只切換 Overdrive，預測第 2 拍的起音會怎麼變。" : ""} 已載入第 ${exerciseChapter} 章的順序範例。按「儲存訊號鏈」才會將它寫入存檔。 <a href="${lab}">開啟已儲存的訊號鏈</a></p>`
    : "";
  const source = exerciseChain
    ? lessonUrls[exerciseChapter] + "?exercise=" + encodeURIComponent(exerciseName) + (rockChain ? "#rock-practice" : exerciseName === "intro" ? "#experiment" : "#order")
    : lesson + "#experiment";
  const backLabel = exerciseChain ? "返回第 " + exerciseChapter + " 章練習" : "返回第 00 章實驗步驟";
  return `<main class="wrap lab-page" id="main" tabindex="-1">
    <header class="page-head"><p class="eyebrow">訊號鏈實驗室</p><h1>Signal Chain Builder</h1>
      <p class="lede">播放同一段 Riff，試著交換 EQ 與破音的位置，再把 Delay 移到支線聽一次。</p>${context}
    </header>
    <section class="console" aria-labelledby="routing-title">
      <div class="section-head"><h2 id="routing-title">訊號鏈工作桌</h2><label>外觀 <select id="skin"><option value="lcd">電子介面</option><option value="pedal">單塊桌面</option></select></label></div>
      <div class="workdesk" id="desk"><div class="patchbar"><b>01A</b> Riff &amp; Echo <select aria-label="訊號路由" id="route"><option value="serial">串聯 Serial</option><option value="parallel">並聯 Parallel</option><option value="split">分送 Split · L / R</option></select></div>
      <div class="track-scroll"><ol id="chain" class="chain"></ol></div>
      <div class="inspector"><strong id="picked"></strong><div id="edit-actions"></div><div id="dial-label"></div></div></div>
      <div class="actions"><button type="button" id="riff">▶ 播放 Riff</button><small>合成吉他循環 · 教學效果模型</small></div>
      <p class="muted" id="route-help"></p>
      <div class="actions lab-actions">
        <label for="block-select">加入 Block</label><select id="block-select"></select><button type="button" id="add-block" class="secondary">加入</button>
        <button type="button" id="reset-chain" class="secondary">重置</button><button type="button" id="save-chain" class="primary">儲存訊號鏈</button>
      </div>
      <p role="status" id="lab-status" class="feedback"></p>
    </section>
    <section class="section chain-reaction" aria-labelledby="observations-title"><img hidden src="${url("assets/tone-buddy-swap-v001.png")}" width="88" height="88" alt=""><h2 id="observations-title">這個順序可能帶來什麼？</h2><ul id="observations"></ul></section>
    ${note}${status}<a href="${source}">${backLabel}</a>
  </main>`;
}

function currentLesson() {
  const render = { "01": signalLesson, "02": rigLesson, "03": ampLesson, "04": cabLesson, "05": gainLesson, "06": effectsLesson, "07": routingLesson, "08": rockLesson, "09": metalLesson, "10": presetLesson, "11": diagnosisLesson }[lessonId];
  if (!render) return lessonContent();
  const index = chapterIds.indexOf(lessonId);
  return render({
    previous: lessonUrls[chapterIds[index - 1]],
    next: lessonUrls[chapterIds[index + 1]],
    course: home.href + "#course",
    quiz: quizSection(lessonQuiz, progress.answers),
    listeningExercise,
    note,
    completion,
  });
}
const renderPage = { lesson: currentLesson, lab: labContent, labs: labsContent, home: homeContent }[page] ?? homeContent;
app.innerHTML = header + renderPage() + footer;

const contents = document.querySelector(".contents");
if (contents) {
  const menu = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "本章目錄";
  menu.append(summary, contents.querySelector("nav"));
  contents.replaceChildren(menu);
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
  const complete = document.querySelector("#complete");
  complete.addEventListener("click", () => {
    progress.completed = !progress.completed;
    complete.setAttribute("aria-pressed", String(progress.completed));
    complete.textContent = progress.completed ? "取消完成標記" : "標記為已完成";
    saveProgress("completed", progress.completed ? "已標記第 " + lessonId + " 章完成" : "已取消完成標記");
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
    el("picked").textContent=item ? blocks[picked][0] : "訊號直通";
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
  for (const [index, card] of cards.entries()) {
    const input = card.querySelector("input");
    const player = players[index];
    const status = card.querySelector("[role=status]");
    let audioUrl;
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      player.pause();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = URL.createObjectURL(file);
      player.src = audioUrl;
      status.textContent = "已選擇 " + file.name;
    });
    player.addEventListener("error", () => {
      status.textContent = "瀏覽器無法播放這個檔案。可以換用 PCM WAV 或 MP3 測試。";
    });
    player.addEventListener("play", () => { const other = players[1-index]; stopListening?.(); if (!other.paused) { const time=other.currentTime; other.pause(); if(Number.isFinite(player.duration)) player.currentTime=Math.min(time,player.duration); } });
  }
}
if (location.hash) requestAnimationFrame(() => {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
});

// Render the same synthetic guitar take through two controlled processing paths.
function listeningPair(kind, context) {
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
  if (kind === "cab") {
    pluck(0, 82.41, .22, .28);
    pluck(.5, 82.41, .24, .68);
  }
  for (const [index, hz] of [82.41,123.47,164.81].entries()) pluck((kind === "cab" ? 1 : 0) + index * .008, hz, .32, .32);
  return [0,1].map(version => {
    const buffer = context.createBuffer(1,length,rate);
    const samples = buffer.getChannelData(0);
    let filtered = 0, energy = 0;
    const cutoff = version ? 1450 : 4300;
    const alpha = 1 - Math.exp(-2 * Math.PI * cutoff / rate);
    const repeats = new Float32Array(length);
    for (let i=0; i<length; i++) {
      const amp = Math.tanh(3 * dry[i]);
      if (kind === "cab") {
        filtered += alpha * (amp - filtered);
        samples[i] = filtered;
      } else {
        const prev = i - rate * .375;
        repeats[i] = prev < 0 ? 0 : ampSignal(prev) + repeats[prev] * (version ? .65 : .15);
        samples[i] = amp + .45 * repeats[i];
      }
      energy += samples[i] ** 2;
    }
    const scale = kind === "cab" ? .075 / Math.sqrt(energy / length) : .45;
    for(let i=0;i<length;i++) samples[i] *= scale;
    return buffer;
  });
  function ampSignal(i) { return Math.tanh(3 * dry[i]); }
}

function listeningExercise(kind, preference = false) {
  const cab = kind === "cab";
  const title = preference ? "你喜歡哪一邊？" : cab ? "哪一版的刷弦聲比較柔？" : "哪一版的回聲留得久？";
  return `<section class="console audition" data-listen="${kind}" ${preference ? "data-preference" : ""}>
    <h${preference ? 2 : 3}>${title}</h${preference ? 2 : 3}>
    <p class="audition-source">${cab ? "合成吉他 · 四拍 Riff" : "合成吉他 · 短和弦與回聲"}</p>
    <div class="audition-keys">${["A","B"].map((label,i)=>`<button type="button" data-play="${i}" aria-label="播放 ${label}" aria-pressed="false"><i aria-hidden="true"></i><strong>${label}</strong><span>播放</span></button>`).join("")}</div>
    <div class="transport"><span>切換時接在同一拍</span><button type="button" data-stop>■ 停止</button></div>
    <div class="audition-vote">${["A","B"].map((label,i)=>`<button type="button" data-answer="${i}">${preference ? "喜歡" : "我選"} ${label}</button>`).join("")}</div>
    <p role="status" data-feedback></p>${preference ? '<details data-reveal><summary>看看這次改了什麼</summary><p></p></details>' : ""}</section>`;
}

let stopListening;
for (const panel of document.querySelectorAll("[data-listen]")) {
  const kind = panel.dataset.listen;
  const target = Math.random() < .5 ? 0 : 1;
  const answer = target ? "B" : "A";
  const reveal = panel.querySelector("[data-reveal] p");
  if (reveal) reveal.textContent = answer + " 版削掉較多高頻。再聽第 3 拍，注意撥片碰弦的那一下。這組聲音是合成與濾波示意。";
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
          buffers ??= listeningPair(kind,ctx);
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
    panel.querySelector("[data-feedback]").textContent = reveal ? "你選了 " + (index ? "B" : "A") + "。也可以回頭聽另一版。" : (index === target ? "答對了。" : "再聽一次 " + answer + "。") + (kind==="cab" ? answer + " 用較低的截止頻率示意移向紙盆外圈時可能出現的柔和感；實際差異要用同一箱體收音比較。" : "A 和 B 的第一下回聲同樣大，間隔都是 375 ms。" + answer + " 的 Feedback 較高，後幾下衰減較慢。");
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
