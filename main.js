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
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
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
    const y = window.scrollY;
    if (!top) return;
    top.style.transform = y > lastY && y > 120 ? 'translateY(-110%)' : 'translateY(0)';
    lastY = y;
  },
  { passive: true },
);

if (top) {
  top.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
}
