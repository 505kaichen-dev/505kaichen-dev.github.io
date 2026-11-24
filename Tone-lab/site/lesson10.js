export const presetQuiz = [
  ["建立 Preset 之前，哪個條件最值得先寫下來？", ["效果器可同時使用的 Block 總數","用途、監聽與想聽到的特徵","參考 Preset 各顆旋鈕的中間值"], 1, "用途和監聽條件決定該用什麼材料驗證，也讓換設備後的差異有跡可循。"],
  ["要比較兩個 CAB／IR，哪個做法較能確認差異？", ["固定乾錄與 AMP，只換 CAB","換 CAB 時一併調整前級 Gain","固定 AMP，兩版各用不同拾音器"], 0, "固定 AMP 和演奏能縮小變因。響度接近時，更容易聽出 IR 的頻譜和起音差異。"],
  ["從 Crunch 切到 Lead，音量突然跳太多。先試哪個調整？", ["退 Lead 前級 Gain","降兩段共用的耳機音量","調 Lead 後端 Level"], 2, "Gain 會影響失真和動態，後端 Level 較適合控制切換時的音量落差。"],
  ["Clean、Crunch、Lead 要怎麼驗證切換？", ["跟著歌曲踩，聽交界那一拍","只比三段各自的最高峰值","分開彈三個長音再看平均音量"], 0, "用真正會切換的位置測，才能聽到下一句有沒有被尾音蓋住，以及音量在伴奏裡是否合適。"],
  ["哪一筆 A/B 紀錄最容易重做？", ["完整列出 B 版使用的效果名稱","同一段 Riff、改動前後值和聽感","記下兩版名稱與較喜歡的版本"], 1, "記下改動前後的值和聆聽結果，下次能重做比較，也有可靠的基準可以回退。"],
];

const storageKey = "guitar-tone-lab:preset-workbook:v1";
const sections = [
  ["用途與監聽", [
    ["name", "Preset 名稱", "例：排練節奏"],
    ["version", "版本", "例：v02"],
    ["goal", "曲風、用途與音色目標", "例：搖滾排練，重刷有稜角，空拍收得住。", 3],
    ["monitor", "輸出與監聽路徑", "例：MG-50Li → 耳機，CAB／IR 開啟。"],
    ["guitar", "吉他、Pickup 與調弦", "例：Les Paul Custom，琴橋雙線圈拾音器，標準調弦。"],
  ]],
  ["訊號鏈與切換", [
    ["chain", "Block 順序與設定", "記下 AMP、CAB／IR、Gain、EQ、Level 和有啟用的效果。", 4],
    ["clean", "Clean", "記下開關變化、音量或使用段落。"],
    ["crunch", "Crunch", "例：副歌打開 OD，後端 Level 對齊。"],
    ["lead", "Lead", "例：獨奏增加少量 Delay，伴奏裡比 Crunch 稍突出。"],
  ]],
  ["A/B 對照與留版", [
    ["baseline", "A｜基準與固定條件", "例：保留 v01，同一段 Riff、Pickup、IR 和監聽。", 2],
    ["change", "B｜我改了什麼？", "例：只把 AMP Gain 從 48 退到 41，再用後端 Level 補齊響度。", 2],
    ["result", "哪一拍有差？留下哪一版？", "寫下強弱彈奏、單音、和弦、獨奏與切換時聽到的差異。", 3],
  ]],
];
const fields = sections.flatMap(([, items]) => items);
const backupFormat = "guitar-tone-lab:preset-record";
const asset = name => new URL("./art/" + name, import.meta.url).href;

export function parsePresetBackup(text) {
  const backup = JSON.parse(text.replace(/^\uFEFF/, ""));
  if (backup?.format !== backupFormat || backup.version !== 1 ||
      !backup.record || typeof backup.record !== "object" || Array.isArray(backup.record)) {
    throw new Error("備份格式或版本不支援。");
  }
  return Object.fromEntries(fields.map(([key, label, , rows]) => {
    const value = backup.record[key];
    if (!Object.hasOwn(backup.record, key) || typeof value !== "string" ||
        value.length > (rows ? 2500 : 240) || (!rows && /[\r\n]/.test(value))) {
      throw new Error("欄位格式有誤：" + label);
    }
    return [key, value];
  }));
}

export function formatPresetRecord(values) {
  const lines = ["# Guitar Tone Lab｜音色設計紀錄"];
  for (const [title, items] of sections) {
    lines.push("", "## " + title);
    for (const [key, label] of items) {
      const value = values[key]?.trim();
      if (value) {
        // Indent user text as literal Markdown, including multiline notes.
        lines.push("", "### " + label, "", ...value.split(/\r?\n/).map(line => "    " + line));
      }
    }
  }
  return lines.join("\n") + "\n";
}

export function mountPresetPractice(form) {
  const status = form.querySelector("#preset-status");
  const stamp = form.querySelector(".saved-stamp");
  function report(message, saved = false) {
    stamp.hidden = !saved;
    status.textContent = message;
  }
  form.addEventListener("input", () => {
    if (!stamp.hidden) report("已修改，尚未儲存。");
  });
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    for (const [key] of fields) {
      if (typeof saved?.[key] === "string") form.elements.namedItem(key).value = saved[key];
    }
  } catch {
    report("無法載入瀏覽器草稿。可以繼續填寫並下載紀錄。");
  }
  const read = () => Object.fromEntries(fields.map(([key]) => [key, form.elements.namedItem(key).value]));
  const upload = form.querySelector("#preset-json-file");
  const preview = form.querySelector("#preset-import-preview");
  let pending = null;
  let selection = 0;
  upload.addEventListener("change", async () => {
    const id = ++selection;
    const file = upload.files[0];
    upload.value = "";
    pending = null;
    preview.hidden = true;
    if (!file) return;
    report("");
    try {
      if (file.size > 256 * 1024) throw new Error("備份檔超過 256 KB。");
      const text = await file.text();
      if (id !== selection) return;
      pending = parsePresetBackup(text);
      preview.querySelector("pre").textContent = formatPresetRecord(pending);
      preview.hidden = false;
      report("備份檢查通過。請先查看預覽，再決定是否套用。");
    } catch (error) {
      if (id !== selection) return;
      report("無法讀取這份備份。 " + (error instanceof SyntaxError ? "JSON 內容不完整或無效。" : error.message));
    }
  });
  preview.querySelector("#preset-apply").addEventListener("click", () => {
    if (!pending) return;
    for (const [key] of fields) form.elements.namedItem(key).value = pending[key];
    pending = null;
    preview.hidden = true;
    report("已載入表單。按「儲存草稿」後才會更新瀏覽器存檔。");
    upload.focus();
  });
  preview.querySelector("#preset-cancel").addEventListener("click", () => {
    pending = null;
    preview.hidden = true;
    report("已取消匯入。");
    upload.focus();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(read()));
      report("草稿已儲存在目前的瀏覽器。", true);
    } catch {
      report("瀏覽器無法儲存草稿。可以下載紀錄保留內容。");
    }
  });
  function download(asJson) {
    const values = read();
    if (!Object.values(values).some(value => value.trim())) {
      report("先填寫至少一項，再下載音色紀錄。");
      return;
    }
    const contents = asJson ? JSON.stringify({ format: backupFormat, version: 1, record: values }, null, 2) + "\n" : formatPresetRecord(values);
    const type = asJson ? "application/json" : "text/markdown";
    const file = new Blob([contents], { type: type + ";charset=utf-8" });
    const href = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = href;
    link.download = "guitar-tone-lab-preset." + (asJson ? "json" : "md");
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 30000);
    report(asJson ? "已送出 JSON 備份下載。" : "已送出 Markdown 紀錄下載。");
  }
  form.querySelector("#preset-export").addEventListener("click", () => download(false));
  form.querySelector("#preset-json-export").addEventListener("click", () => download(true));
}

function workbook() {
  return `<form id="preset-workbook" class="console">
    ${[sections[2], ...sections.slice(0, 2)].map(([title, items], i) => `${i ? "<details><summary>"+title+"</summary>" : ""}<fieldset class="preset-fields"><legend>${title}</legend><div class="preset-grid">
      ${items.map(([key, label, hint, rows]) => `<label class="${rows ? "preset-wide" : ""}"><span>${label}</span>
        ${rows ? `<textarea name="${key}" rows="${rows}" maxlength="2500" placeholder="${hint}"></textarea>` : `<input type="text" name="${key}" maxlength="240" placeholder="${hint}">`}</label>`).join("")}
    </div></fieldset>${i ? "</details>" : ""}`).join("")}
    <div class="actions"><button type="submit" class="secondary">儲存草稿</button><button type="button" class="primary" id="preset-export">下載 Markdown 紀錄</button></div><details><summary>備份與還原</summary><div class="actions"><button type="button" class="secondary" id="preset-json-export">下載 JSON 備份</button></div>
    <p class="muted">JSON 可在本網站還原為可編輯紀錄。MG-50Li 的原生 Preset 請由裝置或原廠編輯器管理。</p>
    <p><label for="preset-json-file">選擇 JSON 備份</label> <input id="preset-json-file" class="preset-json-file" type="file" accept=".json,application/json"></p>
    <div class="callout" id="preset-import-preview" hidden>
      <h3>匯入預覽</h3><p>套用會取代目前表單內容。已儲存的草稿會保留到你再次按「儲存草稿」。</p>
      <pre class="preset-import-text" tabindex="0" aria-label="備份文字內容"></pre>
      <div class="actions"><button type="button" class="primary" id="preset-apply">套用到表單</button><button type="button" class="secondary" id="preset-cancel">取消匯入</button></div>
    </div>
    </details><div class="draft-feedback"><img hidden class="saved-stamp" src="${asset("tone-buddy-preset-done-v001.png")}" width="58" height="58" alt=""><p class="feedback" role="status" id="preset-status"></p></div>
  </form>`;
}

export function presetLesson({ previous, next, course, quiz, note, completion }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#design">從基準音色開始</a><a href="#scenes">規劃切換</a><a href="#verify">測試與留版</a><a href="#mg-example">MG-50Li 切換範例</a><a href="#preset-record">音色設計紀錄</a><a href="#quiz">理解測驗</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">LESSON 10</p><h1>從零建立完整 Preset</h1>
        <p class="lede">做一份排練時能直接踩、回家也能重做的 Preset。從真正要彈的段落開始，留下訊號鏈、切換方式和一次 A/B 結果。</p>
      </header>
      <section class="section" id="design"><h2>先做一個能比較的基準音色</h2>
        <ol>
          <li>寫下曲風、用途與監聽路徑。固定吉他、Pickup 和調弦，拿一段有強弱、和弦與停拍的演奏當基準。</li>
          <li>固定一個熟悉的 CAB／IR，選能達成目標的 AMP。找到合適的 Gain 再固定 AMP，比較一至兩個 CAB／IR。每次用仍有餘裕的後端 Level 對齊聽感音量。</li>
          <li>先用 EQ 處理已聽到的問題，再逐顆加入需要的效果。每顆都做開關對照，記下它幫到哪個段落。</li>
        </ol>
      </section>
      <section class="section" id="scenes"><h2>把 Clean、Crunch、Lead 放回曲子裡</h2>
        <p>用節奏音色當基準。Clean 保留弱彈和分解和弦的輪廓，Crunch 用強刷檢查和弦分離度，Lead 用伴奏測試長音的可辨度和所需的音量提升。用 Scene、Footswitch 或分開的 Preset 實作，以你的設備能穩定切換的方式為準。</p>
        <p>在 MG-50Li 上照歌的順序實踩一次。聽第一下有沒有被切掉、音量會不會跳太多，以及前一段的 Delay／Reverb 尾音是否蓋過下一句。先只改後端 Level 或效果切換方式其中一項，再踩一次。</p>
      </section>
      <section class="section" id="verify"><h2>留一份能回頭比較的版本</h2>
        <p>用同一段材料測輕彈、重刷、悶音和停拍，再補一次 Pickup 切換與獨奏。Pickup 出力改變會影響前級工作點，這輪只切 Pickup，記錄音量與破音的變化。</p>
        <figure class="amp-illustration"><img src="${asset("preset-session-notes-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手在暖色錄音角落記筆記，旁邊立著白色 Les Paul Custom。">
          <figcaption class="single-caption">先留下基準，再另存一版比較。回到同一段演奏，才能確認那項改動值不值得保留。</figcaption></figure>
        <p>把基準存成 v01，複製成 v02，每輪只改一項設定。記下兩版的數值、匹配音量的方法和聽到的差異。比較結果若不穩定，可以先保留 v01，等下次在相同條件重彈。</p>
      </section>
      <section class="section" id="mg-example"><h2>MG-50Li 實作 · 從 Crunch 踩到 Lead</h2>
        <p>白色 Les Paul Custom 接 MG-50Li 的 INPUT，耳機接 PHONES。切到琴橋雙線圈拾音器，保留 AMP 和 CAB／IR。找一段含兩拍悶音、一個和弦、空一拍和獨奏長音的片段。全程固定耳機音量和伴奏。</p>
        <ol>
          <li><strong>先存兩個 Preset。</strong>保留原版，另存 Crunch 和 Lead 到可修改的位置。固定 AMP、CAB／IR 和 Gain。Crunch 保持 Delay 旁路，Lead 啟用 Delay，從低 Mix 起步。</li>
          <li><strong>只比較切換音量。</strong>A 用原本的 Crunch／Lead。B 模仿同一個切換點，只改 Lead 的 Preset Volume。NUX V1.1.1 說明中，Preset 畫面的 Knob 2 可調這個音量。先從相近的聽感音量開始，在伴奏裡判斷要保留多少 Lead 提升。</li>
          <li><strong>另外測尾音。</strong>保留上一輪的音量設定。先彈 Lead 再切回 Crunch，聽回聲是否蓋過第一拍。若要驗證 Patch Tail，記下原設定，在 Global Settings 只改這個選項、重彈同一段，測完回復原設定。原廠說明適用於切換 Preset；Scene 和單顆 Delay 的旁路行為可另做對照。</li>
        </ol>
        <p class="muted">旋鈕和選單名稱以你手上的韌體版本為準。<a href="https://nuxaudio.com/product/mg50li/">NUX V1.1.1 功能說明</a></p>
        <div class="callout"><h3>一筆填好的 A/B 紀錄</h3>
          <p class="muted">以下數值和結果僅示範如何記錄。</p>
          <dl class="amp-controls-list"><dt>固定條件</dt><dd>琴橋雙線圈拾音器、耳機、同一段伴奏、AMP → CAB／IR → Delay。Crunch 旁路 Delay，Lead 啟用，兩版的 Delay 設定一致。</dd>
          <dt>A · v01</dt><dd>Lead Preset Volume +3 dB，Crunch 維持 0 dB。切到 Lead 的第一下比預期突出。</dd>
          <dt>B · v02</dt><dd>Lead 改成 +1 dB，其餘保留。第一下落差較小，推弦尾端仍能從伴奏中聽清。</dd>
          <dt>保留版本</dt><dd>先留 v02，回切 v01 再對照一次。若回切 Crunch 時仍有尾音重疊，另外記一輪 Patch Tail 的結果。</dd></dl>
          <p><a href="#preset-record">用自己的結果填寫紀錄表</a></p>
        </div>
      </section>
      <section class="section" id="preset-record">
        <h2>填寫音色設計紀錄</h2><p>可以分段填。草稿留在目前的瀏覽器，Markdown 可帶走目前填寫的內容。MG-50Li 的 Preset 請在裝置或編輯器儲存。</p>
        ${workbook()}
      </section>
      ${quiz}<details id="notes"><summary>全站共用音色筆記</summary>${note.replace('id="notes"', "")}</details>${completion}
      <nav class="actions" aria-label="章節導覽"><a href="${previous}">上一章：現代金屬音色實驗室</a><a href="${next}">下一章：中階實戰與音色診斷</a><a href="${course}">返回課程地圖</a></nav>
    </article>
  </main>`;
}
