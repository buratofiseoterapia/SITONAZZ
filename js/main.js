/* FisioMedica — main.js */

const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

/* ── Navbar + back-to-top on scroll ── */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

/* ── Mobile menu ── */
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  navMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Fade-in on scroll (staggered per grid row) ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.children)
      .filter(el => el.classList.contains('fade-in'));
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${idx * 0.1}s`;
    entry.target.classList.add('visible');
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ── Animated counters ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const steps    = 60;
  const inc      = target / steps;
  let   current  = 0;
  let   frame    = 0;
  const timer = setInterval(() => {
    frame++;
    current = Math.min(Math.round(inc * frame), target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, duration / steps);
}

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-answer').style.maxHeight =
        item.querySelector('.faq-answer').scrollHeight + 'px';
    }
  });
});

/* ── Contact form — Formspree ── */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso…';

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      success.style.display = 'flex';
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      const data = await res.json();
      const msg  = data?.errors?.map(err => err.message).join(', ') || 'Errore di invio';
      alert('Errore: ' + msg);
    }
  } catch {
    alert('Connessione fallita. Riprova o contattaci direttamente per telefono.');
  } finally {
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>Invia Richiesta';
  }
});

/* ── Back to top ── */
backToTop.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);
