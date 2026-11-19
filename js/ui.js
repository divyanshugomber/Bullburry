/* =========================================
   BULLBURRY – ui.js
   Cursor, marquee, loader, page transitions, toast, filters, gallery, accordion, modals
   ========================================= */

(function () {
  'use strict';

  // ── Custom Cursor ──────────────────────────────────────────────────
  function initCustomCursor() {
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
      return;
    }

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId;

    const INTERACTIVES = 'a[href], button, .product-card, [data-cursor-hover], select, label';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(INTERACTIVES)) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(INTERACTIVES)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    function animateCursor() {
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';

      // Ring follows with lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      rafId = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '';
      ring.style.opacity = '';
    });
  }

  // ── Loader ─────────────────────────────────────────────────────────
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    document.body.classList.add('page-loading');

    const MIN_DISPLAY = 1800; // ms
    const start = Date.now();

    window.addEventListener('load', () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DISPLAY - elapsed);

      setTimeout(() => {
        loader.classList.add('loader-exit');
        document.body.classList.remove('page-loading');
        setTimeout(() => {
          loader.classList.add('loader-hidden');
          initHeroReveal();
        }, 1000);
      }, delay);
    });
  }

  // ── Hero Reveal ────────────────────────────────────────────────────
  function initHeroReveal() {
    const tagline = document.querySelector('.hero-tagline');
    const letters = document.querySelectorAll('.hero-headline .letter');
    const ctaEl = document.querySelector('.hero-cta');

    if (tagline) {
      tagline.style.transition = 'opacity 600ms ease, transform 600ms ease';
      tagline.style.opacity = '1';
      tagline.style.transform = 'translateY(0)';
    }

    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add('revealed');
      }, 100 + i * 40);
    });

    if (ctaEl) {
      setTimeout(() => {
        ctaEl.style.transition = 'opacity 600ms ease, transform 600ms ease';
        ctaEl.style.opacity = '1';
        ctaEl.style.transform = 'translateY(0)';
      }, 600);
    }
  }

  // ── Marquee ────────────────────────────────────────────────────────
  function initMarquee() {
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach((track) => {
      // Clone content for seamless loop
      const clone = track.cloneNode(true);
      track.parentElement.appendChild(clone);

      // Speed modulation on scroll
      let lastScrollY = window.scrollY;
      let velocity = 0;
      let currentSpeed = 20;

      window.addEventListener('scroll', () => {
        velocity = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        const speed = Math.max(5, 20 - Math.abs(velocity) * 0.5);
        track.style.animationDuration = speed + 's';
        clone.style.animationDuration = speed + 's';
      }, { passive: true });
    });
  }

  // ── Lookbook Scroll (drag) ─────────────────────────────────────────
  function initLookbookScroll() {
    const scrollers = document.querySelectorAll('.lookbook-scroll');
    scrollers.forEach((el) => {
      let isDown = false;
      let startX, scrollLeft;

      el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      });

      el.addEventListener('mouseleave', () => {
        isDown = false;
        el.style.cursor = '';
      });

      el.addEventListener('mouseup', () => {
        isDown = false;
        el.style.cursor = '';
      });

      el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.5;
        el.scrollLeft = scrollLeft - walk;
      });

      // Arrow nav buttons if present
      const prevBtn = el.previousElementSibling;
      const nextBtn = el.nextElementSibling;
      if (prevBtn && prevBtn.classList.contains('scroll-prev')) {
        prevBtn.addEventListener('click', () => {
          el.scrollBy({ left: -300, behavior: 'smooth' });
        });
      }
      if (nextBtn && nextBtn.classList.contains('scroll-next')) {
        nextBtn.addEventListener('click', () => {
          el.scrollBy({ left: 300, behavior: 'smooth' });
        });
      }
    });
  }

  // ── Product Filters ────────────────────────────────────────────────
  function initProductFilters(products) {
    const grid = document.getElementById('products-grid');
    if (!grid || !products) return;

    let currentCategory = 'all';
    let currentSort = 'default';
    let currentColor = 'all';
    let currentSize = 'all';

    function getFiltered() {
      let list = [...products];

      if (currentCategory !== 'all') {
        list = list.filter((p) => p.category === currentCategory);
      }
      if (currentColor !== 'all') {
        list = list.filter((p) =>
          p.colors.some((c) => c.name.toLowerCase() === currentColor.toLowerCase())
        );
      }
      if (currentSize !== 'all') {
        list = list.filter((p) => p.sizes.includes(currentSize));
      }

      switch (currentSort) {
        case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
        default: break;
      }

      return list;
    }

    function renderGrid() {
      const filtered = getFiltered();
      const countEl = document.getElementById('results-count');
      if (countEl) {
        countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
      }

      grid.innerHTML = filtered.map((p, i) => `
        <article class="product-card" data-id="${p.id}" style="animation-delay: ${i * 60}ms">
          <div class="product-card-image">
            ${p.tag ? `<span class="product-card-tag">${escHtml(p.tag)}</span>` : ''}
            <img class="img-primary" src="${escHtml(p.images[0])}" alt="${escHtml(p.name)}" loading="lazy"
              onerror="this.src='assets/images/placeholder.jpg'">
            ${p.images[1] ? `<img class="img-secondary" src="${escHtml(p.images[1])}" alt="${escHtml(p.name)} alt view" loading="lazy"
              onerror="this.src='assets/images/placeholder.jpg'">` : ''}
            <div class="product-card-actions">
              <button class="card-action-btn wishlist-btn" data-id="${p.id}" aria-label="Wishlist ${escHtml(p.name)}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button class="card-action-btn quick-view-btn" data-id="${p.id}" aria-label="Quick view ${escHtml(p.name)}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="product-card-info">
            <a href="product.html?id=${p.id}" class="product-card-name">${escHtml(p.name)}</a>
            <span class="product-card-category">${escHtml(p.category)}</span>
            <div class="product-card-colors">
              ${p.colors.map((c) => `<span class="color-swatch" style="background:${escHtml(c.hex)}" title="${escHtml(c.name)}"></span>`).join('')}
            </div>
            <span class="product-card-price">₹${Number(p.price).toLocaleString('en-IN')}</span>
          </div>
        </article>`).join('');

      // Wire wishlist
      grid.querySelectorAll('.wishlist-btn').forEach((btn) => {
        const id = btn.dataset.id;
        if (window.UI && window.UI.isWishlisted(id)) btn.classList.add('wishlisted');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.UI) window.UI.toggleWishlist(id, btn);
        });
      });

      // Wire quick view
      grid.querySelectorAll('.quick-view-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const p = products.find((x) => x.id === btn.dataset.id);
          if (p && window.UI) window.UI.openQuickView(p);
        });
      });

      // Link cards
      grid.querySelectorAll('.product-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          const id = card.dataset.id;
          window.location.href = 'product.html?id=' + id;
        });
      });
    }

    // Category chips
    document.querySelectorAll('.chip[data-category]').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-category]').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.dataset.category;
        renderGrid();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderGrid();
      });
    }

    // Color filter
    const colorSelect = document.getElementById('color-filter');
    if (colorSelect) {
      colorSelect.addEventListener('change', () => {
        currentColor = colorSelect.value;
        renderGrid();
      });
    }

    // Size filter
    const sizeSelect = document.getElementById('size-filter');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', () => {
        currentSize = sizeSelect.value;
        renderGrid();
      });
    }

    renderGrid();
  }

  // ── Product Gallery ────────────────────────────────────────────────
  function initProductGallery() {
    const mainImg = document.querySelector('.gallery-main img');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        const src = thumb.querySelector('img').src;
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 200);
      });
    });

    if (thumbs[0]) thumbs[0].classList.add('active');
  }

  // ── Accordion ──────────────────────────────────────────────────────
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        // Close all
        document.querySelectorAll('.accordion-trigger').forEach((t) => {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.classList.remove('open');
        });
        // Open clicked if it was closed
        if (!expanded) {
          trigger.setAttribute('aria-expanded', 'true');
          trigger.nextElementSibling.classList.add('open');
        }
      });
    });
  }

  // ── Quick View Modal ────────────────────────────────────────────────
  function openQuickView(product) {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    const gallery = modal.querySelector('.modal-gallery');
    const content = modal.querySelector('.modal-content');

    if (gallery) {
      gallery.innerHTML = `<img src="${escHtml(product.images[0])}" alt="${escHtml(product.name)}" loading="lazy"
        onerror="this.src='assets/images/placeholder.jpg'">`;
    }

    if (content) {
      content.innerHTML = `
        <div>
          <span class="product-card-category">${escHtml(product.category)}</span>
          <h2 class="qv-name">${escHtml(product.name)}</h2>
        </div>
        <span class="qv-price">₹${Number(product.price).toLocaleString('en-IN')}</span>
        <p class="qv-desc">${escHtml(product.description)}</p>
        <div class="swatch-group">
          <span class="swatch-label">Color</span>
          <div class="swatch-row">
            ${product.colors.map((c, i) => `
              <button class="color-swatch-lg ${i === 0 ? 'active' : ''}" style="background:${escHtml(c.hex)}"
                data-color="${escHtml(c.name)}" title="${escHtml(c.name)}" aria-label="Color: ${escHtml(c.name)}"></button>`).join('')}
          </div>
        </div>
        <div class="size-group">
          <span class="swatch-label">Size</span>
          <div class="size-row">
            ${product.sizes.map((s, i) => `
              <button class="size-btn ${i === 0 && !product.unavailableSizes.includes(s) ? 'active' : ''} ${product.unavailableSizes.includes(s) ? 'unavailable' : ''}"
                data-size="${escHtml(s)}" ${product.unavailableSizes.includes(s) ? 'disabled' : ''}>${escHtml(s)}</button>`).join('')}
          </div>
        </div>
        <div class="atc-row">
          <button class="btn btn-primary qv-atc-btn">Add to Cart</button>
          <a href="product.html?id=${escHtml(product.id)}" class="btn btn-outline btn-sm">View Details</a>
        </div>`;

      // Wire color swatches
      let selectedColor = product.colors[0]?.name || '';
      content.querySelectorAll('.color-swatch-lg').forEach((sw) => {
        sw.addEventListener('click', () => {
          content.querySelectorAll('.color-swatch-lg').forEach((s) => s.classList.remove('active'));
          sw.classList.add('active');
          selectedColor = sw.dataset.color;
        });
      });

      // Wire size buttons
      let selectedSize = product.sizes.find((s) => !product.unavailableSizes.includes(s)) || '';
      content.querySelectorAll('.size-btn:not(.unavailable)').forEach((btn) => {
        btn.addEventListener('click', () => {
          content.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          selectedSize = btn.dataset.size;
        });
      });

      // Wire ATC
      const atcBtn = content.querySelector('.qv-atc-btn');
      if (atcBtn) {
        atcBtn.addEventListener('click', () => {
          if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
          }
          if (window.Cart) {
            window.Cart.addToCart(product, selectedColor, selectedSize, 1);
          }
          closeModal(modal);
        });
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(modal);
    });
  }

  // ── Wishlist ───────────────────────────────────────────────────────
  const WISHLIST_KEY = 'bullburry_wishlist';

  function loadWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch { return []; }
  }

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  }

  function isWishlisted(id) {
    return loadWishlist().includes(id);
  }

  function toggleWishlist(id, btn) {
    let list = loadWishlist();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
      if (btn) btn.classList.remove('wishlisted');
      showToast('Removed from wishlist', 'info');
    } else {
      list.push(id);
      if (btn) btn.classList.add('wishlisted');
      showToast('Saved to wishlist ♥', 'success');
    }
    saveWishlist(list);
  }

  function initWishlist() {
    // Apply wishlisted state to all wishlist buttons
    const list = loadWishlist();
    document.querySelectorAll('.wishlist-btn[data-id]').forEach((btn) => {
      if (list.includes(btn.dataset.id)) btn.classList.add('wishlisted');
      btn.addEventListener('click', () => toggleWishlist(btn.dataset.id, btn));
    });

    // Product page wishlist button
    const lgBtn = document.querySelector('.wishlist-btn-lg[data-id]');
    if (lgBtn) {
      if (list.includes(lgBtn.dataset.id)) lgBtn.classList.add('active');
      lgBtn.addEventListener('click', () => {
        const isActive = lgBtn.classList.contains('active');
        lgBtn.classList.toggle('active', !isActive);
        toggleWishlist(lgBtn.dataset.id, null);
      });
    }
  }

  // ── Size Guide Modal ────────────────────────────────────────────────
  function initSizeGuideModal() {
    const modal = document.getElementById('size-guide-modal');
    if (!modal) return;

    document.querySelectorAll('.size-guide-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(modal);
    });
  }

  // ── Toast Notifications ─────────────────────────────────────────────
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(145,65%,42%)" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(0,70%,50%)" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info:    `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${icons[type] || icons.info}
      <span>${escHtml(message)}</span>
      <button class="toast-close" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => { toast.classList.add('visible'); });
    });

    const dismiss = () => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 700);
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // ── Scroll Reveal ───────────────────────────────────────────────────
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal-on-scroll, .lookbook-item');
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    els.forEach((el) => obs.observe(el));
  }

  // ── Nav scroll / hide ───────────────────────────────────────────────
  function initNavScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          nav.classList.toggle('scrolled', y > 20);
          nav.classList.toggle('nav-hidden', y > lastY + 5 && y > 80);
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Hamburger / Mobile nav ─────────────────────────────────────────
  function initMobileNav() {
    const burger = document.querySelector('.nav-hamburger');
    const mobileNav = document.querySelector('.nav-mobile');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Countdown Timer ────────────────────────────────────────────────
  function initCountdown(targetDate) {
    const el = document.getElementById('countdown');
    if (!el) return;

    const days = el.querySelector('[data-countdown="days"]');
    const hours = el.querySelector('[data-countdown="hours"]');
    const mins = el.querySelector('[data-countdown="minutes"]');
    const secs = el.querySelector('[data-countdown="seconds"]');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        if (days) days.textContent = '00';
        if (hours) hours.textContent = '00';
        if (mins) mins.textContent = '00';
        if (secs) secs.textContent = '00';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (days) days.textContent = pad(d);
      if (hours) hours.textContent = pad(h);
      if (mins) mins.textContent = pad(m);
      if (secs) secs.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ── Newsletter form ────────────────────────────────────────────────
  function initNewsletterForms() {
    document.querySelectorAll('.footer-newsletter-form, .countdown-notify').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"], .notify-input');
        if (input && input.value) {
          showToast('You\'re on the list! 🎉', 'success');
          input.value = '';
        }
      });
    });
  }

  // ── Page transitions ────────────────────────────────────────────────
  function initPageTransitions() {
    const overlay = document.querySelector('.page-transition');
    if (!overlay) return;

    // Animate in
    overlay.classList.add('enter-active');
    setTimeout(() => overlay.classList.remove('enter-active'), 600);

    // Intercept internal links
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('exit-active');
        setTimeout(() => { window.location.href = href; }, 450);
      });
    });
  }

  // ── Utils ──────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Public API ─────────────────────────────────────────────────────
  window.UI = {
    init: function (opts) {
      opts = opts || {};
      initCustomCursor();
      initLoader();
      initMarquee();
      initLookbookScroll();
      initScrollReveal();
      initNavScroll();
      initMobileNav();
      initAccordion();
      initQuickView();
      initWishlist();
      initSizeGuideModal();
      initNewsletterForms();
      initPageTransitions();
      if (opts.products) initProductFilters(opts.products);
      if (opts.isProductPage) initProductGallery();
      if (opts.countdown) initCountdown(opts.countdown);
    },
    showToast,
    openQuickView,
    isWishlisted,
    toggleWishlist,
    initProductFilters,
    initCountdown,
    initProductGallery
  };

})();
