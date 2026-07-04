// BLAZEFIRE ENTERPRISE — shared site behavior

// Register service worker (installable "app" experience + offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Testimonial carousel
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dots button');
  let ti = 0;
  if (slides.length) {
    const show = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      ti = i;
    };
    dots.forEach((d, idx) => d.addEventListener('click', () => show(idx)));
    setInterval(() => show((ti + 1) % slides.length), 5500);
  }

  // Portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pfItems = document.querySelectorAll('.pf-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      pfItems.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Quote form -> friendly submit (no backend wired yet)
  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = quoteForm.querySelector('button[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Request sent ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; quoteForm.reset(); }, 2600);
    });
  }

  // Client portal demo login
  const loginForm = document.querySelector('#portal-login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.querySelector('#login-panel').style.display = 'none';
      document.querySelector('#dashboard-panel').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const logoutBtn = document.querySelector('#portal-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.querySelector('#dashboard-panel').style.display = 'none';
      document.querySelector('#login-panel').style.display = 'block';
    });
  }

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // "Install App" — surfaces the browser's install prompt when available
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    const navInner = document.querySelector('.nav-inner');
    if (!navInner || document.querySelector('.install-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'install-btn';
    btn.type = 'button';
    btn.textContent = 'Install App';
    btn.style.cssText = 'margin-left:10px; padding:9px 16px; border-radius:20px; border:1px solid var(--ochre-line); background:transparent; font-size:13px; font-weight:600; color:var(--espresso); cursor:pointer;';
    btn.addEventListener('click', async () => {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      await deferredInstall.userChoice;
      deferredInstall = null;
      btn.remove();
    });
    navInner.insertBefore(btn, navInner.querySelector('.nav-toggle'));
  });
});
