//boot seq
const psxBootLines = [
  { text: 'PORTFOLIO BIOS v1.2', cls: 'psx-bl-white', delay: 0 },
  { text: 'Copyright (C) 2026 Stephanie Ho Yen Yuin', cls: '', delay: 200 },
  { text: '\u00a0', cls: '', delay: 380 },
  { text: 'Checking memory card...', cls: '', delay: 500 },
  { text: 'Memory Card (Life 1) OK', cls: 'psx-bl-green', delay: 900 },
  { text: 'Loading save data...', cls: '', delay: 1100, bar: true },
  { text: '\u00a0', cls: '', delay: 1900 },
  { text: 'Launching portfolio...', cls: 'psx-bl-white', delay: 2000 },
];

let psxBootTimers = [];

function psxFinishBoot() {
  const boot = document.getElementById('psx-boot');
  const portfolio = document.getElementById('psx-portfolio');
  if (boot) boot.style.opacity = '0';
  setTimeout(() => {
    if (boot) boot.style.display = 'none';
    if (portfolio) portfolio.style.opacity = '1';
  }, 600);
}

function psxRunBoot() {
  const container = document.getElementById('psx-boot-lines');
  const barWrap = document.getElementById('psx-bar-wrap');
  const barFill = document.getElementById('psx-bar-fill');
  if (!container) return;

  psxBootLines.forEach((item) => {
    const t = setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'psx-boot-line ' + (item.cls || '');
      line.textContent = item.text;
      container.appendChild(line);
      requestAnimationFrame(() => line.classList.add('psx-bl-show'));

      if (item.bar && barWrap && barFill) {
        barWrap.classList.add('psx-bl-show');
        let pct = 0;
        const iv = setInterval(() => {
          pct += 5;
          barFill.style.width = Math.min(pct, 100) + '%';
          if (pct >= 100) clearInterval(iv);
        }, 35);
      }
    }, item.delay);
    psxBootTimers.push(t);
  });

  const finalT = setTimeout(psxFinishBoot, 3500);
  psxBootTimers.push(finalT);
}

//education
function psxToggleBio() {
  const bio = document.getElementById('psx-save-bio');
  if (bio) bio.classList.toggle('psx-save-bio-open');
  const slot = document.querySelector('.psx-save-selected');
  if (slot) slot.classList.toggle('psx-save-bio-active');
}
function psxToggleBio(slotEl) {
    // The bio is always the next sibling element after the slot
    const bio = slotEl.nextElementSibling;
    if (!bio || !bio.classList.contains('psx-save-bio')) return;

    const isOpen = bio.classList.contains('psx-save-bio-open');

    // Close all open bios first
    document.querySelectorAll('.psx-save-bio-open').forEach(b => b.classList.remove('psx-save-bio-open'));

    // Toggle the clicked one
    if (!isOpen) bio.classList.add('psx-save-bio-open');
}

//dict
const synonyms = {
  'Blender': ['3d', 'model', 'modelling', 'animation', 'texture'],
  'Unity (C#)': ['game', 'gaming'],
  'iClone8': ['animation'],
  'CC4': ['3d', 'model'],
  'Prototyping': ['prototype'],
  'Photoshop': ['texture'],
  'Arduino': ['electronics', 'wiring', 'hardware'],
  'Adobe XD': ['ui', 'ux', 'ui/ux', 'hi-fidelity', 'low-fidelity', 'wireframe', 'hi-fi', 'lo-fi', 'user'],
  'Krita': ['2d', 'concept art', 'art', 'drawing'],
  'Maya': ['3d', 'model', 'modelling', 'texture']
};

const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const cards = document.querySelectorAll('.project-card');

function normalizeWords(text) {
  return text.toLowerCase().trim().split(/\s+/);
}

function getMatchingTags(query) {
  const words = normalizeWords(query);
  if (!query.trim()) return new Set();
  const matches = new Set();

  cards.forEach(card => {
    card.querySelectorAll('.tag').forEach(tag => {
      const tagText = tag.textContent.toLowerCase();
      words.forEach(word => {
        if (tagText.includes(word)) matches.add(tagText);
      });
    });
  });

  Object.entries(synonyms).forEach(([mainTag, aliasList]) => {
    const allTerms = [mainTag.toLowerCase(), ...aliasList.map(a => a.toLowerCase())];
    words.forEach(word => {
      if (allTerms.some(term => term.includes(word))) matches.add(mainTag.toLowerCase());
    });
  });

  return matches;
}

function runSearch(query) {
  const matchingTags = getMatchingTags(query);
  searchClear.classList.toggle('visible', query.length > 0);

  cards.forEach(card => {
    if (!query.trim()) {
      card.classList.remove('hidden');
      card.querySelectorAll('.tag').forEach(tag => tag.classList.remove('highlighted'));
      return;
    }

    let cardMatches = false;
    card.querySelectorAll('.tag').forEach(tag => {
      const isMatch = matchingTags.has(tag.textContent.toLowerCase());
      tag.classList.toggle('highlighted', isMatch);
      if (isMatch) cardMatches = true;
    });
    card.classList.toggle('hidden', !cardMatches);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => runSearch(searchInput.value));
}
if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    runSearch('');
    searchInput.focus();
  });
}

//scroll reveal
const revealTargets = document.querySelectorAll('.project-card, .section');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(target => revealObserver.observe(target));

//play video on hover
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;
  card.addEventListener('mouseenter', () => video.play());
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

//nav state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
  });
}, { passive: true });

//modals
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
  }
});

//carousels
function scrollCarousel(direction) {
  const carousel = document.getElementById('personalCarousel');
  if (!carousel) return;
  carousel.scrollBy({ left: direction * carousel.clientWidth * 0.8, behavior: 'smooth' });
}

function scrollModalImages(btn, direction) {
  const strip = btn.parentElement.querySelector('.modal-scroll-x');
  const slide = strip.querySelector('.modal-slide');
  if (!slide) return;
  strip.scrollBy({ left: direction * (slide.offsetWidth + 16), behavior: 'smooth' });
}

let currentSlide = 0;
function scrollIteration(direction) {
  const carousel = document.getElementById('iterationCarousel');
  if (!carousel) return;
  const track = carousel.parentElement;
  const slides = carousel.querySelectorAll('.iteration-slide');
  currentSlide = Math.max(0, Math.min(currentSlide + direction, slides.length - 1));
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  carousel.style.transition = 'transform 0.4s ease';
  track.style.height = slides[currentSlide].scrollHeight + 'px';
}

function scrollSiteModel(direction) {
  const carousel = document.getElementById('siteModelCarousel');
  if (!carousel) return;
  const card = carousel.querySelector('.grid-image');
  if (!card) return;
  carousel.scrollBy({ left: direction * (card.offsetWidth + 12), behavior: 'smooth' });
}

//tabs
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + tab);
  if (panel) {
    panel.classList.add('active');
    panel.querySelectorAll('.section').forEach(el => el.classList.add('visible'));
  }
}

//tooltip (viz)
const trigger = document.querySelector('.hover-trigger');
const tooltip = document.getElementById('custom-tooltip');

if (trigger && tooltip) {
  trigger.addEventListener('mousemove', (e) => {
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top = (e.clientY + 14) + 'px';
  });
  trigger.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  //boot seq
  psxRunBoot();

  //WIP modal (remove aft done)
  setTimeout(() => openModal('modal-info'), 3800);

  //carou height
  const iterCarousel = document.getElementById('iterationCarousel');
  if (iterCarousel) {
    const track = iterCarousel.parentElement;
    const slides = iterCarousel.querySelectorAll('.iteration-slide');
    if (slides.length > 0) track.style.height = slides[0].scrollHeight + 'px';
  }

  //reveal default tab panel sections
  const defaultPanel = document.getElementById('panel-indiv');
  if (defaultPanel) {
    defaultPanel.querySelectorAll('.section').forEach(el => el.classList.add('visible'));
  }
});

function openDoc(url) {
    document.getElementById('doc-iframe').src = url;
    document.getElementById('doc-modal').classList.add('active');
}

function closeDoc() {
    document.getElementById('doc-modal').classList.remove('active');
    document.getElementById('doc-iframe').src = '';
}