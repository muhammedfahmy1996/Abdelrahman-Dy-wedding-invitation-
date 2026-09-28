function openEnv() {
  ['seal-left', 'seal-right'].forEach(id => document.getElementById(id).classList.add('open'));
  ['flap-top', 'flap-left', 'flap-right', 'flap-bottom'].forEach(id =>
    document.getElementById(id).classList.add('open')
  );
  setTimeout(() => {
    document.getElementById('envelope-screen').classList.add('hiding');
    setTimeout(() => {
      document.getElementById('envelope-screen').style.display = 'none';
      showAyah();
    }, 900);
  }, 1050);
}

// مدة ظهور الآية على الشاشة قبل ما تختفي (بالميلي ثانية)
const AYAH_HOLD_MS = 3600;

function showAyah() {
  const ayah = document.getElementById('ayah-screen');
  ayah.classList.add('show');

  setTimeout(() => {
    ayah.classList.remove('show');
    ayah.classList.add('hide');

    setTimeout(() => {
      ayah.style.display = 'none';
      showInvitation();
    }, 900);
  }, AYAH_HOLD_MS);
}

function showInvitation() {
  document.getElementById('invitation').style.display = 'block';
  startHearts();
  startPetals();
  startCountdown();
  setTimeout(() => {
    document.getElementById('card').classList.add('visible');
    document.querySelectorAll('.s').forEach(el => {
      const d = parseInt(el.dataset.d) || 0;
      setTimeout(() => el.classList.add('show'), d);
    });
  }, 100);
}

// *** تاريخ الفرح — غيّر هنا فقط ***
// UTC+2 هو توقيت مصر (EET) — ٦ مساءً = 20:٠٠ UTC
const WEDDING_DATE = '2026-11-30T17:00:00Z';

function startCountdown() {
  const target = new Date(WEDDING_DATE);

  function toAr(n) {
    return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }

  let timer = null;

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      ['cdd', 'cdh', 'cdm', 'cds'].forEach(id =>
        document.getElementById(id).textContent = '٠٠'
      );
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return;
    }
    document.getElementById('cdd').textContent = toAr(Math.floor(diff / 86400000));
    document.getElementById('cdh').textContent = toAr(String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'));
    document.getElementById('cdm').textContent = toAr(String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'));
    document.getElementById('cds').textContent = toAr(String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'));
  }

  tick();
  timer = setInterval(tick, 1000);
}

let heartsInterval = null;
let petalsInterval = null;

// زهرة صغيرة (ورد) بلون قابل للتخصيص — تُستخدم للورد اللافندر والورد الأبيض
function roseSVG(petalColor, centerColor) {
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(20,20)">
      <ellipse rx="9" ry="5" fill="${petalColor}" opacity="0.92"/>
      <ellipse rx="9" ry="5" fill="${petalColor}" opacity="0.92" transform="rotate(72)"/>
      <ellipse rx="9" ry="5" fill="${petalColor}" opacity="0.92" transform="rotate(144)"/>
      <ellipse rx="9" ry="5" fill="${petalColor}" opacity="0.92" transform="rotate(216)"/>
      <ellipse rx="9" ry="5" fill="${petalColor}" opacity="0.92" transform="rotate(288)"/>
      <circle r="4" fill="${centerColor}"/>
    </g>
  </svg>`;
}

const HEART_SHAPES = ['❤️', '💕', '💗', '💖', '♥️', '💝'];

function startHearts() {
  const c = document.getElementById('hearts-bg');
  const types = ['pearl', 'rose-lav', 'rose-white', 'heart'];

  function spawn() {
    if (document.hidden) return;
    const type = types[Math.floor(Math.random() * types.length)];
    const el = document.createElement('div');
    const dur = 10 + Math.random() * 9;
    let size;

    if (type === 'pearl') {
      size = 6 + Math.random() * 7;
      el.className = 'float-item pearl';
      el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;`;
    } else if (type === 'rose-lav') {
      size = 16 + Math.random() * 10;
      el.className = 'float-item rose-lav';
      el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;`;
      el.innerHTML = roseSVG('var(--rose)', 'var(--gold)');
    } else if (type === 'rose-white') {
      size = 16 + Math.random() * 10;
      el.className = 'float-item rose-white';
      el.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;`;
      el.innerHTML = roseSVG('#FFFDFC', 'var(--gold-light)');
    } else {
      size = 13 + Math.random() * 9;
      el.className = 'float-item heart';
      el.textContent = HEART_SHAPES[Math.floor(Math.random() * HEART_SHAPES.length)];
      el.style.cssText = `left:${Math.random() * 100}%;font-size:${size}px;`;
    }

    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * 4) + 's';
    c.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
  }

  for (let i = 0; i < 10; i++) setTimeout(spawn, i * 350);
  heartsInterval = setInterval(spawn, 1100);
}

function startPetals() {
  const c = document.getElementById('petals');
  const items = ['🌹', '🌸', '🌺', '✨', '💗', '🍃'];

  function spawn() {
    if (document.hidden) return;
    const el = document.createElement('div');
    el.className = 'petal';
    const dur = 11 + Math.random() * 10;
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.cssText = `left:${Math.random() * 100}%;bottom:-30px;font-size:${10 + Math.random() * 10}px;animation-duration:${dur}s;animation-delay:${Math.random() * 3}s;`;
    c.appendChild(el);
    setTimeout(() => el.remove(), (dur + 4) * 1000);
  }

  for (let i = 0; i < 5; i++) setTimeout(spawn, i * 500);
  petalsInterval = setInterval(spawn, 1800);
}