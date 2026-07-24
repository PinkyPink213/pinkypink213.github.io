const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const readingProgress = document.querySelector('.reading-progress');
const backToTop = document.querySelector('.back-to-top');

function updateReadingProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0
    ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
    : 0;

  readingProgress?.style.setProperty('transform', `scaleX(${progress})`);
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

function updateBackToTop() {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuButton?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1180 && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
