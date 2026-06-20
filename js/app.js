'use strict';

/* =============================================
   TaskFlow – app.js
   All JS functionality in one place
   ============================================= */

// ─── DOM references ──────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobile-nav');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');
const blogGrid    = document.getElementById('blog-grid');

/* =============================================
   1. Navbar – scroll effect
   ============================================= */
const handleScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* =============================================
   2. Mobile menu toggle
   ============================================= */
hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
    document.body.style.overflow = '';
  }
});

/* =============================================
   3. Dark / light mode
   ============================================= */
const THEME_KEY = 'tf-theme';
const applyTheme = theme => {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  themeToggle.querySelector('.theme-label').textContent = theme === 'light' ? 'Dark' : 'Light';
  themeToggle.querySelector('.theme-icon').textContent  = theme === 'light' ? '🌙' : '☀️';
};

// Initialise from stored preference or system preference
const storedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const current = document.body.classList.contains('light') ? 'light' : 'dark';
  const next    = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

/* =============================================
   4. Form validation
   ============================================= */
const validators = {
  name: {
    test: v => v.trim().length >= 2,
    msg: 'Name must be at least 2 characters.'
  },
  email: {
    test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    msg: 'Please enter a valid email address.'
  },
  message: {
    test: v => v.trim().length >= 10,
    msg: 'Message must be at least 10 characters.'
  }
};

const setFieldState = (field, errorEl, valid, msg = '') => {
  field.classList.toggle('valid',   valid);
  field.classList.toggle('invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  errorEl.textContent = valid ? '' : msg;
};

const validateField = field => {
  const name    = field.dataset.validate;
  const rule    = validators[name];
  const errorEl = field.closest('.form-group').querySelector('.field-error');
  if (!rule) return true;
  const valid = rule.test(field.value);
  setFieldState(field, errorEl, valid, rule.msg);
  return valid;
};

// Live validation on blur
contactForm.querySelectorAll('[data-validate]').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
  });
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const fields  = [...contactForm.querySelectorAll('[data-validate]')];
  const results = fields.map(validateField);
  const allOk   = results.every(Boolean);

  formStatus.className = 'form-status';
  formStatus.textContent = '';

  if (!allOk) {
    formStatus.classList.add('error');
    formStatus.textContent = '⚠️ Please fix the errors above before submitting.';
    contactForm.querySelector('.invalid')?.focus();
    return;
  }

  // Simulate network request
  const submitBtn = contactForm.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    contactForm.reset();
    fields.forEach(f => {
      f.classList.remove('valid', 'invalid');
      f.removeAttribute('aria-invalid');
    });
    formStatus.classList.add('success');
    formStatus.textContent = '✅ Message sent! We\'ll be in touch shortly.';
    formStatus.focus();
  }, 1200);
});

/* =============================================
   5. Scroll-reveal (IntersectionObserver)
   ============================================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger children if .stagger
      if (entry.target.classList.contains('stagger')) {
        entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
          child.style.setProperty('--i', i);
          child.classList.add('reveal');
          requestAnimationFrame(() => child.classList.add('visible'));
        });
      } else {
        entry.target.classList.add('visible');
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

/* =============================================
   6. Blog – API fetch from JSONPlaceholder
   ============================================= */
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const TOPIC_ICONS = ['🚀', '📋', '🤝', '🔧', '📊', '💡'];

const CATEGORIES = ['Productivity', 'Updates', 'Team', 'How-to', 'Analytics', 'Ideas'];

const formatTitle = str =>
  str.length > 60 ? str.slice(0, 57) + '…' : str;

const formatExcerpt = str =>
  str.length > 100 ? str.slice(0, 97) + '…' : str;

const renderSkeletons = () => {
  blogGrid.innerHTML = Array.from({ length: 6 }, () => `
    <article class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    </article>
  `).join('');
};

const renderPosts = posts => {
  blogGrid.innerHTML = posts.map((post, i) => `
    <article class="blog-card reveal" aria-label="Blog post: ${formatTitle(post.title)}">
      <div class="blog-img" role="img" aria-label="${CATEGORIES[i]} icon">${TOPIC_ICONS[i]}</div>
      <div class="blog-body">
        <div class="blog-meta">
          <span class="badge">${CATEGORIES[i]}</span>
          <span class="blog-dot" aria-hidden="true">·</span>
          <time>June 2026</time>
        </div>
        <h3 class="blog-title">${formatTitle(post.title)}</h3>
        <p class="blog-excerpt">${formatExcerpt(post.body)}</p>
        <a href="#" class="blog-link" aria-label="Read more: ${formatTitle(post.title)}">
          Read more <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `).join('');

  // Observe newly rendered cards
  blogGrid.querySelectorAll('.reveal').forEach(el => io.observe(el));
};

const renderError = msg => {
  blogGrid.innerHTML = `
    <div class="blog-error" role="alert">
      <p>⚠️ ${msg}</p>
      <button class="btn btn-ghost" id="retry-btn" style="margin-top:1rem" onclick="fetchPosts()">
        Retry
      </button>
    </div>
  `;
};

const fetchPosts = async () => {
  renderSkeletons();
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);
    const res        = await fetch(`${API_URL}?_limit=6`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    if (err.name === 'AbortError') {
      renderError('Request timed out. Check your connection and try again.');
    } else {
      renderError(`Failed to load posts: ${err.message}`);
    }
  }
};

// Kick off fetch on page load
fetchPosts();

/* =============================================
   7. Keyboard-accessible nav links (tab trap when mobile nav open)
   ============================================= */
mobileNav.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = [...mobileNav.querySelectorAll('a, button')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* =============================================
   8. Lazy-load images via IntersectionObserver
   ============================================= */
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    obs.unobserve(img);
  });
}, { rootMargin: '200px' });

document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
