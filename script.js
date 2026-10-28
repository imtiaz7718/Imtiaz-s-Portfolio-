/* Portfolio interactivity */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Navbar background + back-to-top visibility
  const nav = $('#nav'), top = $('#top');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 30);
    top.classList.toggle('show', scrollY > 500);
    // Last section (Contact) is short, so highlight it when scrolled to the bottom
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
      $$('.menu a').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#contact'));
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Scroll reveal
  // After the entrance animation ends, drop the reveal classes and delay so
  // the cards' own hover transitions (lift, border, shadow) work normally.
  const finishReveal = el => {
    el.classList.remove('reveal', 'visible');
    el.style.transitionDelay = '';
  };
  const revealObs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('visible');
      o.unobserve(el);
      el.addEventListener('transitionend', ev => { if (ev.propertyName === 'opacity') finishReveal(el); }, { once: true });
      setTimeout(() => finishReveal(el), 1500); // fallback if transitionend never fires
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; revealObs.observe(el); });

  // Active nav link highlighting
  const links = $$('.menu a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Contact form validation
  const form = $('#form'), status = $('#status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Please enter a subject.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };
  const check = el => {
    const res = rules[el.name](el.value);
    el.classList.toggle('invalid', res !== true);
    el.setAttribute('aria-invalid', res !== true);
    el.nextElementSibling.textContent = res === true ? '' : res;
    return res === true;
  };
  $$('input,textarea', form).forEach(el => el.addEventListener('blur', () => check(el)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $$('input,textarea', form).map(check).every(Boolean);
    if (!ok) { status.style.color = '#f87171'; status.textContent = 'Please fix the highlighted fields.'; return; }
    // No backend: open the visitor's email app with the message prefilled.
    // To use a real form service, replace this with fetch() to your endpoint.
    const d = new FormData(form);
    const body = `${d.get('message')}\n\nFrom: ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:imtiaz7718@gmail.com?subject=${encodeURIComponent(d.get('subject'))}&body=${encodeURIComponent(body)}`;
    status.style.color = '#4ade80'; status.textContent = 'Opening your email app…';
    form.reset();
  });
})();
