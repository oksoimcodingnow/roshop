# 00 Context

Project: RoShop

Purpose:
- Roblox item shop for MM2, Adopt Me, and Robux packages.
- Static frontend hosted on Firebase Hosting.
- Firebase Auth for login/register.
- Firestore for items, users, and orders.
- Firebase Storage planned/used for payment slip images if billing allows it.

Important files:
- `index.html`: shop UI
- `script.js`: main shop logic
- `orders.html`: customer order history
- `admin.html`: admin order panel
- `spin.html`: spin wheel and discount flow
- `firebase-init.js`: Firebase config/init
- `firestore.rules`: Firestore permissions
- `storage.rules`: Storage permissions

Safety priorities:
- Do not trust client-side checks for admin/payment/security.
- Escape user-controlled data before using `innerHTML`.
- Keep Firebase rules version-controlled.
- Keep `main` stable; use branches and PRs for risky work.
- Do not commit secrets.

Known limitations:
- Spin rewards are still client-side and need a server-side Cloud Function later.
- Slip verification is not real verification yet unless a bank/slip API is added.

