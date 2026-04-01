/* =============================================
   PORTFOLIO — main.js
   ============================================= */

const API_BASE = '/api'; // proxied via Express

/* ── NAV SCROLL ─────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.06}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-card, .project-card, .blog-card, .about-grid, .contact-grid')
  .forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

/* ── ACTIVE NAV LINK ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── FETCH PROJECTS ─────────────────────────── */
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const res  = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    if (!data.length) throw new Error('empty');

    grid.innerHTML = data.map(p => `
      <article class="project-card reveal">
        <div class="project-card-thumb">
          <span class="thumb-emoji">${p.emoji || '🖥️'}</span>
        </div>
        <div class="project-card-body">
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-links">
            ${p.live_url  ? `<a href="${p.live_url}"  target="_blank" class="project-link">Live ↗</a>` : ''}
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="project-link">GitHub ↗</a>` : ''}
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.project-card').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } catch {
    grid.innerHTML = `<p class="project-loading">Could not load projects. Check back soon.</p>`;
  }
}

/* ── FETCH BLOG POSTS ───────────────────────── */
async function loadBlogPosts() {
  const grid = document.getElementById('blog-grid');
  try {
    const res  = await fetch(`${API_BASE}/blog`);
    const data = await res.json();
    if (!data.length) throw new Error('empty');

    grid.innerHTML = data.map(post => `
      <article class="blog-card reveal">
        <div class="blog-card-date">${formatDate(post.published_at)}</div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <span class="blog-card-read">Read more →</span>
      </article>
    `).join('');

    grid.querySelectorAll('.blog-card').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } catch {
    grid.innerHTML = `<p class="blog-loading">No posts yet — check back soon.</p>`;
  }
}

/* ── CONTACT FORM ───────────────────────────── */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const btnText    = submitBtn?.querySelector('.btn-text');
const btnSpinner = submitBtn?.querySelector('.btn-spinner');
const feedback   = document.getElementById('form-feedback');
const messageField = document.getElementById('message');

// Debug: Check if elements exist and are enabled
console.log('Contact form elements:', {
  form: !!form,
  submitBtn: !!submitBtn,
  btnText: !!btnText,
  btnSpinner: !!btnSpinner,
  feedback: !!feedback,
  messageField: !!messageField,
  messageDisabled: messageField?.disabled,
  messageReadonly: messageField?.readOnly
});

// Ensure message field is enabled
if (messageField) {
  messageField.disabled = false;
  messageField.readOnly = false;
  messageField.style.pointerEvents = 'auto';
  messageField.style.userSelect = 'auto';
  console.log('✅ Message field enabled');
}

if (!form) {
  console.error('Contact form not found!');
} else {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    
    if (!feedback) {
      console.error('Feedback element not found!');
      return;
    }
    
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    const payload = {
      name:    form.name?.value?.trim() || '',
      email:   form.email?.value?.trim() || '',
      subject: form.subject?.value?.trim() || '',
      message: form.message?.value?.trim() || '',
    };

    console.log('Form payload:', payload);

    if (!payload.name || !payload.email || !payload.message) {
      showFeedback('Please fill in all required fields.', 'error');
      return;
    }
    if (!isValidEmail(payload.email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending to API...');
      const res  = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('API response:', res.status);
      
      // Better JSON parsing with error handling
      let data;
      try {
        const text = await res.text();
        console.log('Raw response:', text);
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid server response');
      }
      
      console.log('API data:', data);
      
      if (!res.ok) throw new Error(data.error || 'Server error');

      showFeedback('✓ Message sent! I\'ll be in touch soon.', 'success');
      form.reset();
    } catch (err) {
      console.error('Form submission error:', err);
      showFeedback(`✗ ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  });
}

function setLoading(loading) {
  if (submitBtn) submitBtn.disabled = loading;
  if (btnText) btnText.classList.toggle('hidden', loading);
  if (btnSpinner) btnSpinner.classList.toggle('hidden', !loading);
}

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `form-feedback ${type}`;
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* ── HELPERS ────────────────────────────────── */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ── INIT ───────────────────────────────────── */
loadProjects();
loadBlogPosts();