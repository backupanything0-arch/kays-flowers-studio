const header = document.querySelector('#site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  header.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

// Open / close with the hamburger
toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

// Close after a link is chosen
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

// Close with the Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

// Reset if the window is widened to desktop size
window.matchMedia('(min-width: 960px)').addEventListener('change', e => {
  if (e.matches) setMenu(false);
});

// Solid header once the visitor scrolls
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (document.querySelector('#lightbox')) {
/* ---------- Gallery lightbox ---------- */
const galleryButtons = [...document.querySelectorAll('.gallery-btn')];
const lightbox = document.querySelector('#lightbox');
const lbImg = document.querySelector('#lb-img');
const lbCount = document.querySelector('#lb-count');
const lbClose = lightbox.querySelector('.lb-close');
const lbPrev = lightbox.querySelector('.lb-prev');
const lbNext = lightbox.querySelector('.lb-next');

let current = 0;
let lastFocused = null;

function showImage(index) {
  current = (index + galleryButtons.length) % galleryButtons.length;
  const img = galleryButtons[current].querySelector('img');
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCount.textContent = `${current + 1} / ${galleryButtons.length}`;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  showImage(index);
  lightbox.classList.add('is-open');
  document.body.classList.add('lightbox-open');
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
  if (lastFocused) lastFocused.focus();
}

galleryButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showImage(current - 1));
lbNext.addEventListener('click', () => showImage(current + 1));

// Click on the dark background closes it
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard: Escape, arrow keys, and keeping Tab inside the lightbox
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showImage(current - 1);
  if (e.key === 'ArrowRight') showImage(current + 1);

  if (e.key === 'Tab') {
    const focusable = [lbClose, lbPrev, lbNext];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Swipe left or right on phones
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showImage(dx > 0 ? current - 1 : current + 1);
}, { passive: true });

}
/* ---------- Fade in on scroll ---------- */
const revealTargets = document.querySelectorAll(
  '.statement-inner, .section-head, .flower-card, .occasion-list li, ' +
  '.about-inner > *, .weddings-inner > *, .gallery-item, .why-card, .cta-inner'
);

revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el, i) => {
    // Small stagger for items that share a row
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

/* ---------- Contact form ---------- */
const form = document.querySelector('#enquiry-form');

if (form) {
  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    phone: form.querySelector('#phone'),
    occasion: form.querySelector('#occasion'),
    message: form.querySelector('#message')
  };
  const success = document.querySelector('#form-success');

  function setError(field, text) {
    const note = document.querySelector('#' + field.id + '-error');
    note.textContent = text;
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    return !text;
  }

  function validate() {
    const results = [
      setError(fields.name, fields.name.value.trim() ? '' : 'Please enter your name.'),
      setError(
        fields.email,
        fields.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())
          ? 'Please enter a valid email address, for example name@example.com.' : ''
      ),
      setError(
        fields.phone,
        fields.phone.value.trim() && !/^[+\d][\d\s()-]{6,}$/.test(fields.phone.value.trim())
          ? 'Please enter a valid phone number, for example 079 123 4567.' : ''
      ),
      setError(fields.message, fields.message.value.trim() ? '' : 'Please tell us what you are looking for.')
    ];
    return results.every(Boolean);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.textContent = '';

    if (!validate()) {
      const firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    const lines = [
      "Hello Kay's Flowers & Co, I'd like to enquire about your flowers.",
      '',
      'Name: ' + fields.name.value.trim()
    ];
    if (fields.occasion.value) lines.push('Occasion: ' + fields.occasion.value);
    if (fields.email.value.trim()) lines.push('Email: ' + fields.email.value.trim());
    if (fields.phone.value.trim()) lines.push('Phone: ' + fields.phone.value.trim());
    lines.push('', 'Message: ' + fields.message.value.trim());

    const url = 'https://wa.me/27790817908?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');

    success.textContent = 'Thank you, ' + fields.name.value.trim() +
      '. WhatsApp is opening with your message. Press send there to finish.';
    form.reset();
  });

  // Clear an error as soon as the visitor fixes the field
  Object.values(fields).forEach(field => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') setError(field, '');
    });
  });
}