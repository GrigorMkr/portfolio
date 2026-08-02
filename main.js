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
    top.style.background = y > 24 ? 'rgba(9, 13, 9, 0.82)' : 'rgba(9, 13, 9, 0.66)';
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
      const offset = (rect.top + rect.height * 0.5 - mid) * -0.04;
      img.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  },
  { passive: true },
);
