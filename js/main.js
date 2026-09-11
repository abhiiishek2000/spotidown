/**
 * SpotiDown Website Scripts
 * Mobile navigation drawer, FAQ accordions, download triggers, and Buy Me a Coffee routing
 * Includes Google Analytics 4 (GA4) Event Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation Toggle
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggleBtn.textContent = isOpen ? '✕' : '☰';
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    });

    // Close if resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        closeDrawer();
      }
    });
  }

  // 2. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Buy Me a Coffee Custom Amount buttons + GA4 Event Tracking
  const coffeeTiers = document.querySelectorAll('.coffee-tier-btn');
  coffeeTiers.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.getAttribute('data-amount');
      const baseCoffeeUrl = 'https://buymeacoffee.com/spotidown';
      const targetUrl = amount ? `${baseCoffeeUrl}?amount=${amount}` : baseCoffeeUrl;

      // Track GA4 Donation Click
      if (typeof gtag === 'function') {
        gtag('event', 'donate_click', {
          event_category: 'Donation',
          event_label: `Buy Me a Coffee $${amount || '3'}`,
          value: amount ? parseFloat(amount) : 3
        });
      }

      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // 4. Download Trigger & Feedback Toast + GA4 Event Tracking
  const downloadBtns = document.querySelectorAll('.btn-download-trigger');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Track GA4 APK Download Event
      if (typeof gtag === 'function') {
        gtag('event', 'download_apk', {
          event_category: 'Engagement',
          event_label: 'SpotiDown v1.3.4 APK',
          file_name: 'spotidown.apk'
        });
      }

      setTimeout(() => {
        showDownloadToast();
      }, 700);
    });
  });

  // 5. Screenshot Lightbox Modal Logic
  initScreenshotLightbox();
});

const screenshotsData = [
  {
    img: '/images/screenshot-home-preview.jpg',
    tag: '1. Paste & Resolve',
    title: 'Instant Song Resolver',
    desc: 'Paste any Spotify song URL and immediately preview track artwork, title, artist, and 1-tap download in 320kbps MP3.'
  },
  {
    img: '/images/screenshot-playlist-download.jpg',
    tag: '2. Batch Download',
    title: 'Full Playlist Downloader',
    desc: 'Save entire 50+ song playlists or albums in a single tap with sequential background downloading and zero throttling.'
  },
  {
    img: '/images/screenshot-music-player.jpg',
    tag: '3. Offline Player',
    title: 'Built-In Media Player',
    desc: 'Listen to all your saved tracks offline with HD album art, scrub controls, background audio playback, and lock-screen controls.'
  },
  {
    img: '/images/screenshot-download-history.jpg',
    tag: '4. History & Library',
    title: 'Offline Music Library',
    desc: 'Search, filter by artist/recent, and manage all your saved tracks directly in your device storage (/storage/emulated/0/Music/).'
  },
  {
    img: '/images/screenshot-queue-inprogress.jpg',
    tag: '5. Live Queue',
    title: 'Background Progress Queue',
    desc: 'Monitor live downloading progress with smart queueing that prevents phone lag, preserves battery, and prevents corrupt files.'
  }
];

let currentScreenshotIndex = 0;

function initScreenshotLightbox() {
  const modal = document.getElementById('screenshot-lightbox');
  if (!modal) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  function openLightbox(index) {
    currentScreenshotIndex = (index + screenshotsData.length) % screenshotsData.length;
    const item = screenshotsData[currentScreenshotIndex];
    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxTag.textContent = item.tag;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentScreenshotIndex + 1} / ${screenshotsData.length}`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Click on cards
  const cards = document.querySelectorAll('.screenshot-card');
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Click on hero phone
  const heroPhone = document.querySelector('.hero-phone-container');
  if (heroPhone) {
    heroPhone.style.cursor = 'pointer';
    heroPhone.addEventListener('click', () => {
      openLightbox(0);
    });
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentScreenshotIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentScreenshotIndex + 1);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentScreenshotIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentScreenshotIndex + 1);
  });
}

function closeDrawer() {
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  if (mobileDrawer) {
    mobileDrawer.classList.remove('open');
  }
  if (menuToggleBtn) {
    menuToggleBtn.textContent = '☰';
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }
}

function showDownloadToast() {
  if (document.getElementById('download-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'download-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: 360px;
    margin: 0 auto;
    background: #14281a;
    border: 1.5px solid #eeda2b;
    border-radius: 16px;
    padding: 12px 16px;
    color: #ffffff;
    box-shadow: 0 12px 30px rgba(0,0,0,0.7), 0 0 20px rgba(238, 218, 43, 0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Inter', sans-serif;
  `;

  toast.innerHTML = `
    <span style="font-size: 1.4rem; flex-shrink: 0;">📥</span>
    <div style="flex: 1; min-width: 0;">
      <div style="font-weight: 700; font-size: 0.9rem; color: #eeda2b;">Download Started!</div>
      <div style="font-size: 0.78rem; color: #a3b8aa;">Need help? <a href="/install" style="text-decoration: underline; color: #ffffff; font-weight: 600;">View Install Guide →</a></div>
    </div>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #a3b8aa; font-size: 1.3rem; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 8000);
}
