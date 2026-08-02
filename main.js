const STORAGE_KEY = 'gm-lang';

const nodes = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
  );
  nodes.forEach((node) => io.observe(node));
} else {
  nodes.forEach((node) => node.classList.add('is-in'));
}

const top = document.querySelector('.top');
let lastY = window.scrollY;
window.addEventListener(
  'scroll',
  () => {
    if (!top) return;
    const y = window.scrollY;
    const goingDown = y > lastY && y > 140;
    top.style.transform = goingDown ? 'translateY(-110%)' : 'translateY(0)';
    top.style.background = y > 24 ? 'rgba(247, 250, 252, 0.94)' : 'rgba(247, 250, 252, 0.84)';
    lastY = y;
  },
  { passive: true },
);

const shots = document.querySelectorAll('.project__shot img');
window.addEventListener(
  'scroll',
  () => {
    const mid = window.innerHeight * 0.5;
    shots.forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height * 0.5 - mid) * -0.045;
      img.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  },
  { passive: true },
);

function openFoldFromHash() {
  const id = window.location.hash.replace('#', '');
  if (!id) return;
  const fold = document.getElementById(id);
  if (fold instanceof HTMLDetailsElement) {
    fold.open = true;
    fold.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.addEventListener('hashchange', openFoldFromHash);
openFoldFromHash();

let dictionary = null;
let currentLang = 'ru';

function applyFoldHints() {
  const openLabel = dictionary?.[currentLang]?.open ?? 'открыть';
  const closeLabel = dictionary?.[currentLang]?.close ?? 'закрыть';
  document.documentElement.style.setProperty('--fold-open', `"${openLabel}"`);
  document.documentElement.style.setProperty('--fold-close', `"${closeLabel}"`);
}

function applyLanguage(lang) {
  if (!dictionary?.[lang]) return;
  currentLang = lang;
  const pack = dictionary[lang];

  document.documentElement.lang = pack.htmlLang || lang;
  document.documentElement.dataset.lang = lang;
  document.body.classList.toggle('is-hy', lang === 'hy');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && pack[key] != null) el.textContent = pack[key];
  });

  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const key = el.getAttribute('data-i18n-content');
    if (key && pack[key] != null) el.setAttribute('content', pack[key]);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key && pack[key] != null) el.setAttribute('aria-label', pack[key]);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (key && pack[key] != null) el.setAttribute('alt', pack[key]);
  });

  if (pack.title) document.title = pack.title;

  document.querySelectorAll('.lang__btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  applyFoldHints();
  localStorage.setItem(STORAGE_KEY, lang);
}

async function initI18n() {
  const response = await fetch('./i18n.json', { cache: 'no-store' });
  dictionary = await response.json();

  const saved = localStorage.getItem(STORAGE_KEY);
  const start = dictionary[saved] ? saved : 'ru';
  applyLanguage(start);

  document.querySelectorAll('.lang__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;
      document.body.classList.add('is-lang-switching');
      applyLanguage(lang);
      window.setTimeout(() => document.body.classList.remove('is-lang-switching'), 280);
    });
  });
}

initI18n().catch(() => {
  applyFoldHints();
});
