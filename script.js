// ── PRODUCT DATA ──
// Items are loaded from Firestore by fetchItems() after login.
// To add/edit/remove items, use the Firebase console — no code changes needed.
let ITEMS = [];

// ── AUTH ──
let currentUser     = null;
let activeDiscount  = null; // { percent, expiresAt } — loaded from Firestore on login

// Fires every time login state changes (on load, login, logout)
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    // Logged in — hide auth modal, show user in nav
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('user-pill').style.display    = 'flex';
    document.getElementById('user-email-display').textContent = user.email;
    if (ITEMS.length === 0) fetchItems(); // Load items from Firestore on first login
    loadUserDiscount(); // Check if they have an active discount
  } else {
    // Not logged in — show auth modal, hide user pill
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('user-pill').style.display    = 'none';
  }
});

// Toggles password field between visible and hidden
function togglePassword() {
  const input = document.getElementById('auth-password');
  const btn   = document.getElementById('eye-btn');
  if (input.type === 'password') {
    input.type   = 'text';
    btn.textContent = '🙈';
  } else {
    input.type   = 'password';
    btn.textContent = '👁';
  }
}

// Toggle between Login and Register tabs
function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('auth-submit').textContent = tab === 'login' ? 'Login' : 'Register';
  document.getElementById('auth-title').textContent  = tab === 'login' ? 'Welcome back' : 'Create account';
  document.getElementById('auth-error').textContent  = '';
}

// Handles both login and register depending on active tab
function submitAuth() {
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const isLogin  = document.getElementById('tab-login').classList.contains('active');
  const btn      = document.getElementById('auth-submit');
  const errorEl  = document.getElementById('auth-error');

  if (!email || !password) { errorEl.textContent = 'Please fill in all fields.'; return; }

  btn.textContent = 'Loading...';
  btn.disabled    = true;
  errorEl.textContent = '';

  const promise = isLogin
    ? auth.signInWithEmailAndPassword(email, password)
    : auth.createUserWithEmailAndPassword(email, password);

  promise
    .then(result => {
      if (!isLogin) {
        // New user — create their Firestore profile
        db.collection('users').doc(result.user.uid).set({
          email:     result.user.email,
          balance:   4250,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    })
    .catch(err => {
      // Show a friendly error message
      const messages = {
        'auth/invalid-email':        'Invalid email address.',
        'auth/user-not-found':       'No account found with that email.',
        'auth/wrong-password':       'Incorrect password.',
        'auth/email-already-in-use': 'An account with that email already exists.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/invalid-credential':   'Incorrect email or password.',
      };
      errorEl.textContent = messages[err.code] || err.message;
      btn.textContent     = isLogin ? 'Login' : 'Register';
      btn.disabled        = false;
    });
}

// Loads the user's active discount from Firestore and stores it in activeDiscount.
// Called after login — used to apply the discount automatically in the cart.
async function loadUserDiscount() {
  if (!currentUser) return;
  try {
    const doc  = await db.collection('users').doc(currentUser.uid).get();
    const data = doc.data();
    if (data && data.activeDiscount && data.activeDiscount.expiresAt) {
      const expiry = data.activeDiscount.expiresAt.toDate();
      if (expiry > new Date()) {
        activeDiscount = data.activeDiscount;
      } else {
        activeDiscount = null;
        db.collection('users').doc(currentUser.uid).update({ activeDiscount: null });
      }
    } else {
      activeDiscount = null;
    }
  } catch(e) { activeDiscount = null; }
}

function logout() {
  auth.signOut();
  activeDiscount = null;
  // Reset shop state on logout
  selectedGame  = null;
  currentFilter = 'all';
  document.getElementById('items-grid').innerHTML = '';
  const overlay = document.getElementById('game-select-overlay');
  overlay.style.display = '';
  overlay.classList.remove('dismissed');
}

// ── GAME SELECTION ──
// Stores which game the user picked on the welcome screen.
let selectedGame = null;

// Filter buttons to show per game
const GAME_FILTERS = {
  mm2:     [['all','All'],['knives','🗡️ Knives'],['guns','🔫 Guns']],
  adoptme: [['all','All'],['pets','🐾 Pets'],['neon','✨ Neon'],['mega','🌟 Mega']],
  robux:   [], // No category filters for Robux packages
};

// Section label shown above the item grid per game
const GAME_LABELS = {
  mm2:     '🔪 Murder Mystery 2',
  adoptme: '🐾 Adopt Me',
  robux:   '💎 Robux Packages',
};

// Re-shows the game selection overlay so the user can switch games
function goBack() {
  selectedGame  = null;
  currentFilter = 'all';
  const overlay = document.getElementById('game-select-overlay');
  overlay.style.display = '';
  overlay.classList.remove('dismissed');
  // Remove any previously selected card highlight
  document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
  // Clear the grid so old items don't show through
  document.getElementById('items-grid').innerHTML = '';
  document.querySelector('.filters-row').style.display = 'flex';
}

// Called when the user clicks a game card on the welcome overlay.
function selectGame(game, btn) {
  selectedGame = game;
  currentFilter = 'all';

  document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');

  // Rebuild filter buttons for this game
  const filtersRow = document.querySelector('.filters-row');
  const filtersEl  = document.getElementById('filters');
  const configs    = GAME_FILTERS[game] || [];

  if (configs.length === 0) {
    filtersRow.style.display = 'none';
  } else {
    filtersRow.style.display = 'flex';
    filtersEl.innerHTML = configs.map(([val, label], i) =>
      `<button class="filter-btn${i===0?' active':''}" onclick="setFilter(this,'${val}')">${label}</button>`
    ).join('');
  }

  setTimeout(() => {
    const overlay = document.getElementById('game-select-overlay');
    overlay.classList.add('dismissed');
    setTimeout(() => overlay.style.display = 'none', 400);
  }, 250);

  renderItems();
}

// ── CURRENCY ──
// Item prices are stored in Robux internally; all display is converted to USD or THB.
// Robux removed from the currency switcher — only real-money currencies shown.
const BASE_ROBUX = 4250; // User's balance in Robux (used for conversions)

// Fixed exchange rates — THB/USD updated live via fetchLiveRate() on load.
// 1 USD = 45 Robux (Roblox fixed rate), 1 USD = 33.5 THB (fallback if fetch fails).
const RATES = { robuxPerUsd: 45, thbPerUsd: 33.5 };

// Only USD and THB are shown to the user — Robux is internal only
const CURRENCY_CONFIG = {
  usd: { symbol: '$',  dotColor: '#378add', format: v => v.toFixed(2) },
  thb: { symbol: '฿',  dotColor: '#ef9f27', format: v => Math.round(v).toLocaleString() },
};

let activeCurrency = 'usd'; // Default to USD

// Converts the base Robux balance to USD or THB for display
function convertBalance(currency) {
  const usd = BASE_ROBUX / RATES.robuxPerUsd;
  if (currency === 'usd') return usd;
  if (currency === 'thb') return usd * RATES.thbPerUsd;
}

// Updates the balance pill, item card prices, and dot colours to reflect the selected currency
function setCurrency(currency, event) {
  if (event) event.stopPropagation(); // Prevent the pill's onclick from re-toggling the menu
  activeCurrency = currency;
  const cfg    = CURRENCY_CONFIG[currency];
  const amount = convertBalance(currency);

  document.getElementById('balance-amount').textContent = cfg.format(amount);
  document.getElementById('balance-symbol').textContent = cfg.symbol;
  document.getElementById('balance-symbol').style.background = cfg.dotColor;

  // Highlight the active option in the menu
  document.querySelectorAll('.currency-opt').forEach(b => b.classList.remove('active'));
  document.getElementById('opt-' + currency).classList.add('active');

  closeCurrencyMenu();
  renderItems(); // Re-render cards so prices update
}

// Opens/closes the currency dropdown menu
function toggleCurrencyMenu(event) {
  event.stopPropagation();
  document.getElementById('currency-menu').classList.toggle('open');
}

function closeCurrencyMenu() {
  document.getElementById('currency-menu').classList.remove('open');
}

// Close the menu if the user clicks anywhere outside the balance pill
document.addEventListener('click', (e) => {
  if (!document.getElementById('balance-pill').contains(e.target)) {
    closeCurrencyMenu();
  }
});

// Fetches the live USD → THB rate from the free open.er-api.com endpoint (no key needed).
// Falls back silently to the fixed RATES.thbPerUsd value if the request fails.
async function fetchLiveRate() {
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.rates && data.rates.THB) {
      RATES.thbPerUsd = data.rates.THB;
      // Refresh prices if THB is currently active
      if (activeCurrency === 'thb') renderItems();
    }
  } catch (_) {
    // Network error — fixed fallback rate (33.5) stays in place
  }
}
fetchLiveRate(); // Run once on page load

// ── STATE ──
// These variables track what's currently happening on the page.
// They are updated by filter/search/sort actions and read by renderItems().
let currentFilter = 'all';   // Which category button is active ("all", "gear", etc.)
let currentSearch = '';      // The current search query string (lowercase, trimmed)
let cart = [];               // Array of item objects the user has added to their cart
let toastTimer;              // Holds the setTimeout ID so we can cancel it if needed


// ── FILTERING & SORTING ──
// Returns a filtered + sorted copy of ITEMS based on the current state variables.
// This never modifies ITEMS directly — it always works on a fresh copy.
function getFiltered() {
  let list = [...ITEMS];

  // Always filter by the selected game first
  if (selectedGame) list = list.filter(item => item.game === selectedGame);

  // Category filter (not applied for robux packages — they have no sub-categories)
  if (currentFilter !== 'all' && selectedGame !== 'robux') {
    list = list.filter(item => item.cat === currentFilter);
  }

  if (currentSearch) {
    list = list.filter(item =>
      item.name.toLowerCase().includes(currentSearch) ||
      item.desc.toLowerCase().includes(currentSearch)
    );
  }

  const sort = document.getElementById('sort-select').value;
  if (sort === 'low')  list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
}


// ── RENDER ITEMS ──
// Clears the items grid and redraws all cards based on the current filter/search/sort.
// Called whenever any of those change.
function renderItems() {
  const grid  = document.getElementById('items-grid');   // The grid container in HTML
  const label = document.getElementById('section-label'); // The heading above the grid
  const list  = getFiltered(); // Get the filtered + sorted list to display

  // Section label
  if (currentSearch) {
    label.textContent = `🔍 Results for "${currentSearch}"`;
  } else if (selectedGame) {
    label.textContent = GAME_LABELS[selectedGame];
  } else {
    label.textContent = '🔥 Popular Right Now';
  }

  if (!list.length) {
    grid.innerHTML = '<div class="empty">😅 No items found! Try a different search.</div>';
    return;
  }

  const cfg = CURRENCY_CONFIG[activeCurrency];

  grid.innerHTML = list.map((item, i) => {
    let priceHtml;

    if (item.game === 'robux') {
      // Robux packages: price is USD, show R$ amount big + cost small
      const cost = activeCurrency === 'usd' ? item.price : item.price * RATES.thbPerUsd;
      priceHtml = `
        <div class="pkg-price">
          <div class="pkg-robux">R$ ${item.robuxAmt.toLocaleString()}</div>
          <div class="pkg-cost">
            <div class="rbx-dot" style="background:${cfg.dotColor}">${cfg.symbol}</div>
            ${cfg.format(cost)}
          </div>
        </div>`;
    } else {
      // MM2 / Adopt Me: price is Robux, convert to active currency
      const usd    = item.price / RATES.robuxPerUsd;
      const amount = activeCurrency === 'usd' ? usd : usd * RATES.thbPerUsd;
      priceHtml = `
        <div class="price">
          <div class="rbx-dot" style="background:${cfg.dotColor}">${cfg.symbol}</div>
          ${cfg.format(amount)}
        </div>`;
    }

    return `
    <div class="item-card${item.game==='robux'?' robux-card':''}" style="animation-delay:${i*0.04}s">
      <div class="item-thumb ${item.bg}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="item-img"/>` : `<span>${item.emoji}</span>`}
        <span class="badge ${item.badgeCls}">${item.badge}</span>
      </div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-footer">
          ${priceHtml}
          <button class="buy-btn" onclick="addToCart(${item.id})">Buy</button>
        </div>
      </div>
      ${item.game==='robux' ? '<div class="tax-note">* +30% Roblox tax not included</div>' : ''}
    </div>`;
  }).join('');
}


// ── FILTER BUTTONS ──
// Called when a filter button is clicked.
// Removes "active" from all buttons, adds it to the clicked one, then re-renders.
function setFilter(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  renderItems();
}


// ── SEARCH ──
// Called on every keystroke in the search input.
// Grabs the current value, trims whitespace, lowercases it, then re-renders.
function handleSearch() {
  currentSearch = document.getElementById('search-input').value.toLowerCase().trim();
  renderItems();
}


// ── CART: ADD ──
// Finds the item by id and pushes it into the cart array.
// Multiple clicks = multiple copies of the same item (intentional).
function addToCart(id) {
  const item = ITEMS.find(i => i.id === id); // Locate the item object by its id
  cart.push(item);
  updateCartCount();                          // Refresh the red badge number on the cart button
  showToast(`${item.emoji} ${item.name} added to cart!`); // Show pop-up notification
}


// ── CART: COUNT BADGE ──
// Updates the little number badge on the cart button in the nav to show how many items are in the cart.
function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}


// ── CART: OPEN / CLOSE ──
// openCart  — adds the "open" class which makes the overlay visible, then renders its contents
// closeCart — removes the "open" class to hide the overlay
// handleOverlayClick — closes the cart only if the user clicked the dark backdrop (not the panel itself)
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
}

function handleOverlayClick(e) {
  // e.target is the exact element clicked; only close if it's the overlay, not a child inside the panel
  if (e.target === document.getElementById('cart-overlay')) closeCart();
}


// ── CART: REMOVE ITEM ──
// Removes one item from the cart by its index in the array.
// splice(index, 1) removes exactly 1 element at that position.
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart(); // Re-render the panel so the item disappears immediately
}


// ── CART: RENDER PANEL ──
// Rebuilds the HTML inside the open cart panel.
// Shows an empty state if the cart has no items, otherwise lists each item + total.
function renderCart() {
  const el     = document.getElementById('cart-items');  // Container for the item rows
  const footer = document.getElementById('cart-footer'); // Footer with total + checkout button

  // Empty state: show a message and hide the footer (no total or checkout needed)
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty">😢 Your cart is empty!<br>Go grab something!</div>';
    footer.style.display = 'none';
    return;
  }

  const cfg = CURRENCY_CONFIG[activeCurrency];

  // Helper: converts an item's price to the active currency for display
  function itemDisplayPrice(item) {
    if (item.game === 'robux') {
      // Robux packages: price is already in USD
      const amount = activeCurrency === 'usd' ? item.price : item.price * RATES.thbPerUsd;
      return `${cfg.symbol}${cfg.format(amount)}`;
    }
    const usd    = item.price / RATES.robuxPerUsd;
    const amount = activeCurrency === 'usd' ? usd : usd * RATES.thbPerUsd;
    return `${cfg.symbol}${cfg.format(amount)}`;
  }

  el.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-icon ${item.bg}">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="name">${item.name}</div>
        <div class="cprice">${itemDisplayPrice(item)}</div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');

  // Total: sum in USD then convert, keeping robux packages (already USD) separate
  const totalUsd = cart.reduce((sum, item) => {
    return sum + (item.game === 'robux' ? item.price : item.price / RATES.robuxPerUsd);
  }, 0);

  // Apply active discount if available
  const discountPct      = (activeDiscount && activeDiscount.expiresAt &&
    activeDiscount.expiresAt.toDate() > new Date()) ? activeDiscount.percent : 0;
  const discountedUsd    = totalUsd * (1 - discountPct / 100);
  const totalAmt         = activeCurrency === 'usd' ? totalUsd       : totalUsd * RATES.thbPerUsd;
  const discountedAmt    = activeCurrency === 'usd' ? discountedUsd  : discountedUsd * RATES.thbPerUsd;

  if (discountPct > 0) {
    document.getElementById('cart-total-price').innerHTML =
      `<span style="text-decoration:line-through;color:#aaa;font-size:13px">${cfg.symbol}${cfg.format(totalAmt)}</span>
       <span style="color:#00b06f"> ${cfg.symbol}${cfg.format(discountedAmt)}</span>
       <span style="font-size:12px;background:#d1e7dd;color:#0a3622;padding:2px 8px;border-radius:20px;margin-left:4px">${discountPct}% OFF 🎉</span>`;
  } else {
    document.getElementById('cart-total-price').textContent = `${cfg.symbol}${cfg.format(totalAmt)}`;
  }

  // Show the footer now that there are items
  footer.style.display = 'block';
}


// ── PAYMENT METHOD ──
const PAYMENT_LABELS = {
  thaqr:     { btn: 'Pay via Thai QR 🇹🇭',         toast: '🇹🇭 Thai QR' },
  truemoney: { btn: 'Pay via TrueMoney 💳',         toast: '💳 TrueMoney' },
  crypto:    { btn: 'Pay with Crypto ₿',            toast: '₿ Crypto' },
};

// Called when a payment card is clicked — updates highlight, button label, and detail panel
function selectPayment(input) {
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
  input.closest('.payment-option').classList.add('active');
  document.getElementById('checkout-btn').textContent = PAYMENT_LABELS[input.value].btn;

  // Show the matching detail panel, hide the others
  ['thaqr', 'truemoney', 'crypto'].forEach(m => {
    document.getElementById('pdetail-' + m).style.display = m === input.value ? 'block' : 'none';
  });
}

// ── CHECKOUT ──
// Instead of completing immediately, opens the slip upload modal so the user can send proof.
function checkout() {
  if (!cart.length) return;
  const selected = document.querySelector('input[name="payment"]:checked').value;
  const total    = cart.reduce((sum, item) => sum + item.price, 0);

  // Build the order summary shown at the top of the slip modal
  const cfg    = CURRENCY_CONFIG[activeCurrency];
  const usd    = total / RATES.robuxPerUsd;
  const amount = activeCurrency === 'usd' ? usd : usd * RATES.thbPerUsd;

  document.getElementById('slip-summary').innerHTML = `
    <div class="slip-summary-row">
      <span>Payment via</span>
      <strong>${PAYMENT_LABELS[selected].toast}</strong>
    </div>
    <div class="slip-summary-row">
      <span>Amount to pay</span>
      <strong class="slip-amount">${cfg.symbol}${cfg.format(amount)}</strong>
    </div>
  `;

  closeCart();
  openSlipModal();
}

// ── SLIP MODAL ──
function openSlipModal() {
  document.getElementById('slip-overlay').classList.add('open');
}

function closeSlipModal() {
  document.getElementById('slip-overlay').classList.remove('open');
  // Reset upload area for next time
  document.getElementById('slip-preview').style.display    = 'none';
  document.getElementById('slip-placeholder').style.display = 'flex';
  document.getElementById('submit-slip-btn').disabled       = true;
  document.getElementById('slip-file').value                = '';
}

// Called when the user picks an image — shows a preview and enables the submit button
function previewSlip(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('slip-preview');
    preview.src = e.target.result;
    preview.style.display = 'block';
    document.getElementById('slip-placeholder').style.display = 'none';
    document.getElementById('submit-slip-btn').disabled = false;
  };
  reader.readAsDataURL(input.files[0]);
}

// Called when the user submits their slip — saves order to Firestore then clears cart.
function submitSlip() {
  const selected     = document.querySelector('input[name="payment"]:checked').value;
  const totalUsd     = cart.reduce((sum, item) =>
    sum + (item.game === 'robux' ? item.price : item.price / RATES.robuxPerUsd), 0);
  const discountPct  = (activeDiscount && activeDiscount.expiresAt &&
    activeDiscount.expiresAt.toDate() > new Date()) ? activeDiscount.percent : 0;
  const finalUsd     = totalUsd * (1 - discountPct / 100);
  const cfg          = CURRENCY_CONFIG[activeCurrency];
  const finalAmt     = activeCurrency === 'usd' ? finalUsd : finalUsd * RATES.thbPerUsd;

  // Save order to Firestore under the logged-in user
  if (currentUser) {
    db.collection('orders').add({
      userId:        currentUser.uid,
      email:         currentUser.email,
      items:         cart.map(i => ({ id: i.id, name: i.name, game: i.game, price: i.price })),
      paymentMethod: selected,
      totalUsd:      parseFloat(finalUsd.toFixed(2)),
      totalDisplay:  `${cfg.symbol}${cfg.format(finalAmt)}`,
      discountApplied: discountPct,
      status:        'pending',
      createdAt:     firebase.firestore.FieldValue.serverTimestamp()
    });

    // If discount was used, clear it from Firestore
    if (discountPct > 0) {
      db.collection('users').doc(currentUser.uid).update({ activeDiscount: null });
      activeDiscount = null;
    }

    // If order total (before discount) >= $9.99, award a free spin
    if (totalUsd >= 9.99) {
      db.collection('users').doc(currentUser.uid).update({
        spinsAvailable: firebase.firestore.FieldValue.increment(1)
      }).then(() => {
        showToast('🎰 You earned a free spin! Visit the Spin page to use it.');
      });
    }
  }

  closeSlipModal();
  showToast('📋 Order submitted! We\'ll verify your slip and confirm shortly.');
  cart = [];
  updateCartCount();
}


// ── TOAST NOTIFICATION ──
// Shows a small pop-up message at the bottom of the screen.
// If a toast is already visible, it resets the timer so it stays a full 2.5s.
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');         // CSS animates it sliding up into view
  clearTimeout(toastTimer);        // Cancel any existing hide timer
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500); // Hide after 2.5 seconds
}


// ── FETCH ITEMS FROM FIRESTORE ──
// Loads all documents from the 'items' collection, populates ITEMS, then renders.
// Called once after the user logs in (inside auth.onAuthStateChanged).
async function fetchItems() {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading items...</p></div>`;
  try {
    const snapshot = await db.collection('items').get();
    ITEMS = snapshot.docs.map(doc => doc.data());
    renderItems();
  } catch (err) {
    grid.innerHTML = `<div class="empty">⚠️ Failed to load items. Please refresh the page.</div>`;
    console.error('Firestore fetch failed:', err);
  }
}
