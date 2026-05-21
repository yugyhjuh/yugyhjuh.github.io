// dict for search
const synonyms = {
  'Blender': [
    '3d',
    'model',
    'animation',
    'texture'
  ],

  'Unity (C#)': [
    'game',
    'gaming'
  ],

  'iClone8': [
    'animation'
  ],

  'CC4': [
    '3d',
    'model'
  ],

  'Prototyping': [
    'prototype'
  ],

  'Photoshop': [
    'texture'
  ],

  'Arduino': [
    'electronics',
    'wiring',
    'hardware'
  ],

  'Adobe XD': [
    'ui',
    'ux',
    'ui/ux',
    'hi-fidelity',
    'low-fidelity',
    'wireframe',
    'hi-fi',
    'lo-fi',
    'user'
  ],

  'Krita': [
    '2d',
    'concept art',
    'art',
    'drawing'
  ]
};

const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const cards = document.querySelectorAll('.project-card');

function normalizeWords(text) {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/);
}

function getMatchingTags(query) {
  const words = normalizeWords(query);

  if (!query.trim()) return new Set();

  const matches = new Set();

  //direct tag matching
  cards.forEach(card => {
    card.querySelectorAll('.tag').forEach(tag => {
      const tagText = tag.textContent.toLowerCase();

      words.forEach(word => {
        if (tagText.includes(word)) {
          matches.add(tagText);
        }
      });
    });
  });

  //synonym matching
  Object.entries(synonyms).forEach(([mainTag, aliasList]) => {
    const allTerms = [mainTag.toLowerCase(), ...aliasList.map(a => a.toLowerCase())];

    words.forEach(word => {
      if (allTerms.some(term => term.includes(word))) {
        matches.add(mainTag.toLowerCase());
      }
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

      card.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('highlighted');
      });

      return;
    }

    let cardMatches = false;

    card.querySelectorAll('.tag').forEach(tag => {
      const tagText = tag.textContent.toLowerCase();

      const isMatch = matchingTags.has(tagText);

      tag.classList.toggle('highlighted', isMatch);

      if (isMatch) {
        cardMatches = true;
      }
    });

    card.classList.toggle('hidden', !cardMatches);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    runSearch(searchInput.value);
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    runSearch('');
    searchInput.focus();
  });
}

//anim of revealing on scroll
const revealTargets = document.querySelectorAll('.project-card, .section');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, {
  threshold: 0.1
});
revealTargets.forEach(target => {
  revealObserver.observe(target);
});

//video play on hover
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('video');

  if (!video) return;

  card.addEventListener('mouseenter', () => {
    video.play();
  });

  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});

//nav active state on click and scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

//click state
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

//scroll state
window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;

    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');

    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

//box modals popup
function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

//close on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

//close on ESC key
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

//exploration carousel display sideways
function scrollCarousel(direction) {
  const carousel = document.getElementById('personalCarousel');

  if (!carousel) return;

  const scrollAmount = carousel.clientWidth * 0.8;

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

let currentSlide = 0;

function scrollIteration(direction) {
  const carousel = document.getElementById('iterationCarousel');
  const track = carousel.parentElement;
  if (!carousel) return;
  
  const slides = carousel.querySelectorAll('.iteration-slide');
  currentSlide = Math.max(0, Math.min(currentSlide + direction, slides.length - 1));
  
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  carousel.style.transition = 'transform 0.4s ease';

  //match track height to current slide height
  track.style.height = slides[currentSlide].scrollHeight + 'px';
}

//set initial height on load
window.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('iterationCarousel');
  if (!carousel) return;
  const track = carousel.parentElement;
  const slides = carousel.querySelectorAll('.iteration-slide');
  if (slides.length > 0) {
    track.style.height = slides[0].scrollHeight + 'px';
  }
});

//modal popup on page load
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-info");

  if (modal) {
    modal.classList.add("active");
  }
});

function openModal(id) {
  document.getElementById(id)?.classList.add("active");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("active");
}

//mini carousel for site model section
function scrollSiteModel(direction) {
  const carousel = document.getElementById('siteModelCarousel');
  if (!carousel) return;
  const cardWidth = carousel.querySelector('.grid-image').offsetWidth + 12;
  carousel.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}

function switchTab(tab, btn) {
    //swap active button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    //swap active panel
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab).classList.add('active');

    //so they dont get stuck invis
    document.querySelectorAll('#panel-' + tab + ' .section').forEach(el => {
        el.classList.add('visible');
    });
}

//reveal default panel sections on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#panel-indiv .section').forEach(el => {
        el.classList.add('visible');
    });
});

const trigger = document.querySelector('.hover-trigger');
const tooltip = document.getElementById('custom-tooltip');

//tooltip follows cursor on hover
trigger.addEventListener('mousemove', (e) => {
  tooltip.style.display = 'block';
  // e.pageX and e.pageY get the exact cursor coordinates
  tooltip.style.left = (e.clientX + 14) + 'px';
  tooltip.style.top = (e.clientY + 14) + 'px';
});

//hide
trigger.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
});
