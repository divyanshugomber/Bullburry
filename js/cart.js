/* =========================================
   BULLBURRY – cart.js
   Cart logic + localStorage (INR currency support)
   ========================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'bullburry_cart';
  const FREE_SHIPPING_THRESHOLD = 2999;

  let _cart = []; // Array of { productId, name, price, color, size, image, quantity }

  function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
  }

  // ── Persistence ────────────────────────────────────────────────────
  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cart = raw ? JSON.parse(raw) : [];
    } catch (e) {
      _cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_cart));
    } catch (e) {
      console.warn('Bullburry: could not save cart to localStorage.', e);
    }
  }

  // ── Core operations ────────────────────────────────────────────────
  function addToCart(product, color, size, qty) {
    qty = Math.max(1, parseInt(qty) || 1);
    const existing = _cart.find(
      (i) => i.productId === product.id && i.color === color && i.size === size
    );
    if (existing) {
      existing.quantity += qty;
    } else {
      _cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        color: color || (product.colors && product.colors[0] ? product.colors[0].name : 'Default'),
        size: size || (product.sizes ? product.sizes[0] : 'Standard'),
        image: product.images[0],
        quantity: qty
      });
    }
    saveCart();
    updateCartUI();
    if (window.UI && window.UI.showToast) {
      window.UI.showToast(`Added ${product.name} (${size}) to bag ✓`, 'success');
    }
    // Auto open cart drawer
    openCartDrawer();
  }

  function removeFromCart(productId, color, size) {
    _cart = _cart.filter(
      (i) => !(i.productId === productId && i.color === color && i.size === size)
    );
    saveCart();
    updateCartUI();
  }

  function updateQty(productId, color, size, delta) {
    const item = _cart.find(
      (i) => i.productId === productId && i.color === color && i.size === size
    );
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart();
    updateCartUI();
  }

  function getCartCount() {
    return _cart.reduce((sum, i) => sum + i.quantity, 0);
  }

  function getSubtotal() {
    return _cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  function clearCart() {
    _cart = [];
    saveCart();
    updateCartUI();
  }

  // ── UI sync ────────────────────────────────────────────────────────
  function updateCartUI() {
    const count = getCartCount();
    document.querySelectorAll('.nav-cart-count, #cart-count').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('visible', count > 0);
    });

    const drawerBody = document.getElementById('cart-drawer-items') || document.querySelector('.cart-drawer-body');
    if (drawerBody) {
      renderCartDrawer(drawerBody);
    }

    const cartItems = document.getElementById('cart-page-items');
    if (cartItems) {
      renderCartPage(cartItems);
      updateOrderSummary();
    }

    updateShippingProgress();
  }

  function updateShippingProgress() {
    const fill = document.getElementById('shipping-progress-fill') || document.querySelector('.shipping-progress-fill');
    const label = document.getElementById('shipping-progress-label') || document.querySelector('.shipping-progress-label');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');

    const subtotal = getSubtotal();

    if (subtotalEl) {
      subtotalEl.textContent = formatCurrency(subtotal);
    }

    if (!fill || !label) return;

    const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    fill.style.width = pct + '%';

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      label.textContent = '🎉 You qualify for FREE Express Shipping!';
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      label.textContent = `Add ${formatCurrency(remaining)} more for Free Express Shipping`;
    }
  }

  function updateOrderSummary() {
    const subtotalEl = document.getElementById('cart-page-subtotal') || document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('cart-page-shipping') || document.getElementById('summary-shipping');
    const totalEl = document.getElementById('cart-page-total') || document.getElementById('summary-total');

    const subtotal = getSubtotal();
    const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250);
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? (subtotal > 0 ? 'FREE' : '₹0') : formatCurrency(shipping);
    if (totalEl) totalEl.textContent = formatCurrency(total);
  }

  // ── Render: Cart Drawer ────────────────────────────────────────────
  function renderCartDrawer(containerEl) {
    if (!containerEl) return;
    if (_cart.length === 0) {
      containerEl.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3; margin-bottom:12px;">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h3 class="text-display" style="font-size: var(--text-lg); margin-bottom: 6px;">Your Bag Is Empty</h3>
          <p class="text-ash" style="font-size: var(--text-sm); margin-bottom: 16px;">Built bold. Pick your statement pieces.</p>
          <a href="shop.html" class="btn btn-primary btn-sm">Explore Shop</a>
        </div>`;
      return;
    }

    const html = _cart.map((item) => `
      <div class="cart-item" data-product-id="${item.productId}" data-color="${escHtml(item.color)}" data-size="${escHtml(item.size)}">
        <img class="cart-item-img" src="${escHtml(item.image)}" alt="${escHtml(item.name)}" loading="lazy">
        <div class="cart-item-info">
          <span class="cart-item-name">${escHtml(item.name)}</span>
          <span class="cart-item-meta">${escHtml(item.color)} · Size ${escHtml(item.size)}</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
          <div class="cart-qty-control">
            <button class="qty-btn" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" data-delta="1" aria-label="Increase quantity">+</button>
            <button class="cart-remove-btn" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>`).join('');

    containerEl.innerHTML = html;

    containerEl.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.cart-item');
        updateQty(card.dataset.productId, card.dataset.color, card.dataset.size, parseInt(btn.dataset.delta));
      });
    });

    containerEl.querySelectorAll('.cart-remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.cart-item');
        removeFromCart(card.dataset.productId, card.dataset.color, card.dataset.size);
      });
    });
  }

  // ── Render: Cart Page ──────────────────────────────────────────────
  function renderCartPage(containerEl) {
    if (!containerEl) return;
    if (_cart.length === 0) {
      containerEl.innerHTML = `
        <div class="cart-empty-state" style="padding: var(--space-16) 0;">
          <h3 class="text-display" style="font-size: var(--text-2xl); margin-bottom: 8px;">Your Bag Is Empty</h3>
          <p class="text-ash" style="margin-bottom: var(--space-6);">Explore our latest drops and premium streetwear essentials.</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Shop Collection</a>
        </div>`;
      return;
    }

    const html = _cart.map((item) => `
      <div class="cart-page-item" data-product-id="${item.productId}" data-color="${escHtml(item.color)}" data-size="${escHtml(item.size)}">
        <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}" loading="lazy">
        <div class="cart-item-info">
          <span class="cart-item-name">${escHtml(item.name)}</span>
          <span class="cart-item-meta">${escHtml(item.color)} · Size ${escHtml(item.size)}</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
          <div class="cart-qty-control">
            <button class="qty-btn" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" data-delta="1" aria-label="Increase quantity">+</button>
            <button class="cart-remove-btn" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>`).join('');

    containerEl.innerHTML = html;

    containerEl.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.cart-page-item');
        updateQty(card.dataset.productId, card.dataset.color, card.dataset.size, parseInt(btn.dataset.delta));
      });
    });

    containerEl.querySelectorAll('.cart-remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.cart-page-item');
        removeFromCart(card.dataset.productId, card.dataset.color, card.dataset.size);
      });
    });
  }

  // ── Drawer operations ──────────────────────────────────────────────
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer');
    const overlay = document.getElementById('cart-overlay') || document.querySelector('.cart-overlay');
    if (!drawer) return;
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer(document.getElementById('cart-drawer-items') || drawer.querySelector('.cart-drawer-body'));
    updateShippingProgress();
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer');
    const overlay = document.getElementById('cart-overlay') || document.querySelector('.cart-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer');
    const overlay = document.getElementById('cart-overlay') || document.querySelector('.cart-overlay');

    document.querySelectorAll('[data-open-cart], #nav-cart-btn, .nav-icon-btn[aria-label="Open cart"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Only open drawer if drawer elements exist
        if (drawer) {
          e.preventDefault();
          openCartDrawer();
        }
      });
    });

    const closeBtn = document.getElementById('cart-drawer-close') || (drawer ? drawer.querySelector('.modal-close, [data-close-cart]') : null);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    });
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  loadCart();

  window.Cart = {
    addToCart,
    removeFromCart,
    updateQty,
    getCartCount,
    getSubtotal,
    clearCart,
    loadCart,
    saveCart,
    updateCartUI,
    renderCartDrawer,
    renderCartPage,
    initCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    getItems: () => [..._cart]
  };

})();
