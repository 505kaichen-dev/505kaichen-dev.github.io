(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-feature]')];
  function activate(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); activate(tabs[next]); tabs[next].focus();
    });
  });
  const themes = {
    amethyst: ['紫晶航線', '紫髮角色、水晶城市與柔和紫色。'],
    fluent: ['標準淺色', '留白、清楚的表格與 Microsoft 風格藍色。']
  };
  document.querySelectorAll('[data-theme]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.theme;
      const [name, description] = themes[key];
      document.querySelectorAll('[data-theme]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const image = document.getElementById('theme-image');
      image.src = `image/showcase-${key}.png`;
      image.alt = `${name}主題的 Downloader 實際介面，使用示範資料`;
      document.getElementById('theme-description').textContent = `${name} · ${description}`;
      const zoom = document.getElementById('theme-zoom');
      zoom.dataset.zoom = image.getAttribute('src');
      zoom.dataset.caption = `beta.10 ${name}主題，使用示範資料。`;
    });
  });
  const dialog = document.getElementById('image-dialog');
  let opener;
  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const image = document.getElementById('dialog-image');
      image.src = button.dataset.zoom;
      image.alt = button.dataset.caption;
      document.getElementById('dialog-caption').textContent = button.dataset.caption;
      dialog.showModal(); dialog.scrollTop = 0; dialog.scrollLeft = 0;
      document.body.classList.add('dialog-open');
    });
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); opener?.focus(); });
  document.getElementById('copy-hash').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(document.getElementById('file-hash').textContent.trim());
      status.textContent = '已複製';
    } catch { status.textContent = '請選取上方雜湊文字手動複製。'; }
  });
})();
