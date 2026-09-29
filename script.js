// Mobile menu
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});

// Nav border appears after scrolling
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the current section in the nav
const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

// Skill bars fill once when they come into view
const bars = document.querySelectorAll('.bar i');
bars.forEach(b => b.style.setProperty('--w', b.dataset.level + '%'));
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
}, { threshold: .5 });
bars.forEach(b => io.observe(b));

// Soft fade-in for section content
const fadeEls = document.querySelectorAll('.section .container > *');
fadeEls.forEach(el => el.classList.add('reveal'));
const fadeObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: .1 });
fadeEls.forEach(el => fadeObserver.observe(el));

// Contact form: validate, then open the visitor's email app with the message filled in
const form = document.getElementById('form');
const msg = document.getElementById('msg');
const EMAIL = 'Dineshnandhan07@gmail.com';
form.addEventListener('submit', e => {
  e.preventDefault();
  const { name, email, message } = form.elements;
  let firstBad = null;
  [name, email, message].forEach(f => {
    const bad = !f.value.trim() || (f === email && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
    f.setAttribute('aria-invalid', bad);
    if (bad && !firstBad) firstBad = f;
  });
  msg.className = 'form-msg';
  if (firstBad) {
    msg.textContent = 'Enter your name, a valid email and a message.';
    msg.classList.add('error');
    firstBad.focus();
    return;
  }
  const subject = encodeURIComponent('Portfolio message from ' + name.value.trim());
  const body = encodeURIComponent(message.value.trim() + '\n\nReply to: ' + email.value.trim());
  location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  msg.textContent = 'Opening your email app to send the message.';
  msg.classList.add('ok');
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();

// Hide any link that still has a placeholder address, so visitors never hit a dead link
document.querySelectorAll('[data-placeholder]').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href === '#' || href.includes('your-username')) {
    a.hidden = true;
    if (a.parentElement.tagName === 'LI') a.parentElement.hidden = true;
  }
});
document.querySelectorAll('.p-links, .social').forEach(group => {
  if ([...group.querySelectorAll('a')].every(a => a.hidden)) group.hidden = true;
});

// Skill percentages count up as the bars fill
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('.skill-top span');
counters.forEach(c => { c.dataset.end = parseInt(c.textContent, 10); if (!prefersReduced) c.textContent = '0%'; });
const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);
    const el = e.target, end = +el.dataset.end;
    if (prefersReduced) return;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 1000, 1);
      el.textContent = Math.round(end * p) + '%';
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}, { threshold: .5 });
counters.forEach(c => countObserver.observe(c));