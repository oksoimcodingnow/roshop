# RoShop — Claude Instructions

## Project
Roblox item shop (MM2, Adopt Me, Robux packages). Firebase backend, vanilla JS, no build system.
Live site: https://roshop-642dd.web.app
Admin: https://roshop-642dd.web.app/admin.html
GitHub: https://github.com/oksoimcodingnow/roshop

## Owner
6-year MM2 trading veteran. Knows the market deeply. Prices in THB.

---

## Workflow: Add Image to an Item

1. Generate image with ChatGPT (transparent background, no text)
2. Upload to GitHub repo root via **Add file → Upload files → Commit changes**
3. Raw URL format: `https://raw.githubusercontent.com/oksoimcodingnow/roshop/main/FILENAME.png`
4. Firestore → items → find item by filtering `name == "Item Name"` → add/edit `img` field → paste URL
5. Refresh shop — image replaces emoji

---

## Workflow: Update Firestore Items (needs temp rule unlock)

1. Firestore → Rules → **line 7** → change to `allow write: if request.auth != null;` → Publish
2. Open live shop → F12 Console → run script
3. Firestore → Rules → **line 7** → change back to `allow write: if false;` → Publish

---

## MM2 Tier System

| Tier | `cat` value | `bg` class | Tag color |
|------|------------|------------|-----------|
| Godlies | `godlies` | `bg-purple` | Light purple |
| Legendaries | `legendaries` | `bg-red` | Red |
| Rares | `rares` | `bg-blue` | Cyan |
| Uncommons | `uncommons` | `bg-green` | Green |
| Commons | `commons` | `bg-grey` | Grey |
| Pets | `pets` | `bg-teal` | — |
| Untradables | `untradables` | — | — (don't list in shop) |

## Item Firestore Fields

| Field | Example |
|-------|---------|
| `id` | `100` (number) |
| `game` | `"mm2"` / `"adoptme"` / `"robux"` |
| `name` | `"Eternal III"` |
| `desc` | `"Godly knife"` |
| `price` | Robux amount (THB ÷ 33.5 × 45) |
| `emoji` | `"🔪"` / `"🔫"` |
| `bg` | CSS class e.g. `"bg-purple"` |
| `badge` | `"Godly"` / `"Legendary"` / `""` |
| `badgeCls` | `"badge-godly"` / `"badge-legendary"` / `""` |
| `cat` | tier value from table above |
| `img` | GitHub raw URL (optional) |

## THB → Robux Price Conversion
`price = THB ÷ 33.5 × 45`
- 8 THB → 11 Robux
- 10 THB → 13 Robux
- 15 THB → 20 Robux
- 25 THB → 34 Robux

---

## Firestore Rules Reference

Always tell the user the exact line number to change. Current rules structure:

```
Line 1:  rules_version = '2';
Line 2:  service cloud.firestore {
Line 3:    match /databases/{database}/documents {
Line 4:
Line 5:      match /items/{itemId} {
Line 6:        allow read: if request.auth != null;
Line 7:        allow write: if request.auth != null && request.auth.token.email == 'hzdjdndb@gmail.com';
Line 8:      }
Line 9:
Line 10:     match /users/{userId} {
Line 11:       allow read, write: if request.auth != null && request.auth.uid == userId;
Line 12:     }
Line 13:
Line 14:     match /orders/{orderId} {
Line 15:       allow create: if request.auth != null;
Line 16:       allow read: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.token.email == 'hzdjdndb@gmail.com');
Line 17:       allow write: if request.auth != null && request.auth.token.email == 'hzdjdndb@gmail.com';
Line 18:     }
Line 19:
Line 20:   }
Line 21: }
```

When telling the user to change a rule, always say "go to Firestore Rules → line X → change to: ..."

## Remaining To-Do
- [ ] Add images for all MM2 items (GitHub → Firestore img field)
- [ ] SlipOK integration — auto-verify Thai QR payment slips
- [ ] Adopt Me pet images

## File Permissions
VS Code must be opened as **Run as administrator** to edit project files.
