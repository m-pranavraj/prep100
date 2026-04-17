/* =========================================
   PREP100 — JavaScript Interactions
   ========================================= */

// ---- STICKY EFFECTS ----
const stickyCTA = document.getElementById('stickyCTA');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Sticky CTA (shows after hero)
  if (y > 500) stickyCTA.classList.add('show');
  else stickyCTA.classList.remove('show');

  // Scroll to top button
  if (y > 800) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');
});

// ---- VIEW SWITCHER LOGIC ----
function switchView(view) {
  const jnvView = document.getElementById('view-jnv');
  const ndaView = document.getElementById('view-nda');
  const btnJnv = document.getElementById('btn-jnv');
  const btnNda = document.getElementById('btn-nda');

  if (view === 'nda') {
    jnvView.style.display = 'none';
    ndaView.style.display = 'block';
    if (btnJnv) btnJnv.classList.remove('active');
    if (btnNda) btnNda.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    jnvView.style.display = 'block';
    ndaView.style.display = 'none';
    if (btnJnv) btnJnv.classList.add('active');
    if (btnNda) btnNda.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Refresh AOS for new view immediately
  const activeView = view === 'nda' ? ndaView : jnvView;
  const elements = document.querySelectorAll('[data-aos]');
  const whatsappBtn = document.getElementById('whatsappBtn');

  // Update WhatsApp Floating Button for the active track
  if (whatsappBtn) {
    if (view === 'nda') {
      whatsappBtn.href = "https://wa.me/919579119726?text=Jai%20Hind!%20I%27m%20Interested%20to%20know%20more%20about%20NDA/DCA";
    } else {
      whatsappBtn.href = "https://wa.me/919579119726?text=नमस्ते%2C%20मुझे%20नवोदय%20और%20सैनिक%20स्कूल%20कोचिंग%20के%20बारे%20में%20जानकारी%20चाहिए";
    }
  }
  
  elements.forEach(el => {
    el.classList.remove('aos-visible');
    // Force immediate show if it's in the visible fold of the selected view
    if (activeView.contains(el)) {
      const rect = el.getBoundingClientRect();
      // If it's effectively at the top (since we just scrolled to 0) or within 1000px
      if (rect.top < 1000) {
        el.classList.add('aos-visible');
      }
    }
    if (typeof observer !== 'undefined') {
      observer.observe(el);
    }
  });
}

// Global exposure
window.switchView = switchView;

// ---- SCROLL TO TOP ----
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- SCROLL REVEAL ANIMATIONS ----
const aosElements = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
aosElements.forEach(el => observer.observe(el));

// Refresh observer logic for dynamic content
function refreshAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  elements.forEach(el => {
    el.classList.remove('aos-visible');
    observer.observe(el);
  });
}
window.refreshAOS = refreshAOS;

// ---- ANIMATED COUNTER ----
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const statsSection = document.getElementById('stats');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statNums.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
    });
  }
}, { threshold: 0.2 });
if (statsSection) statsObserver.observe(statsSection);

// Add NDA stats section to observer
const ndaStatsSection = document.getElementById('nda-stats');
if (ndaStatsSection) statsObserver.observe(ndaStatsSection);

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('en-IN');
  }
  requestAnimationFrame(step);
}

// ---- COUNTDOWN TIMER ----
function getCountdownTarget() {
  // Set target: next Monday at 6:00 AM IST from now
  const now = new Date();
  const target = new Date(now);
  // Set to a fixed upcoming date: 15 days from now
  target.setDate(now.getDate() + 15);
  target.setHours(6, 0, 0, 0);
  return target;
}

const countdownTarget = getCountdownTarget();

function updateCountdown() {
  const now = new Date();
  const diff = countdownTarget - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hrs').textContent = '00';
    document.getElementById('cd-min').textContent = '00';
    document.getElementById('cd-sec').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hrs').textContent = String(hrs).padStart(2, '0');
  document.getElementById('cd-min').textContent = String(min).padStart(2, '0');
  document.getElementById('cd-sec').textContent = String(sec).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- REGISTRATION FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    // Confetti effect
    launchConfetti();
  }, 1400);
}

// ---- CONFETTI ----
function launchConfetti() {
  const colors = ['#C80EE7', '#D513F0', '#ff9bff', '#fff', '#ffe100', '#a0f0ff'];
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    alpha: 1,
    spin: (Math.random() - 0.5) * 0.2,
    angle: Math.random() * Math.PI * 2,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.alpha -= 0.008;
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else canvas.remove();
  }
  requestAnimationFrame(draw);
}



// ---- CARD TILT EFFECT (Desktop only) ----
if (window.innerWidth > 768) {
  document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (y - cy) / cy * 4;
      const ry = (cx - x) / cx * 4;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- TOOLTIP ENHANCEMENT ----
document.querySelectorAll('[title]').forEach(el => {
  el.setAttribute('data-tooltip', el.getAttribute('title'));
  el.removeAttribute('title');
});

// ---- WHATSAPP FLOAT PULSE ----
setTimeout(() => {
  const wa = document.getElementById('whatsappBtn');
  if (wa) {
    wa.style.animation = 'waPulse 2s ease-in-out 1';
    const style = document.createElement('style');
    style.textContent = `@keyframes waPulse {
      0% { transform: scale(1); }
      30% { transform: scale(1.2); }
      60% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }`;
    document.head.appendChild(style);
  }
}, 3000);

// ---- LAZY LOAD IMAGES ----
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ---- GLOWING CURSOR TRAIL (desktop) ----
// Cursor trail removed as requested


console.log('%cPrep100 🚀 — Your Path to Navodaya Success', 
  'color: #C80EE7; font-size: 20px; font-weight: bold; font-family: Outfit, sans-serif;');
