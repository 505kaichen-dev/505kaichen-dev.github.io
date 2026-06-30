// =========================================
// Storage Wiki — Shared JS (nav.js)
// Sidebar toggle, active link, search
// =========================================

// ---- Search index (populated per page) ----
// Each page appends its own entries to window.SEARCH_INDEX
window.SEARCH_INDEX = window.SEARCH_INDEX || [];

// ---- Sidebar toggle (mobile) ----
const menuToggle = document.getElementById('menu-toggle');
const sidebar    = document.getElementById('sidebar');
const overlay    = document.getElementById('sidebar-overlay');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });
}
if (overlay) {
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// ---- Active nav link ----
(function () {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ---- Search ----
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchInput && searchResults) {
  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (q.length < 2) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('active');
      return;
    }

    const hits = window.SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 8);

    if (hits.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">找不到相關結果</div>';
    } else {
      searchResults.innerHTML = hits.map(h =>
        `<a class="search-item" href="${h.url}">
          <div class="search-item-title">${h.title}</div>
          <div class="search-item-path">${h.path}</div>
        </a>`
      ).join('');
    }
    searchResults.classList.add('active');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });

  // Keyboard: Escape to close
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchResults.classList.remove('active');
      searchInput.blur();
    }
  });
}
