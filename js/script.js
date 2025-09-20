// Global interactions for all pages: mobile nav, reveal on scroll, back-to-top, active nav

document.addEventListener('DOMContentLoaded', () => {
  // year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '64px';
        navList.style.right = '14px';
        navList.style.background = 'white';
        navList.style.padding = '12px';
        navList.style.borderRadius = '12px';
        navList.style.boxShadow = '0 18px 48px rgba(16,24,40,0.12)';
        navList.style.zIndex = '99';
        Array.from(navList.querySelectorAll('a')).forEach(a => a.style.padding = '8px 10px');
      } else {
        navList.style.display = '';
        navList.removeAttribute('style');
      }
    });
  }

  // mark active nav by body data-page
  const page = document.body.dataset.page;
  if (page) {
    const link = document.querySelector(`.primary-nav a[data-page="${page}"]`);
    if (link) link.classList.add('active');
  }

  // smooth anchor scroll (fallback if used)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.innerWidth < 760 && navList) {
            navList.style.display = '';
            navList.removeAttribute('style');
            navToggle?.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // reveal on scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom')
    .forEach(el => observer.observe(el));

  // back to top
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.style.display = window.scrollY > 500 ? 'grid' : 'none';
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // simple counter animation (if elements with data-count exist)
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const step = Math.ceil(target / 40);
    const inc = () => {
      current += step;
      if (current >= target) { current = target; }
      el.textContent = current.toString();
      if (current < target) requestAnimationFrame(inc);
    };
    requestAnimationFrame(inc);
  });

  // contact form
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleContact);
});

function handleContact(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const org = (document.getElementById('org')?.value || '').trim();
  const message = document.getElementById('message').value.trim();
  const formMsg = document.getElementById('formMsg');

  if (!name || !email || !message) {
    formMsg.textContent = 'Please fill all required fields.';
    formMsg.style.color = 'crimson';
    return false;
  }
  const subject = encodeURIComponent('Enquiry from website: ' + name);
  let body = `Name: ${name}\n`;
  if (org) body += `Organization: ${org}\n`;
  body += `Email: ${email}\n\n${message}`;
  window.location.href = `mailto:pkirkire@eupraxiaconsulting.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  formMsg.textContent = 'Opening your email client…';
  formMsg.style.color = '';
  return false;
}
