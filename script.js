//dict for search
  const synonyms = {
    'Blender': [
      '3d',
      'model',
      'animation',
      'texture'
    ],

    'unity (c#)': [
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
      'wire',
      'wiring',
      'hardware'
    ]
  };

//search logic
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const cards = document.querySelectorAll('.project-card');

function getMatchingTags(query) {
  query = query.toLowerCase().trim();
  if (!query) return new Set();

  let matches = new Set();

  //direct match
  cards.forEach(card => {
    card.querySelectorAll('.tag').forEach(tag => {
      if (tag.textContent.toLowerCase().includes(query)) {
        matches.add(tag.textContent.toLowerCase());
      }
    });
  });

  //keyword match (from dict)
  Object.entries(synonyms).forEach(([mainTag, aliasList]) => {
    const allTerms = [mainTag, ...aliasList];

    if (allTerms.some(term => query.includes(term.toLowerCase()))) {
      matches.add(mainTag.toLowerCase());
    }
  });

  return matches;
}

function runSearch(query) {
  const matchingTags = getMatchingTags(query);

  searchClear.classList.toggle('visible', query.length > 0);

  cards.forEach(card => {
    if (!query) {
      card.classList.remove('hidden');
      card.querySelectorAll('.tag').forEach(t => t.classList.remove('highlighted'));
      return;
    }

    let cardMatches = false;
    card.querySelectorAll('.tag').forEach(tag => {
      const tagText = tag.textContent.toLowerCase();
      //highlight the matching ones
      const isMatch = matchingTags.has(tagText);
      tag.classList.toggle('highlighted', isMatch);
      if (isMatch) cardMatches = true;
    });

    card.classList.toggle('hidden', !cardMatches);
  });
}

searchInput.addEventListener('input', () => runSearch(searchInput.value));

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  runSearch('');
  searchInput.focus();
});

//scroll (slide into view)
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => revealObserver.observe(card));

//video thumbnails
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;
  card.addEventListener('mouseenter', () => video.play());
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

//nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      a.classList.add('active');
    });
  });
}, { passive: true });
