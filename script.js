/* ==========================================================================
   Blossom & Bloom - Interactive E-Commerce Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Products Catalog Dataset
  const PRODUCTS_DATA = [
    {
      id: 1,
      name: "Velvet Red Roses Bouquet",
      category: "roses",
      price: 25.00,
      oldPrice: 30.00,
      discount: "-16%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      description: "A timeless arrangement of 12 long-stemmed premium red velvet roses wrapped in luxury silk paper.",
      care: "Trim stems 1 inch at a 45-degree angle. Change water every 2 days."
    },
    {
      id: 2,
      name: "Pastel Dutch Tulips",
      category: "tulips",
      price: 18.00,
      oldPrice: 22.00,
      discount: "-18%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80",
      description: "Freshly harvested pastel tulips direct from Holland. Brightens any living room or office desk.",
      care: "Keep in cool indirect sunlight and maintain crisp ice-cold water."
    },
    {
      id: 3,
      name: "Royal Sunflowers & Lilies",
      category: "bouquets",
      price: 32.00,
      oldPrice: 40.00,
      discount: "-20%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80",
      description: "Radiant golden sunflowers combined with fragrant white oriental lilies and fresh eucalyptus greenery.",
      care: "Keep away from direct heat drafts and add flower food provided."
    },
    {
      id: 4,
      name: "Ceramic Potted Orchid",
      category: "pots",
      price: 35.00,
      oldPrice: 42.00,
      discount: "-15%",
      rating: 4,
      image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80",
      description: "Elegant white Phalaenopsis orchid planted in a hand-crafted minimalist matte ceramic pot.",
      care: "Water sparingly once a week with 3 ice cubes."
    },
    {
      id: 5,
      name: "Blushing Pink Roses & Hydrangeas",
      category: "roses",
      price: 28.00,
      oldPrice: 34.00,
      discount: "-17%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      description: "Soft blush pink roses paired with lush white hydrangeas and subtle seasonal gypsophila.",
      care: "Mist hydrangeas petals gently with water once a day."
    },
    {
      id: 6,
      name: "Spring Wildflower Meadow",
      category: "bouquets",
      price: 24.00,
      oldPrice: 29.00,
      discount: "-17%",
      rating: 4,
      image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80",
      description: "A whimsical bohemian mix of lavender stems, chamomile blossoms, spray roses, and meadow greenery.",
      care: "Re-arrange in a tall vase for maximum volume."
    },
    {
      id: 7,
      name: "Golden Sunrise Tulips",
      category: "tulips",
      price: 20.00,
      oldPrice: 25.00,
      discount: "-20%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=600&q=80",
      description: "Vibrant yellow and orange tulips carefully selected to spread joy and warmth.",
      care: "Keep stems submerged in fresh water."
    },
    {
      id: 8,
      name: "Potted Peace Lily Planter",
      category: "pots",
      price: 29.00,
      oldPrice: 35.00,
      discount: "-17%",
      rating: 5,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      description: "Air-purifying peace lily in an eco-friendly terracotta pot, suitable for indoor environments.",
      care: "Thrives in medium to low indirect light."
    }
  ];

  // Application State
  let state = {
    cart: JSON.parse(localStorage.getItem('blossom_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('blossom_wishlist')) || [],
    currentCategory: 'all',
    searchQuery: ''
  };

  // Save State
  function saveState() {
    localStorage.setItem('blossom_cart', JSON.stringify(state.cart));
    localStorage.setItem('blossom_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
  }

  // Update Header Badges & Drawer Counts
  function updateBadges() {
    const totalCartQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById('cart-count');
    const drawerCartCountEl = document.getElementById('drawer-cart-count');
    if (cartCountEl) cartCountEl.textContent = totalCartQty;
    if (drawerCartCountEl) drawerCartCountEl.textContent = totalCartQty;

    const wishlistCountEl = document.getElementById('wishlist-count');
    const drawerWishlistCountEl = document.getElementById('drawer-wishlist-count');
    if (wishlistCountEl) wishlistCountEl.textContent = state.wishlist.length;
    if (drawerWishlistCountEl) drawerWishlistCountEl.textContent = state.wishlist.length;
  }

  // Toast Notification System
  function showToast(message, icon = 'fa-check-circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Render Products Grid
  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = PRODUCTS_DATA.filter(prod => {
      const matchesCategory = state.currentCategory === 'all' || prod.category === state.currentCategory;
      const matchesSearch = prod.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            prod.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--clr-text-muted);">
          <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--clr-border);"></i>
          <h3>No flowers found</h3>
          <p>Try matching another category or search term.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const isWishlisted = state.wishlist.some(item => item.id === prod.id);
      return `
        <div class="product-card" data-id="${prod.id}">
          <span class="product-badge">${prod.discount}</span>
          <div class="product-image-wrap">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy">
            <div class="product-actions">
              <button class="action-btn qv-btn" data-id="${prod.id}" title="Quick View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn wish-toggle-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="Add to Wishlist">
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
          <div class="product-content">
            <span class="product-cat">${prod.category}</span>
            <h3 class="product-title">${prod.name}</h3>
            <div class="product-rating">
              ${'★'.repeat(prod.rating)}${'☆'.repeat(5 - prod.rating)}
            </div>
            <div class="product-bottom">
              <div class="product-price">
                <span class="price-current">$${prod.price.toFixed(2)}</span>
                <span class="price-old">$${prod.oldPrice.toFixed(2)}</span>
              </div>
              <button class="btn-add-cart add-cart-btn" data-id="${prod.id}">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Cart Drawer Content
  function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-price');
    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div class="empty-drawer">
          <i class="fas fa-shopping-basket"></i>
          <h4>Your cart is empty</h4>
          <p>Explore our bouquet catalog and add fresh blooms!</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    container.innerHTML = state.cart.map(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <div class="drawer-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="drawer-item-info">
            <h4>${item.name}</h4>
            <div class="drawer-item-price">$${item.price.toFixed(2)}</div>
            <div class="qty-controls">
              <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-item-btn remove-cart-item" data-id="${item.id}" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Render Wishlist Drawer Content
  function renderWishlistDrawer() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-drawer">
          <i class="fas fa-heart"></i>
          <h4>Your wishlist is empty</h4>
          <p>Save your favorite floral arrangements for later!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.wishlist.map(item => `
      <div class="drawer-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="drawer-item-info">
          <h4>${item.name}</h4>
          <div class="drawer-item-price">$${item.price.toFixed(2)}</div>
          <button class="btn btn-primary move-to-cart-btn" data-id="${item.id}" style="padding: 6px 14px; font-size: 0.8rem; margin-top: 8px;">
            <i class="fas fa-shopping-cart"></i> Move to Cart
          </button>
        </div>
        <button class="remove-item-btn remove-wishlist-item" data-id="${item.id}" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  // Cart Operations
  function addToCart(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      state.cart.push({ ...prod, qty: 1 });
    }

    saveState();
    renderCartDrawer();
    showToast(`Added ${prod.name} to cart!`);
  }

  function updateCartQty(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    saveState();
    renderCartDrawer();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveState();
    renderCartDrawer();
    showToast('Item removed from cart', 'fa-trash-alt');
  }

  // Wishlist Operations
  function toggleWishlist(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod) return;

    const index = state.wishlist.findIndex(i => i.id === productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast('Removed from Wishlist', 'fa-heart-broken');
    } else {
      state.wishlist.push(prod);
      showToast('Saved to Wishlist!', 'fa-heart');
    }

    saveState();
    renderProducts();
    renderWishlistDrawer();
  }

  // Drawer Toggle Handlers
  const cartTrigger = document.getElementById('cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartClose = document.getElementById('cart-drawer-close');

  function openCartDrawer() {
    renderCartDrawer();
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
  }

  function closeCartDrawer() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
  }

  cartTrigger?.addEventListener('click', openCartDrawer);
  cartClose?.addEventListener('click', closeCartDrawer);
  cartOverlay?.addEventListener('click', closeCartDrawer);

  const wishlistTrigger = document.getElementById('wishlist-trigger');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistOverlay = document.getElementById('wishlist-drawer-overlay');
  const wishlistClose = document.getElementById('wishlist-drawer-close');

  function openWishlistDrawer() {
    renderWishlistDrawer();
    wishlistDrawer?.classList.add('active');
    wishlistOverlay?.classList.add('active');
  }

  function closeWishlistDrawer() {
    wishlistDrawer?.classList.remove('active');
    wishlistOverlay?.classList.remove('active');
  }

  wishlistTrigger?.addEventListener('click', openWishlistDrawer);
  wishlistClose?.addEventListener('click', closeWishlistDrawer);
  wishlistOverlay?.addEventListener('click', closeWishlistDrawer);

  // Quick View Modal
  const qvOverlay = document.getElementById('quick-view-overlay');
  const qvContent = document.getElementById('quick-view-content');
  const qvClose = document.getElementById('quick-view-close');

  function openQuickView(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod || !qvContent) return;

    qvContent.innerHTML = `
      <div class="quick-view-grid">
        <img src="${prod.image}" alt="${prod.name}">
        <div class="qv-details">
          <h2>${prod.name}</h2>
          <div class="qv-price">$${prod.price.toFixed(2)}</div>
          <p class="qv-desc">${prod.description}</p>
          <div style="background: var(--clr-pink-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 24px;">
            <strong style="color: var(--clr-secondary);"><i class="fas fa-info-circle"></i> Care Instructions:</strong>
            <p style="font-size: 0.85rem; margin-top: 4px;">${prod.care}</p>
          </div>
          <button class="btn btn-primary qv-add-btn" data-id="${prod.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart Now
          </button>
        </div>
      </div>
    `;

    qvOverlay?.classList.add('active');
  }

  qvClose?.addEventListener('click', () => qvOverlay?.classList.remove('active'));
  qvOverlay?.addEventListener('click', (e) => {
    if (e.target === qvOverlay) qvOverlay.classList.remove('active');
  });

  // Checkout Modal Simulation
  const chkOverlay = document.getElementById('checkout-modal-overlay');
  const chkTrigger = document.getElementById('checkout-trigger-btn');
  const chkClose = document.getElementById('checkout-modal-close');
  const chkForm = document.getElementById('checkout-form');
  const orderSuccessOverlay = document.getElementById('order-success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');

  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Your cart is empty!', 'fa-exclamation-triangle');
      return;
    }

    closeCartDrawer();
    const summaryItemsEl = document.getElementById('checkout-summary-items');
    const chkSubtotalEl = document.getElementById('chk-subtotal');
    const chkTotalEl = document.getElementById('chk-total');
    const btnAmountEl = document.getElementById('checkout-total-btn-amount');

    let subtotal = 0;
    if (summaryItemsEl) {
      summaryItemsEl.innerHTML = state.cart.map(item => {
        subtotal += item.price * item.qty;
        return `
          <div class="chk-item-line">
            <span>${item.name} (x${item.qty})</span>
            <strong>$${(item.price * item.qty).toFixed(2)}</strong>
          </div>
        `;
      }).join('');
    }

    if (chkSubtotalEl) chkSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (chkTotalEl) chkTotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (btnAmountEl) btnAmountEl.textContent = `$${subtotal.toFixed(2)}`;

    chkOverlay?.classList.add('active');
  }

  chkTrigger?.addEventListener('click', openCheckoutModal);
  chkClose?.addEventListener('click', () => chkOverlay?.classList.remove('active'));

  chkForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderId = '#BSM-' + Math.floor(10000 + Math.random() * 90000);
    const orderIdEl = document.getElementById('success-order-id');
    if (orderIdEl) orderIdEl.textContent = orderId;

    state.cart = [];
    saveState();
    renderCartDrawer();

    chkOverlay?.classList.remove('active');
    orderSuccessOverlay?.classList.add('active');
  });

  successCloseBtn?.addEventListener('click', () => {
    orderSuccessOverlay?.classList.remove('active');
  });

  // Global Dynamic Event Delegation
  document.addEventListener('click', (e) => {
    const addCartBtn = e.target.closest('.add-cart-btn, .qv-add-btn');
    if (addCartBtn) {
      const id = parseInt(addCartBtn.dataset.id);
      addToCart(id);
      if (addCartBtn.classList.contains('qv-add-btn')) {
        qvOverlay?.classList.remove('active');
      }
      return;
    }

    const wishBtn = e.target.closest('.wish-toggle-btn');
    if (wishBtn) {
      const id = parseInt(wishBtn.dataset.id);
      toggleWishlist(id);
      return;
    }

    const qvBtn = e.target.closest('.qv-btn');
    if (qvBtn) {
      const id = parseInt(qvBtn.dataset.id);
      openQuickView(id);
      return;
    }

    const qtyPlus = e.target.closest('.qty-plus');
    if (qtyPlus) {
      const id = parseInt(qtyPlus.dataset.id);
      updateCartQty(id, 1);
      return;
    }

    const qtyMinus = e.target.closest('.qty-minus');
    if (qtyMinus) {
      const id = parseInt(qtyMinus.dataset.id);
      updateCartQty(id, -1);
      return;
    }

    const removeCartItem = e.target.closest('.remove-cart-item');
    if (removeCartItem) {
      const id = parseInt(removeCartItem.dataset.id);
      removeFromCart(id);
      return;
    }

    const moveCartBtn = e.target.closest('.move-to-cart-btn');
    if (moveCartBtn) {
      const id = parseInt(moveCartBtn.dataset.id);
      toggleWishlist(id);
      addToCart(id);
      return;
    }

    const removeWishItem = e.target.closest('.remove-wishlist-item');
    if (removeWishItem) {
      const id = parseInt(removeWishItem.dataset.id);
      toggleWishlist(id);
      return;
    }
  });

  // Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Products Search Filtering
  const searchInput = document.getElementById('products-search-input');
  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderProducts();
  });

  // Header Search Bar Slide Toggle
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const headerSearchBar = document.getElementById('header-search-bar');
  const headerSearchInput = document.getElementById('header-search-input');
  const headerSearchClose = document.getElementById('header-search-close');

  searchToggleBtn?.addEventListener('click', () => {
    headerSearchBar?.classList.toggle('open');
    if (headerSearchBar?.classList.contains('open')) {
      headerSearchInput?.focus();
    }
  });

  headerSearchClose?.addEventListener('click', () => {
    headerSearchBar?.classList.remove('open');
  });

  headerSearchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (searchInput) searchInput.value = e.target.value;
    renderProducts();
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! Your message has been sent.', 'fa-paper-plane');
    contactForm.reset();
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! 10% coupon sent to email.', 'fa-envelope');
    newsletterForm.reset();
  });

  // Offer Countdown Timer
  function initCountdown() {
    let secondsTotal = (2 * 24 * 3600) + (14 * 3600) + (45 * 60) + 18;

    setInterval(() => {
      if (secondsTotal <= 0) return;
      secondsTotal--;

      const d = Math.floor(secondsTotal / (24 * 3600));
      const h = Math.floor((secondsTotal % (24 * 3600)) / 3600);
      const m = Math.floor((secondsTotal % 3600) / 60);
      const s = secondsTotal % 60;

      const dEl = document.getElementById('days');
      const hEl = document.getElementById('hours');
      const mEl = document.getElementById('minutes');
      const sEl = document.getElementById('seconds');

      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // Initial Load
  updateBadges();
  renderProducts();
  initCountdown();
});