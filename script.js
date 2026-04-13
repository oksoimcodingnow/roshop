// ── PRODUCT DATA ──
// game field: "mm2" | "adoptme" | "robux"
// For mm2 + adoptme: price is in Robux (converted to USD/THB for display)
// For robux packages: price is in USD, robuxAmt = how many Robux the buyer receives
const ITEMS = [

  // ── MURDER MYSTERY 2 — Knives & Guns ──
  { id:1,  game:"mm2", name:"Chroma Laser",       desc:"Ultra rare chroma knife",          price:1200, emoji:"🔴", bg:"bg-red",    badge:"chroma",  badgeCls:"badge-limited", cat:"knives" },
  { id:2,  game:"mm2", name:"Darkheart",           desc:"Godly dark assassin blade",        price:2000, emoji:"🖤", bg:"bg-purple", badge:"godly",   badgeCls:"badge-limited", cat:"knives" },
  { id:3,  game:"mm2", name:"Elderwood Scythe",    desc:"Legendary harvester weapon",       price:800,  emoji:"⚔️", bg:"bg-green",  badge:"epic",    badgeCls:"badge-epic",    cat:"knives" },
  { id:4,  game:"mm2", name:"Corrupt",             desc:"Classic corrupt blade",            price:600,  emoji:"🗡️", bg:"bg-blue",   badge:"rare",    badgeCls:"badge-rare",    cat:"knives" },
  { id:5,  game:"mm2", name:"Antique Hallows",     desc:"Spooky limited knife",             price:1500, emoji:"🎃", bg:"bg-amber",  badge:"limited", badgeCls:"badge-limited", cat:"knives" },
  { id:6,  game:"mm2", name:"Chroma Handcannon",   desc:"Chroma godly gun",                 price:3000, emoji:"🔫", bg:"bg-sky",    badge:"chroma",  badgeCls:"badge-limited", cat:"guns"   },
  { id:7,  game:"mm2", name:"Icicle",              desc:"Frosty rare knife",                price:700,  emoji:"❄️", bg:"bg-sky",    badge:"rare",    badgeCls:"badge-rare",    cat:"knives" },
  { id:8,  game:"mm2", name:"Luger",               desc:"Classic rare gun",                 price:500,  emoji:"🔧", bg:"bg-teal",   badge:"rare",    badgeCls:"badge-rare",    cat:"guns"   },

  // ── ADOPT ME — Pets ──
  { id:9,  game:"adoptme", name:"Shadow Dragon",   desc:"Most legendary pet ever",          price:5000, emoji:"🐲", bg:"bg-purple", badge:"limited", badgeCls:"badge-limited", cat:"pets"  },
  { id:10, game:"adoptme", name:"Frost Dragon",    desc:"Icy rare winter dragon",           price:4500, emoji:"❄️", bg:"bg-sky",    badge:"limited", badgeCls:"badge-limited", cat:"pets"  },
  { id:11, game:"adoptme", name:"Neon Bat Dragon", desc:"Glowing neon bat pet",             price:3000, emoji:"🦇", bg:"bg-purple", badge:"neon",    badgeCls:"badge-rare",    cat:"neon"  },
  { id:12, game:"adoptme", name:"Mega Owl",        desc:"Mega neon ultra rare pet",         price:2500, emoji:"🦉", bg:"bg-amber",  badge:"mega",    badgeCls:"badge-epic",    cat:"mega"  },
  { id:13, game:"adoptme", name:"Golden Unicorn",  desc:"Shiny golden ride pet",            price:1800, emoji:"🦄", bg:"bg-pink",   badge:"rare",    badgeCls:"badge-rare",    cat:"pets"  },
  { id:14, game:"adoptme", name:"Turtle",          desc:"Classic legendary ride turtle",    price:1200, emoji:"🐢", bg:"bg-green",  badge:"new",     badgeCls:"badge-new",     cat:"pets"  },
  { id:17, game:"adoptme", name:"Arctic Reindeer", desc:"Cools down the coldest climates",  price:800,  emoji:"🦌", bg:"bg-sky",    badge:"rare",    badgeCls:"badge-rare",    cat:"pets",  img:"Pet Picture/Adopt Me/Arctic Reindeer.png" },
  { id:15, game:"adoptme", name:"Neon Parrot",     desc:"Neon colourful parrot pet",        price:900,  emoji:"🦜", bg:"bg-teal",   badge:"neon",    badgeCls:"badge-rare",    cat:"neon"  },
  { id:16, game:"adoptme", name:"Mega Griffin",    desc:"Mega neon legendary griffin",      price:3500, emoji:"🦅", bg:"bg-red",    badge:"mega",    badgeCls:"badge-epic",    cat:"mega"  },

  // ── ROBUX PACKAGES ──
  // price = USD cost, robuxAmt = Robux buyer receives
  // Rate: $5 = 1,000 Robux. Prices do NOT include Roblox's 30% marketplace tax.
  { id:17, game:"robux", name:"400 Robux",    desc:"Starter pack",           price:2,  robuxAmt:400,   emoji:"💎", bg:"bg-blue",   badge:"starter", badgeCls:"badge-new",     cat:"package" },
  { id:18, game:"robux", name:"1,000 Robux",  desc:"Best value — $5 deal",  price:5,  robuxAmt:1000,  emoji:"💎", bg:"bg-purple", badge:"best",    badgeCls:"badge-epic",    cat:"package" },
  { id:19, game:"robux", name:"2,000 Robux",  desc:"Double the fun",        price:10, robuxAmt:2000,  emoji:"💎", bg:"bg-teal",   badge:"popular", badgeCls:"badge-rare",    cat:"package" },
  { id:20, game:"robux", name:"5,000 Robux",  desc:"Power player pack",     price:25, robuxAmt:5000,  emoji:"💎", bg:"bg-amber",  badge:"value",   badgeCls:"badge-hot",     cat:"package" },
  { id:21, game:"robux", name:"10,000 Robux", desc:"Ultimate top-up",       price:50, robuxAmt:10000, emoji:"💎", bg:"bg-red",    badge:"mega",    badgeCls:"badge-limited", cat:"package" },
];

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
  const totalAmt = activeCurrency === 'usd' ? totalUsd : totalUsd * RATES.thbPerUsd;
  document.getElementById('cart-total-price').textContent = `${cfg.symbol}${cfg.format(totalAmt)}`;

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

// Called when the user submits their slip.
// NOTE: without a backend this just shows a confirmation toast.
// To add real verification, integrate the SlipOK API (slipok.com) via a backend endpoint.
function submitSlip() {
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


// ── INIT ──
// Runs immediately when the page loads to populate the items grid for the first time.
renderItems();
