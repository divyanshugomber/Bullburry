/* =========================================
   BULLBURRY – main.js
   Config, init, shared utilities
   ========================================= */

(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────
  const CONFIG = {
    brand: 'BULLBURRY',
    siteName: 'BULLBURRY',
    currency: '₹',
    currencyCode: 'INR',
    freeShippingThreshold: 2999,
    dropDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  function formatPrice(amount) {
    return CONFIG.currency + Number(amount || 0).toLocaleString('en-IN');
  }

  // ── Theme ───────────────────────────────────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('bullburry_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (!document.documentElement.hasAttribute('data-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function wireThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bullburry_theme', next);
      if (window.UI && window.UI.showToast) {
        window.UI.showToast(next === 'dark' ? '🌙 Dark mode' : '☀️ Light mode', 'info', 2000);
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('bullburry_theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  // ── Nav / Footer injection ──────────────────────────────────────────
  function injectComponent(placeholderId, url, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then((res) => res.text())
      .then((html) => {
        el.outerHTML = html;
        if (callback) callback();
      })
      .catch(() => {
        if (callback) callback();
      });
  }

  function initNav() {
    injectComponent('header-placeholder', 'components/nav.html', () => {
      setActiveNavLink();
      wireThemeToggle();
      if (window.Cart) {
        window.Cart.initCartDrawer();
        window.Cart.updateCartUI();
      }
      if (window.UI && window.UI.initNavScroll) {
        window.UI.initNavScroll();
      }
    });
  }

  function initFooter() {
    injectComponent('footer-placeholder', 'components/footer.html', () => {
      const form = document.getElementById('footer-newsletter');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('footer-email')?.value?.trim();
          if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            localStorage.setItem('bullburry_newsletter', email);
            window.UI && window.UI.showToast('Subscribed to drop alert list ✓', 'success');
            form.reset();
          } else {
            window.UI && window.UI.showToast('Please enter a valid email', 'error');
          }
        });
      }
    });
  }

  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ── Product page init ───────────────────────────────────────────────
  function initProductPage() {
    if (!document.querySelector('.product-page')) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'bb-001';
    if (!window.PRODUCTS) return;

    const product = window.PRODUCTS.find((p) => p.id === id) || window.PRODUCTS[0];
    if (!product) return;

    // Set page title
    document.title = `${product.name} — BULLBURRY`;

    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = product.name;

    // Gallery
    const mainImg = document.getElementById('gallery-main-img');
    if (mainImg) {
      mainImg.src = product.images[0];
      mainImg.alt = product.name;
    }

    const thumbsContainer = document.querySelector('.gallery-thumbs');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = product.images.map((src, i) => `
        <button class="gallery-thumb ${i === 0 ? 'active' : ''}" type="button" aria-label="View image ${i + 1}">
          <img src="${src}" alt="${product.name} thumbnail ${i + 1}" loading="lazy">
        </button>`).join('');

      thumbsContainer.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          if (mainImg) mainImg.src = product.images[idx];
        });
      });
    }

    // Details & Price
    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = product.name;

    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = formatPrice(product.price);

    const tagEl = document.getElementById('product-tag');
    if (tagEl) {
      if (product.tag) {
        tagEl.textContent = product.tag;
        tagEl.style.display = '';
      } else {
        tagEl.style.display = 'none';
      }
    }

    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = product.description;

    const detailsEl = document.getElementById('product-details');
    if (detailsEl) detailsEl.textContent = product.details;

    const careEl = document.getElementById('product-care');
    if (careEl) careEl.textContent = product.care;

    // Colors
    let selectedColor = product.colors[0]?.name || '';
    const colorLabel = document.getElementById('selected-color-name');
    if (colorLabel) colorLabel.textContent = selectedColor;

    const swatchRow = document.querySelector('.swatch-row');
    if (swatchRow) {
      swatchRow.innerHTML = product.colors.map((c, i) => `
        <button class="color-swatch-lg ${i === 0 ? 'active' : ''}" style="background:${c.hex}"
          data-color="${c.name}" title="${c.name}" aria-label="Color: ${c.name}"></button>`).join('');

      swatchRow.querySelectorAll('.color-swatch-lg').forEach((sw) => {
        sw.addEventListener('click', () => {
          swatchRow.querySelectorAll('.color-swatch-lg').forEach((s) => s.classList.remove('active'));
          sw.classList.add('active');
          selectedColor = sw.dataset.color;
          if (colorLabel) colorLabel.textContent = selectedColor;
        });
      });
    }

    // Sizes
    let selectedSize = product.sizes.find(s => !product.unavailableSizes.includes(s)) || product.sizes[0] || 'M';
    const sizeRow = document.querySelector('.size-row');
    if (sizeRow) {
      sizeRow.innerHTML = product.sizes.map((s) => `
        <button class="size-btn ${s === selectedSize ? 'active' : ''} ${product.unavailableSizes.includes(s) ? 'unavailable' : ''}"
          data-size="${s}" ${product.unavailableSizes.includes(s) ? 'disabled' : ''}>${s}</button>`).join('');

      sizeRow.querySelectorAll('.size-btn:not(.unavailable)').forEach((btn) => {
        btn.addEventListener('click', () => {
          sizeRow.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          selectedSize = btn.dataset.size;
        });
      });
    }

    // Add To Cart button
    const atcBtn = document.getElementById('atc-btn');
    if (atcBtn) {
      atcBtn.addEventListener('click', () => {
        if (!selectedSize) {
          window.UI && window.UI.showToast('Please select a size', 'error');
          return;
        }
        if (window.Cart) {
          window.Cart.addToCart(product, selectedColor, selectedSize, 1);
        }
      });
    }

    // Wishlist
    const wishBtn = document.getElementById('product-wishlist-btn');
    if (wishBtn) {
      if (window.UI && window.UI.isWishlisted(product.id)) {
        wishBtn.classList.add('active');
      }
      wishBtn.addEventListener('click', () => {
        const active = wishBtn.classList.toggle('active');
        if (window.UI) window.UI.toggleWishlist(product.id, null);
      });
    }

    // Related products (complete the fit)
    const ctfGrid = document.getElementById('complete-fit-grid');
    if (ctfGrid && window.PRODUCTS) {
      const related = window.PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
      ctfGrid.innerHTML = related.map((p) => `
        <article class="product-card" data-id="${p.id}">
          <div class="product-card-image">
            ${p.tag ? `<span class="product-card-tag">${p.tag}</span>` : ''}
            <img class="img-primary" src="${p.images[0]}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-card-info">
            <a href="product.html?id=${p.id}" class="product-card-name">${p.name}</a>
            <span class="product-card-category">${p.category}</span>
            <span class="product-card-price">${formatPrice(p.price)}</span>
          </div>
        </article>`).join('');

      ctfGrid.querySelectorAll('.product-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          window.location.href = 'product.html?id=' + card.dataset.id;
        });
      });
    }
  }

  // ── Homepage product grid ───────────────────────────────────────────
  function initHomepageProducts() {
    const grid = document.getElementById('new-arrivals-grid');
    if (!grid || !window.PRODUCTS) return;

    const featured = window.PRODUCTS.filter((p) => p.featured).slice(0, 6);

    grid.innerHTML = featured.map((p, i) => `
      <article class="product-card reveal-on-scroll" data-id="${p.id}" style="animation-delay: ${i * 60}ms">
        <div class="product-card-image">
          ${p.tag ? `<span class="product-card-tag">${p.tag}</span>` : ''}
          <img class="img-primary" src="${p.images[0]}" alt="${p.name}" loading="lazy">
          ${p.images[1] ? `<img class="img-secondary" src="${p.images[1]}" alt="${p.name} alternate view" loading="lazy">` : ''}
          <div class="product-card-actions">
            <button class="card-action-btn wishlist-btn" data-id="${p.id}" aria-label="Wishlist ${p.name}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button class="card-action-btn quick-view-btn" data-id="${p.id}" aria-label="Quick view ${p.name}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="product-card-info">
          <a href="product.html?id=${p.id}" class="product-card-name">${p.name}</a>
          <span class="product-card-category">${p.category}</span>
          <div class="product-card-colors">
            ${p.colors.map((c) => `<span class="color-swatch" style="background:${c.hex}" title="${c.name}"></span>`).join('')}
          </div>
          <span class="product-card-price">${formatPrice(p.price)}</span>
        </div>
      </article>`).join('');

    // Wire wishlist
    grid.querySelectorAll('.wishlist-btn').forEach((btn) => {
      if (window.UI && window.UI.isWishlisted(btn.dataset.id)) btn.classList.add('wishlisted');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.UI) window.UI.toggleWishlist(btn.dataset.id, btn);
      });
    });

    // Wire quick view
    grid.querySelectorAll('.quick-view-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = window.PRODUCTS.find((x) => x.id === btn.dataset.id);
        if (p && window.UI) window.UI.openQuickView(p);
      });
    });

    // Link cards
    grid.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        window.location.href = 'product.html?id=' + card.dataset.id;
      });
    });
  }

  // ── Cart page init ───────────────────────────────────────────────────
  function initCartPage() {
    const cartPage = document.querySelector('.cart-page');
    if (!cartPage) return;

    if (window.Cart) {
      window.Cart.updateCartUI();
    }

    const form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('[required]').forEach((input) => {
          if (!input.value.trim()) {
            input.classList.add('error');
            valid = false;
          } else {
            input.classList.remove('error');
          }
        });

        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
          emailInput.classList.add('error');
          valid = false;
        }

        if (!valid) {
          window.UI && window.UI.showToast('Please fill in all required shipping fields', 'error');
          return;
        }

        if (window.Cart && window.Cart.getCartCount() === 0) {
          window.UI && window.UI.showToast('Your bag is empty! Add items first.', 'error');
          return;
        }

        // Show success state
        const successEl = document.querySelector('.order-success');
        const cartLayout = document.querySelector('.cart-page-layout');
        if (successEl && cartLayout) {
          cartLayout.style.display = 'none';
          successEl.style.display = 'flex';
          window.Cart && window.Cart.clearCart();
          window.UI && window.UI.showToast('Order confirmed! 🎉', 'success', 5000);
        }
      });

      form.querySelectorAll('[required]').forEach((input) => {
        input.addEventListener('input', () => input.classList.remove('error'));
      });
    }
  }

  // ── DOMContentLoaded ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // Set active theme instantly

    initNav();
    initFooter();

    if (window.UI) {
      window.UI.init({
        products: window.PRODUCTS,
        isProductPage: !!document.querySelector('.product-page'),
        countdown: CONFIG.dropDate
      });
    }

    initHomepageProducts();
    initProductPage();
    initCartPage();
  });

  // ── Expose config & format ──────────────────────────────────────────
  window.CONFIG = CONFIG;
  window.formatPrice = formatPrice;

})();
