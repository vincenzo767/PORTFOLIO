// ===== Theme toggle =====
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ===== Mobile menu =====
const menuBtn = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const closeMenu = () => {
  menuBtn.classList.remove('open');
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
};
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== Header shadow + active nav link =====
const header = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Reveal on scroll (staggered) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 90 + 'ms';
    el.classList.add('visible');
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Animated counters =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== Typing effect =====
const roles = ['Full-Stack Developer', 'Backend Lead', 'Spring Boot & React Dev', 'IT Student @ CIT-U'];
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = roles[0].length, deleting = true;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function type() {
  const word = roles[roleIdx];
  charIdx += deleting ? -1 : 1;
  typedEl.textContent = word.slice(0, charIdx);
  let delay = deleting ? 45 : 90;
  if (!deleting && charIdx === word.length) { deleting = true; delay = 2200; }
  else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }
  setTimeout(type, delay);
}
if (!reduceMotion) setTimeout(type, 2200);

// ===== Project filters =====
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  projects.forEach(p => {
    const show = f === 'all' || p.dataset.cat === f;
    p.classList.toggle('hide', !show);
    if (show) { p.classList.remove('visible'); requestAnimationFrame(() => p.classList.add('visible')); }
  });
}));

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
