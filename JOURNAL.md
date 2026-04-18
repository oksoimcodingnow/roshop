# RoShop — Project Journal
> A Roblox item shop built with HTML, CSS, JavaScript, and Firebase.
> Written for my own reference — no coding experience assumed.

---

## What is RoShop?
A website where people can browse Roblox items (MM2 knives, Adopt Me pets, Robux packages),
add them to a cart, and pay via Thai QR / TrueMoney / Crypto by uploading a payment slip.

---

## Project Files

| File | What it does |
|------|-------------|
| `index.html` | The main shop page (renamed from `roshop frontend.html`) |
| `admin.html` | Admin panel — view and manage all orders |
| `orders.html` | Customer order history page |
| `style.css` | All colours, layouts, and animations |
| `script.js` | All the logic — cart, filters, payments, login |
| `firebase-init.js` | Connects the app to Firebase (our backend) |
| `payment/my bank acc.jpg` | SCB QR code image shown at checkout |

---

## How to Run It Locally

> **Important:** Never open the HTML file by double-clicking it.
> Firebase breaks when opened as `file://`.

1. Open the project folder in **VS Code**
2. Right-click `index.html` → click **"Open with Live Server"**
3. It opens at `http://127.0.0.1:5500` — Firebase works correctly here

| Page | Local URL | What it is |
|------|-----------|-----------|
| Shop | `http://127.0.0.1:5500/index.html` | Main shop for customers |
| My Orders | `http://127.0.0.1:5500/orders.html` | Customer order history |
| Admin | `http://127.0.0.1:5500/admin.html` | Admin panel (your eyes only) |

### Does the site run when my PC is off?
**Yes** — the live site at `https://roshop-642dd.web.app` runs on Firebase's servers 24/7.
You only need your PC on when you want to **make changes** to the code.
The admin panel also works at `https://roshop-642dd.web.app/admin.html` without your PC.

---

## Tech Stack

| Tool | What it's for |
|------|--------------|
| HTML | Page structure |
| CSS | Styling and animations |
| JavaScript (vanilla, no framework) | All logic |
| Firebase Auth | User login and registration |
| Firestore | Database — items, users, orders |
| Firebase Storage | Item images (pet photos etc.) |
| GitHub | Version control and collaboration |
| Live Server (VS Code extension) | Local development server |

---

## Firebase — Our Backend

Firebase is a Google service that gives us a database, file storage, and user login
without writing a server ourselves.

### Firebase Auth
- Handles email + password login and registration
- A login modal appears before anyone can see the shop
- New users get a profile document created in Firestore automatically

### Firestore (the database)
Data is stored in **collections** (like folders) with **documents** (like files) inside.

**Our 3 collections:**

| Collection | What's stored |
|-----------|--------------|
| `users` | One doc per user — email, balance, createdAt |
| `orders` | One doc per order — items, total, payment method, status: "pending" |
| `items` | One doc per shop item — name, price, game, category, emoji, etc. |

### Firebase Storage
- Stores image files (pet photos, etc.)
- Arctic Reindeer image goes here → copy the Download URL → paste into the item's `img` field in Firestore

---

## Firestore Security Rules

These control who can read or write the database from the browser.
Set them in: Firebase Console → Firestore → Rules tab.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Items: anyone logged in can read, nobody can write from browser
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Users: you can only read/write your own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders: anyone logged in can create, only the owner can read
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false;
    }

  }
}
```

---

## How to Add a New Item (no code needed)

1. **Go to** Firebase Console → Firestore → `items` collection
2. Click **Add document** — use the next number as the Document ID (e.g. `23`)
3. Fill in these fields:

| Field | Type | Example |
|-------|------|---------|
| `id` | number | `23` |
| `game` | string | `"mm2"` / `"adoptme"` / `"robux"` |
| `name` | string | `"Chroma Godly"` |
| `desc` | string | `"Rarest knife in MM2"` |
| `price` | number | `12.99` |
| `emoji` | string | `"🔪"` |
| `bg` | string | `"linear-gradient(135deg,#1a1a2e,#16213e)"` |
| `badge` | string | `"Godly"` / `"Legendary"` / `""` for none |
| `badgeCls` | string | `"badge-godly"` / `"badge-legendary"` / `""` |
| `cat` | string | `"knives"` / `"pets"` / `"neon"` / `"mega"` / `"packages"` |
| `img` | string | Firebase Storage download URL (optional, for real photos) |
| `robuxAmt` | number | `400` (only for Robux packages) |

4. Click **Save** → refresh the shop → item appears immediately

---

## How to Upload an Item Image

1. Firebase Console → **Storage** → Upload file
2. Create the folder path `items/adoptme/` (or `items/mm2/`)
3. Upload your image (PNG or JPG)
4. Click the uploaded file → copy the **Download URL**
5. Firestore → `items` → find the item's document → add/edit the `img` field = paste the URL
6. Refresh the shop — the real photo replaces the emoji

---

## GitHub — Version Control

Repo: `https://github.com/oksoimcodingnow/roshop`

Used for saving change history and letting collaborators work on the project.

### Basic git workflow (run in VS Code terminal)
```bash
cd "C:/Users/HOME/Downloads/roshop"
git add .
git commit -m "describe what you changed"
git push
```

### What each command does
- `git add .` — stage all changed files (mark them to be saved)
- `git commit -m "..."` — save a snapshot with a description
- `git push` — upload the snapshot to GitHub

---

## Big Things We Built / Changed

### Login system
- Added a login/register modal that appears before the shop
- Eye icon button to show/hide password
- Firebase Auth handles the actual login — we just call the function

### Game selection screen
- Full-screen overlay on first load
- Pick MM2, Adopt Me, or Robux
- Each game shows its own items and filter buttons
- "Change Game" button in the nav to go back

### Currency switcher
- USD or THB (Thai Baht)
- THB rate is fetched live from `open.er-api.com` on page load
- All prices across the shop update when you switch currency

### Payment flow
1. Add items to cart
2. Choose payment method (Thai QR / TrueMoney / Crypto)
3. Click checkout
4. Upload a screenshot of your payment slip
5. Order gets saved to Firestore with status `"pending"`

### Admin panel (`admin.html`)
- Only accessible with the admin email (`hzdjdndb@gmail.com`)
- Shows all orders with customer email, items, total, payment method, date, status
- Click **Mark Delivered** to update an order's status
- Works at `https://roshop-642dd.web.app/admin.html` — no PC needed, runs 24/7
- View slip images by clicking "View Slip" on each order

### Spin wheel (`spin.html`)
- Place an order of **$9.99 or more** → earn 1 free spin automatically
- Go to `spin.html` → spin the wheel → win a discount (5%, 10%, 15%, 20%, 50% off) or "No luck"
- Discount is saved to your Firestore user document, valid until midnight that day
- Discount applies **automatically** in the cart — shown with strikethrough original price
- Discount is cleared from Firestore after it's used at checkout
- To manually give a test spin (in browser console on shop page):
  ```js
  db.collection('users').doc(auth.currentUser.uid).update({ spinsAvailable: 1 })
  ```

### Order history page (`orders.html`)
- Customers click **My Items** in the nav to see their past orders
- Shows each order's items, total, payment method, date, and status (pending/delivered)
- Only shows orders belonging to the logged-in user

### Moving items to Firestore (the big migration)
**Before:** All 21 items were hardcoded in `script.js` — had to edit code to change anything.

**After:** Items live in Firestore. Add/edit/remove from the Firebase Console with no code.

What we changed in code:
- `const ITEMS = [...]` → `let ITEMS = []` (empty, filled by database)
- Added `fetchItems()` function that loads from Firestore on login
- Added a loading spinner while items are being fetched
- Ran a seed script in the browser console (F12) to copy all 21 items into Firestore

---

## Bugs We Fixed Along the Way

| Bug | What happened | Fix |
|-----|--------------|-----|
| Shop showed nothing | Stray `+` in JavaScript caused a syntax error | Removed the `+` |
| QR image not showing | Wrong filename — used `my bank.jpg` but file was `my bank acc.jpg` | Fixed the filename in HTML |
| Git wrong directory | Ran git commands in System32 | `cd` into the project folder first |
| Branch mismatch | Local was `master`, GitHub expected `main` | `git branch -M main` |
| Items not loading | Firebase doesn't work from `file://` | Use Live Server instead |
| Firestore permission error | Rules blocked writes during seeding | Temporarily set `allow write: if request.auth != null`, seed, then lock back |
| Duplicate ID 17 | Arctic Reindeer and 400 Robux both had id:17 | Reindeer stays 17, Robux packages renumbered 18–22 |

---

## To-Do List

- [x] Deploy to Firebase Hosting — live at `https://roshop-642dd.web.app`
- [x] Admin panel — view and manage all orders
- [x] Order history page — customers can see their past orders
- [x] Spin wheel — earn spins from $9.99+ orders, win discount codes
- [ ] AI-generated item images — replace emoji cards with real art
- [ ] SlipOK integration — auto verify Thai QR payment slips
- [ ] Custom domain (optional, ~$10-15/year)

---

## Useful Links

| What | URL |
|------|-----|
| Live shop | https://roshop-642dd.web.app |
| Admin panel | https://roshop-642dd.web.app/admin.html |
| Firebase Console | https://console.firebase.google.com |
| GitHub Repo | https://github.com/oksoimcodingnow/roshop |
| Live exchange rate API | https://open.er-api.com/v6/latest/USD |
