const form = document.querySelector('#unlockForm');
const passwordInput = document.querySelector('#password');
const statusNode = document.querySelector('#status');
const button = form.querySelector('button');
const basePath = new URL('./', location.href).pathname;
const params = new URLSearchParams(location.search);
const requestedProject = params.get('project');

function setStatus(message, isError = false) {
  statusNode.textContent = message;
  statusNode.classList.toggle('error', isError);
}

function bytesFromBase64(value) {
  const raw = atob(value);
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}

function textFromBase64(value) {
  return new TextDecoder().decode(bytesFromBase64(value));
}

function base64FromText(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

async function deriveWebCryptoKey(password, salt, iterations) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

async function decryptWithWebCrypto(bundle, password) {
  const key = await deriveWebCryptoKey(password, bytesFromBase64(bundle.salt), bundle.iterations);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytesFromBase64(bundle.iv) },
    key,
    bytesFromBase64(bundle.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

function decryptWithForge(bundle, password) {
  if (!globalThis.forge) throw new Error('瀏覽器缺少 HTTP 相容解密元件。');
  const combined = forge.util.decode64(bundle.ciphertext);
  const encrypted = combined.slice(0, -16);
  const tag = combined.slice(-16);
  const key = forge.pkcs5.pbkdf2(
    forge.util.encodeUtf8(password),
    forge.util.decode64(bundle.salt),
    bundle.iterations,
    32,
    forge.md.sha256.create()
  );
  const decipher = forge.cipher.createDecipher('AES-GCM', key);
  decipher.start({
    iv: forge.util.decode64(bundle.iv),
    tagLength: 128,
    tag: forge.util.createBuffer(tag)
  });
  decipher.update(forge.util.createBuffer(encrypted));
  if (!decipher.finish()) {
    const error = new Error('密碼不正確，無法解密封包。');
    error.name = 'OperationError';
    throw error;
  }
  return JSON.parse(forge.util.decodeUtf8(decipher.output.getBytes()));
}

async function decryptBundle(bundle, password) {
  if (globalThis.crypto?.subtle) return decryptWithWebCrypto(bundle, password);
  setStatus('目前是一般 HTTP／受限預覽環境，正在使用相容解密模式…');
  await new Promise(resolve => setTimeout(resolve, 30));
  return decryptWithForge(bundle, password);
}

function canUseVirtualSite() {
  return Boolean(globalThis.isSecureContext && globalThis.crypto?.subtle && navigator.serviceWorker && globalThis.caches);
}

async function ensureServiceWorker() {
  await navigator.serviceWorker.register(`${basePath}sw.js`, { scope: basePath });
  await navigator.serviceWorker.ready;
}

async function cacheFiles(payload) {
  const cache = await caches.open('kai-ai-lab-v1');
  for (const file of payload.files) {
    const url = new URL(`${basePath}_app/${file.path}`, location.origin);
    const response = new Response(bytesFromBase64(file.data), {
      headers: { 'Content-Type': file.mime, 'Cache-Control': 'no-store' }
    });
    const directoryResponse = response.clone();
    await cache.put(url, response);
    if (file.path.endsWith('/index.html') || file.path === 'index.html') {
      const directoryUrl = new URL(file.path === 'index.html' ? `${basePath}_app/` : `${basePath}_app/${file.path.slice(0, -10)}`, location.origin);
      await cache.put(directoryUrl, directoryResponse);
    }
  }
}

function normalizePath(value) {
  const parts = [];
  for (const part of value.replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop(); else parts.push(part);
  }
  return parts.join('/');
}

function dirname(value) {
  const normalized = normalizePath(value);
  const slash = normalized.lastIndexOf('/');
  return slash < 0 ? '' : normalized.slice(0, slash);
}

function resolvePayloadPath(currentPath, reference) {
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!clean) return '';
  return normalizePath(clean.startsWith('/') ? clean.slice(1) : `${dirname(currentPath)}/${clean}`);
}

function createFallbackRenderer(payload) {
  const fileMap = new Map(payload.files.map(file => [normalizePath(file.path), file]));
  const dataUrlCache = new Map();

  function dataUrlFor(filePath) {
    const normalized = normalizePath(filePath);
    if (dataUrlCache.has(normalized)) return dataUrlCache.get(normalized);
    const file = fileMap.get(normalized);
    if (!file) return null;
    let data = file.data;
    if (file.mime.startsWith('text/css')) data = base64FromText(rewriteCss(textFromBase64(file.data), normalized));
    const url = `data:${file.mime};base64,${data}`;
    dataUrlCache.set(normalized, url);
    return url;
  }

  function rewriteCss(css, cssPath) {
    return css.replace(/url\(\s*(["']?)([^\)"']+)\1\s*\)/gi, (whole, quote, reference) => {
      if (/^(?:data:|https?:|#|var\()/i.test(reference)) return whole;
      const replacement = dataUrlFor(resolvePayloadPath(cssPath, reference));
      return replacement ? `url("${replacement}")` : whole;
    });
  }

  function resolveEntry(reference, currentPath) {
    let resolved = resolvePayloadPath(currentPath, reference);
    if (fileMap.has(resolved)) return resolved;
    if (fileMap.has(`${resolved}/index.html`)) return `${resolved}/index.html`;
    if (!resolved.endsWith('.html') && fileMap.has(`${resolved}.html`)) return `${resolved}.html`;
    return resolved;
  }

  function prepareHtml(filePath) {
    const normalized = normalizePath(filePath);
    const file = fileMap.get(normalized);
    if (!file) throw new Error(`封包內找不到頁面：${normalized}`);
    let html = textFromBase64(file.data);
    html = html.replace(/<script[^>]+src=["'][^"']*\/ai-lab\/_app\/session-guard\.js["'][^>]*><\/script>/gi, '');
    html = html.replace(/(\s(?:src|href)\s*=\s*)(["'])([^"']+)\2/gi, (whole, prefix, quote, reference) => {
      if (/^(?:[a-z]+:|#|\/|\?)/i.test(reference)) return whole;
      const resolved = resolveEntry(reference, normalized);
      const target = fileMap.get(resolved);
      if (!target || target.mime.startsWith('text/html')) return whole;
      const replacement = dataUrlFor(resolved);
      return replacement ? `${prefix}${quote}${replacement}${quote}` : whole;
    });
    html = rewriteCss(html, normalized);
    const navigationBridge = `<script>(function(){document.addEventListener('click',function(event){var link=event.target.closest('a[href]');if(!link)return;var href=link.getAttribute('href');if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(href))return;if(/^https?:/i.test(href)||href.charAt(0)==='/'){event.preventDefault();parent.location.href=href;return;}event.preventDefault();parent.postMessage({type:'kai-ai-lab-fallback-nav',href:href,current:${JSON.stringify(normalized)}},'*');});})();<\/script>`;
    return html.replace(/<\/body>/i, `${navigationBridge}</body>`);
  }

  return { fileMap, prepareHtml, resolveEntry };
}

function renderFallback(payload) {
  const renderer = createFallbackRenderer(payload);
  const shell = document.createElement('div');
  shell.className = 'fallback-shell';
  const frame = document.createElement('iframe');
  frame.className = 'fallback-frame';
  frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-downloads allow-popups allow-same-origin');
  const toolbar = document.createElement('div');
  toolbar.className = 'fallback-toolbar';
  toolbar.innerHTML = `<a href="${basePath}">Kai AI Lab</a><button type="button">鎖定並離開</button>`;
  shell.append(frame, toolbar);
  document.body.append(shell);

  const show = filePath => {
    frame.srcdoc = renderer.prepareHtml(filePath);
    history.replaceState(null, '', `${basePath}${requestedProject ? `?project=${encodeURIComponent(requestedProject)}` : ''}`);
  };
  addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.data?.type !== 'kai-ai-lab-fallback-nav') return;
    const target = renderer.resolveEntry(event.data.href, event.data.current);
    if (target === 'index.html' && payload.id !== 'portal') {
      location.href = basePath;
      return;
    }
    if (!renderer.fileMap.has(target)) {
      setStatus(`封包內找不到連結頁面：${target}`, true);
      return;
    }
    show(target);
  });
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.data?.type !== 'kai-ai-lab-fallback-nav') return;
    const target = renderer.resolveEntry(event.data.href, event.data.current);
    if (target === 'index.html' && payload.id !== 'portal') {
      location.href = basePath;
      return;
    }
    if (renderer.fileMap.has(target)) show(target);
  });
  toolbar.querySelector('button').addEventListener('click', () => {
    sessionStorage.removeItem('kaiAiLabUnlocked');
    sessionStorage.removeItem('kaiAiLabPassword');
    location.replace(basePath);
  });
  show(payload.entry || 'index.html');
}

async function unlock(password, projectId) {
  setStatus(projectId ? '正在開啟專案封包…' : '正在解密 AI Lab…');
  button.disabled = true;
  const bundleName = projectId || 'portal';
  const response = await fetch(`${basePath}bundles/${encodeURIComponent(bundleName)}.bundle.json`, { cache: 'no-store' });
  if (!response.ok) throw new Error('找不到對應的展示封包。');
  const bundle = await response.json();
  const payload = await decryptBundle(bundle, password);
  sessionStorage.setItem('kaiAiLabUnlocked', '1');
  sessionStorage.setItem('kaiAiLabPassword', password);

  if (canUseVirtualSite()) {
    await ensureServiceWorker();
    await cacheFiles(payload);
    location.replace(`${basePath}_app/${payload.entry || 'index.html'}`);
    return;
  }
  setStatus('已解密，正在建立 HTTP 相容展示畫面…');
  renderFallback(payload);
}

function showUnlockError(error) {
  console.error(error);
  const isWrongPassword = error.name === 'OperationError' || /密碼不正確/.test(error.message);
  setStatus(isWrongPassword ? '密碼不正確，無法解密封包。' : error.message, true);
  button.disabled = false;
  passwordInput.select();
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await unlock(passwordInput.value, requestedProject);
  } catch (error) {
    showUnlockError(error);
  }
});

const rememberedPassword = sessionStorage.getItem('kaiAiLabPassword');
if (rememberedPassword) {
  passwordInput.value = rememberedPassword;
  unlock(rememberedPassword, requestedProject).catch(error => {
    sessionStorage.removeItem('kaiAiLabPassword');
    sessionStorage.removeItem('kaiAiLabUnlocked');
    setStatus('工作階段已失效，請重新輸入分享密碼。', true);
    button.disabled = false;
    console.error(error);
  });
}
