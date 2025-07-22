// =====================
// Contact Form Submit Handler
// =====================
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const form = this;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            alert('Thanks for messaging VinTass. Connecting soon.');
            form.reset();
          } else {
            alert('There was a problem sending your message. Please try again.');
          }
        })
        .catch(() => {
          alert('There was a problem sending your message. Please try again.');
        });
    });
  }
});

// =====================
// Utility Functions
// =====================
function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return document.querySelectorAll(selector);
}

// =====================
// Modal Functionality
// =====================
let modal, modalImg, closeModalBtn;
function openModal(e) {
  modal.classList.add('active');
  modalImg.src = e.target.src;
  document.body.style.overflow = 'hidden';
}
function closeModalFunc() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}
function initModal() {
  modal = $('#imageModal');
  modalImg = $('#modalImage');
  closeModalBtn = $('.modal-close');
  // Add click events to all gallery images (initial)
  $all('.gallery-item img').forEach((img) => {
    img.addEventListener('click', openModal);
  });
  closeModalBtn.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });
}

// =====================
// Logo Upload
// =====================
function initLogoUpload() {
  const logoUpload = $('#logoUpload');
  const logoPreview = $('#logoPreview');
  const logoPlaceholder = $('.logo-placeholder');
  let allowed = sessionStorage.getItem('logoAllowed') === 'yes';

  if (logoUpload) {
    logoUpload.addEventListener('click', function (e) {
      if (!allowed) {
        e.preventDefault();
        e.stopPropagation();
        const code = prompt('Enter your secret code to change the logo:');
        if (code === 'YOUR_SECRET_CODE') {
          allowed = true;
          sessionStorage.setItem('logoAllowed', 'yes');
          logoUpload.click();
        } else {
          alert('You are not authorized to change the logo.');
        }
      }
    });

    logoUpload.addEventListener('change', function (e) {
      if (!allowed) return;
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          logoPreview.src = e.target.result;
          logoPreview.style.display = 'block';
          logoPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// =====================
// Gallery Tabs
// =====================
function initGalleryTabs() {
  const galleryTabs = $all('.gallery-tab');
  const galleryContents = $all('.gallery-content');
  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      galleryContents.forEach((content) => (content.style.display = 'none'));
      const targetId = tab.getAttribute('data-tab');
      $('#' + targetId).style.display = 'block';
    });
  });
}

// =====================
// Photo Upload & Gallery
// =====================
function initPhotoUpload() {
  const photoUpload = $('#photoUpload');
  const photosGrid =
    $('#photos .gallery-grid') ||
    document.querySelector('[data-tab="photos"] .gallery-grid');
  if (!photoUpload || !photosGrid) return;

  photoUpload.addEventListener('change', function (e) {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          galleryItem.innerHTML = `
              <img src="${e.target.result}" alt="Uploaded Photo">
              <div class="gallery-item-content">
                  <h4>User Upload</h4>
                  <p>${file.name}</p>
              </div>`;
          photosGrid.appendChild(galleryItem);
          setTimeout(() => {
            galleryItem.classList.add('fade-in-up');
          }, 100);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  navLinks.forEach(link => link.classList.toggle("active"));
});


// =====================
// Coming Soon Countdown & Launch Message
// =====================
const launchDate = new Date('2025-12-31T17:05:00'); //<< Set upcoming Date

function animateNumber(element, to) {
  let from = Number(element.textContent) || 0;
  let start = null;
  function animate(ts) {
    if (!start) start = ts;
    let progress = Math.min((ts - start) / 400, 1);
    let value = Math.floor(from + (to - from) * progress);
    element.textContent = value;
    if (progress < 1) requestAnimationFrame(animate);
    else element.textContent = to;
  }
  requestAnimationFrame(animate);
}

function updateCountdown() {
  const now = new Date();
  let diff = launchDate - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  animateNumber($('#days'), days);
  animateNumber($('#hours'), hours);
  animateNumber($('#minutes'), minutes);
  animateNumber($('#seconds'), seconds);

  if (diff === 0) {
    showLaunchMessage();
    clearInterval(window.countdownInterval);
    $('.coming-soon-timer').style.display = 'none';
  }
}

function showLaunchMessage() {
  const projectType = 'website';
  const websiteLink = 'https://yourwebsite.com';
  const appLink = 'https://play.google.com/store/apps/details?id=yourapp';

  let html = '';
  if (projectType === 'website') {
    html = `<div class="live-message">
              <h2 style="color:var(--accent-blue);margin-bottom:1rem;">🎉 Website is Live!</h2>
              <a href="${websiteLink}" target="_blank" class="cta-button">Visit Website</a>
            </div>`;
  } else if (projectType === 'app') {
    html = `<div class="live-message">
              <h2 style="color:var(--accent-violet);margin-bottom:1rem;">🎉 App is Live!</h2>
              <a href="${appLink}" target="_blank" class="cta-button">Download App</a>
            </div>`;
  }
  $('#launch-message').innerHTML = html;
}

// =====================
// DOM Ready Initialization
// =====================
document.addEventListener('DOMContentLoaded', function () {
  initPhotoUpload();
  initModal();
  initLogoUpload();
  initGalleryTabs();

  const searchBar = $('.search-bar');
  const searchIcon = $('.search-icon');
  const searchInput = $('.search-input');

  searchIcon.addEventListener('click', function (e) {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
      searchInput.focus();
    }
    e.stopPropagation();
  });

  document.addEventListener('click', function (e) {
    if (!searchBar.contains(e.target)) {
      searchBar.classList.remove('active');
    }
  });

  if ($('#days')) {
    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
  }
});
