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
    ["clean", "Clean", "例：主歌用 JAZZ CLEAN 接 JC120，讓分解和弦保留清楚的起音。"],
    ["crunch", "Crunch", "例：副歌開啟 BRIT 800 前的 T SCREAMER，重刷多一層破音。"],
    ["lead", "Lead", "例：IR 後串 DIGITAL DELAY，讓推弦後面多一聲回音，伴奏裡比 Crunch 稍突出。"],
  ]],
  ["A/B 對照與留版", [
    ["baseline", "A｜基準與固定條件", "例：保留 v01，同一段 Riff、Pickup、IR 和監聽。", 2],
    ["change", "B｜我改了什麼？", "例：只降低 BRIT 800 的 GAIN，再用後端 Level 補齊響度。", 2],
    ["result", "哪一拍有差？留下哪一版？", "寫下強弱彈奏、單音、和弦、獨奏與切換時聽到的差異。", 3],
  ]],
];
const fields = sections.flatMap(([, items]) => items);
const backupFormat = "guitar-tone-lab:preset-record";
const asset = name => new URL("./assets/" + name, import.meta.url).href;

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

export function presetLesson({ quiz, note, pager }) {
  return `<main class="wrap reading" id="main" tabindex="-1">
    <aside class="contents"><p class="eyebrow">本章目錄</p><nav aria-label="本章目錄">
      <a href="#design">從基準音色開始</a><a href="#scenes">規劃切換</a><a href="#verify">測試與留版</a><a href="#mg-example">切回副歌的尾音</a><a href="#preset-record">音色設計紀錄</a><a href="#quiz">自己試五題</a><a href="#notes">音色筆記</a></nav></aside>
    <article class="article">
      <header class="page-head"><p class="eyebrow">第 11 章</p><h1>從零建立完整 Preset</h1>
        <p class="lede">一首搖滾抒情曲可以有三種吉他角色：主歌的分解和弦、副歌的厚節奏、間奏的一句長音。它們可以共用同一顆 AMP，只在需要的地方分岔。</p>
      </header>
      <section class="section" id="design"><h2>一首歌裡共用的底色</h2><p>節奏和獨奏共用 AMP 與 CAB 時，切換段落還聽得出是同一把琴。副歌需要重刷的粗邊，間奏需要長音多留一點空間，例如 MG 用 BRIT 800 接 M 1960+G12M，兩段共用底色，只在間奏開啟 IR 後面的 DIGITAL DELAY。要是主歌輕撥乾淨、副歌用力一刷才想長出粗邊，另一種安排是用較乾淨的 AMP，把低增益的 BLUES DRV 留給副歌。</p>
      </section>
      <section class="section" id="scenes"><h2>把 Clean、Crunch、Lead 放回曲子裡</h2>
        <p>主歌的分解和弦一顆顆露出來，副歌一刷，幾條弦一起撐起鼓點。等歌手讓出位置，間奏只用一個長音，也要能讓人跟著哼。
        </p><figure class="amp-illustration"><img src="${asset("verse-chorus-lead.webp")}" width="1440" height="480" loading="lazy" alt="三格舞台漫畫，主角從主歌的凝神、副歌的雀躍，到間奏閉眼沉入長音。"><figcaption class="single-caption">同一首歌，三種表情。主歌聽音粒，副歌聽和弦，間奏聽旋律。</figcaption></figure><p>用副歌的 Crunch 當基準，試試一腳切回 Clean，另一腳叫出 Lead。三段可以用 Scene、腳踏開關或各自的 Preset 切換。</p>
        
        <p>副歌進入間奏時，吉他從填滿和弦改成別人要跟著哼的旋律。若長音本已有足夠延音，稍微提高後段 Level，就能改變它在伴奏裡的位置。</p>
      </section>
      <section class="section" id="verify"><h2>留一份能回頭比較的版本</h2>
        <p>兩次副歌之間，如果只是換了拾音器，前級吃到的訊號就可能變強。把原本那個 Preset 留著，下次還能聽出毛邊來自哪裡。</p>
        <figure class="amp-illustration"><img src="${asset("preset-session-notes-v001.jpg")}" width="1440" height="720" loading="lazy" decoding="async" alt="紫髮吉他手在暖色錄音角落記筆記，旁邊立著白色 Les Paul Custom。">
          <figcaption class="single-caption">先留下基準，再另存一版比較。回到同一段演奏，才能確認那項改動值不值得保留。</figcaption></figure>
        <p>兩個版本若同時換了 Gain、箱體和輸出音量，很難指出是哪一項讓和弦更亮。留一份原音色的用途很單純：耳朵有個熟悉的參照。</p>
      </section>
      <section class="section" id="mg-example"><h2>獨奏切回副歌，最後一聲回音要留多久？</h2><p>獨奏最後一音剛放開，鼓就打進副歌。讓回聲越過小節線，旋律像還在和下一段接話；若全團約好在重拍前一起收住，留出的空白會讓副歌第一下更有力。</p><figure class="song-scene" id="chorus-cue"><img src="${asset("chorus-cue.webp")}" width="1440" height="480" loading="lazy" decoding="async" alt="吉他手抱著白色 Les Paul 睜開一隻眼，和舉著鼓棒等副歌的鼓手交換眼神。"></figure><p>實體 BOSS DD-8 的 Carryover 決定單塊旁路後，已經產生的回聲能不能繼續衰減。換到 MG-50Li，從開著 DIGITAL DELAY 的 Lead <strong>切換 Preset</strong> 回 Crunch 時，V1.1.1 的 Patch Tail 開啟可保留尾音，關閉則截斷。<a href="https://www.boss.info/us/products/dd-8/support/">BOSS DD-8 說明</a> · <a href="https://nuxaudio.com/product/mg50li/">NUX Patch Tail 說明</a></p></section>
      <details class="section optional-check"><summary>想留下這個音色？</summary><div id="preset-record"><p>這份紀錄表可分次填寫，草稿存在目前的瀏覽器，也可以匯出 Markdown。機上的 Preset 另存於效果器或編輯器。</p><div class="callout"><h3>一筆填好的 A/B 紀錄</h3>
          <p class="muted">以下數值和結果僅示範如何記錄。</p>
          <dl class="amp-controls-list"><dt>固定條件</dt><dd>琴橋雙線圈拾音器、耳機、同一段伴奏、BRIT 800 → M 1960+G12M → DIGITAL DELAY。Crunch 旁路 DIGITAL DELAY，Lead 啟用，兩版的 Delay 設定一致。</dd>
          <dt>A · v01</dt><dd>Lead Preset Volume +3 dB，Crunch 維持 0 dB。切到 Lead 的第一下比預期突出。</dd>
          <dt>B · v02</dt><dd>Lead 改成 +1 dB，其餘保留。第一下落差較小，推弦尾端仍能從伴奏中聽清。</dd>
          <dt>保留版本</dt><dd>先留 v02，回切 v01 再對照一次。若回切 Crunch 時仍有尾音重疊，另外記一輪 Patch Tail 的結果。</dd></dl></div>
        ${workbook()}</div></details>
      ${quiz}<details id="notes"><summary>全站共用音色筆記</summary>${note.replace('id="notes"', "")}</details>${pager}
    </article>
  </main>`;
}
