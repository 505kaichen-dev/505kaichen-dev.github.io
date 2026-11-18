(function () {
  const passwordKey = 'kaiAiLabPassword';
  function bytesFromBase64(value) { const raw = atob(value); return Uint8Array.from(raw, char => char.charCodeAt(0)); }
  function textFromBase64(value) { return new TextDecoder().decode(bytesFromBase64(value)); }
  function base64FromText(value) { const bytes = new TextEncoder().encode(value); let binary = ''; for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000)); return btoa(binary); }
  async function decryptWebCrypto(bundle, password) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytesFromBase64(bundle.salt), iterations: bundle.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytesFromBase64(bundle.iv) }, key, bytesFromBase64(bundle.ciphertext));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  function decryptForge(bundle, password) {
    if (!globalThis.forge) throw new Error('瀏覽器缺少 HTTP 相容解密元件。');
    const combined = forge.util.decode64(bundle.ciphertext);
    const key = forge.pkcs5.pbkdf2(forge.util.encodeUtf8(password), forge.util.decode64(bundle.salt), bundle.iterations, 32, forge.md.sha256.create());
    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({ iv: forge.util.decode64(bundle.iv), tagLength: 128, tag: forge.util.createBuffer(combined.slice(-16)) });
    decipher.update(forge.util.createBuffer(combined.slice(0, -16)));
    if (!decipher.finish()) { const error = new Error('密碼不正確，無法解密封包。'); error.name = 'OperationError'; throw error; }
    return JSON.parse(forge.util.decodeUtf8(decipher.output.getBytes()));
  }
  async function decrypt(bundle, password, status = () => {}) {
    if (globalThis.crypto?.subtle) return decryptWebCrypto(bundle, password);
    status('目前是一般 HTTP 環境，正在使用相容解密模式…');
    await new Promise(resolve => setTimeout(resolve, 30));
    return decryptForge(bundle, password);
  }
  function normalize(value) { const result = []; for (const part of value.replaceAll('\\', '/').split('/')) { if (!part || part === '.') continue; if (part === '..') result.pop(); else result.push(part); } return result.join('/'); }
  function dirname(value) { const clean = normalize(value); const slash = clean.lastIndexOf('/'); return slash < 0 ? '' : clean.slice(0, slash); }
  function resolvePath(current, reference) { const raw = reference.split(/[?#]/)[0]; let clean; try { clean = decodeURIComponent(raw); } catch { clean = raw; } if (!clean) return ''; return normalize(clean.startsWith('/') ? clean.slice(1) : `${dirname(current)}/${clean}`); }
  function render(payload, entry) {
    const fileMap = new Map(payload.files.map(file => [normalize(file.path), file]));
    const cache = new Map();
    function dataUrlFor(filePath) {
      const normalized = normalize(filePath);
      if (cache.has(normalized)) return cache.get(normalized);
      const file = fileMap.get(normalized);
      if (!file) return null;
      let data = file.data;
      if (/^text\/css/i.test(file.mime)) data = base64FromText(rewriteCss(textFromBase64(file.data), normalized));
      if (/^(?:text\/javascript|application\/javascript)/i.test(file.mime)) data = base64FromText(rewriteScriptAssets(textFromBase64(file.data), normalized));
      const url = `data:${file.mime};base64,${data}`;
      cache.set(normalized, url);
      return url;
    }
    function rewriteCss(css, current) {
      return css.replace(/url\(\s*(["']?)([^\)"']+)\1\s*\)/gi, (whole, quote, reference) => {
        if (/^(?:data:|https?:|#|var\()/i.test(reference)) return whole;
        const replacement = dataUrlFor(resolvePath(current, reference));
        return replacement ? `url("${replacement}")` : whole;
      });
    }
    function rewriteScriptAssets(script, current) {
      return script.replace(/(["'])([^"'\r\n]+)\1/g, (whole, quote, reference) => {
        if (/^(?:data:|https?:|blob:|#)/i.test(reference)) return whole;
        const target = fileMap.get(resolvePath(current, reference));
        if (!target || /^text\/html/i.test(target.mime)) return whole;
        const replacement = dataUrlFor(resolvePath(current, reference));
        return replacement ? `${quote}${replacement}${quote}` : whole;
      });
    }
    function prepareHtml(filePath) {
      const normalized = normalize(filePath);
      const file = fileMap.get(normalized);
      if (!file) throw new Error(`封包內找不到頁面：${normalized}`);
      let html = textFromBase64(file.data);
      html = html.replace(/(\s(?:src|href|poster)\s*=\s*)(["'])([^"']+)\2/gi, (whole, prefix, quote, reference) => {
        if (/^(?:data:|https?:|mailto:|tel:|javascript:|#)/i.test(reference)) return whole;
        const resolved = resolvePath(normalized, reference);
        const target = fileMap.get(resolved);
        if (!target || /^text\/html/i.test(target.mime)) return whole;
        const replacement = dataUrlFor(resolved);
        return replacement ? `${prefix}${quote}${replacement}${quote}` : whole;
      });
      html = rewriteCss(html, normalized);
      html = html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attributes, script) => /\bsrc\s*=/i.test(attributes) ? whole : `<script${attributes}>${rewriteScriptAssets(script, normalized)}</script>`);
      const bridge = `<script>(function(){document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(mailto:|tel:|javascript:|https?:)/i.test(h))return;e.preventDefault();parent.postMessage({type:'kai-ai-lab-nav',href:h},'*');});})();<\/script>`;
      return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${bridge}</body>`) : `${html}${bridge}`;
    }
    const frame = document.createElement('iframe');
    frame.id = 'kai-ai-lab-frame';
    frame.title = payload.title || 'AI Lab';
    frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-downloads allow-popups allow-same-origin');
    frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;background:#fff;z-index:9999';
    addEventListener('message', event => {
      if (event.source !== frame.contentWindow || event.data?.type !== 'kai-ai-lab-nav') return;
      location.href = new URL(event.data.href, location.href).href;
    });
    frame.srcdoc = prepareHtml(entry);
    document.body.replaceChildren(frame);
  }
  globalThis.KaiAiLab = { passwordKey, decrypt, render };
  if (globalThis.KAI_AI_LAB) {
    const state = document.querySelector('#state');
    const password = sessionStorage.getItem(passwordKey);
    if (!password) { location.replace(globalThis.KAI_AI_LAB.root); return; }
    fetch(globalThis.KAI_AI_LAB.payload, { cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error('找不到加密內容。'); return response.json(); })
      .then(bundle => decrypt(bundle, password, message => { if (state) state.textContent = message; }))
      .then(payload => render(payload, globalThis.KAI_AI_LAB.entry))
      .catch(error => { console.error(error); sessionStorage.removeItem(passwordKey); location.replace(globalThis.KAI_AI_LAB.root); });
  }
})();
