# RoShop Engineering Workflow

This repo should use a reviewed branch workflow for non-trivial changes.

The goal is simple: keep `main` stable, make every risky change visible, and use AI review as a helper instead of letting AI commit blindly.

## Core Rule

Do not push risky work directly to `main`.

Use this flow:

```text
plan -> branch -> implement -> test -> PR -> review -> fix -> merge
```

## Branch Names

Use short names:

```text
feature/slip-verification
fix/checkout-total
security/firestore-rules
docs/update-journal
```

## Normal Commands

Create a branch:

```bash
git checkout main
git pull --ff-only
git checkout -b fix/example-name
```

Commit:

```bash
git add .
git commit -m "fix: short useful message"
```

Push branch:

```bash
git push -u origin fix/example-name
```

## When To Use AI Handshake

Use `.handshake/` for:

- Payment / checkout changes
- Firebase rules
- Auth/admin access
- Firestore/Storage data model changes
- Code that updates orders, users, discounts, or spins
- Multi-file refactors
- Anything ATLAS writes from phone

Skip it for:

- Typos
- Tiny README/JOURNAL edits
- Visual-only tweaks that do not affect data

## AI Review Loop

```text
Codex Builder
  -> writes .handshake/01_codex_packet.md
You
  -> paste packet into Claude Pro / ChatGPT Plus
External Reviewer
  -> returns verdict + findings
You
  -> paste review into .handshake/02_external_review.md or back into chat
Codex Builder
  -> fixes/responds in .handshake/03_codex_response.md
Final
  -> .handshake/04_decision.md says APPROVED before merge
```

## Review Checklist

Before merge, check:

- Does checkout still calculate the correct amount?
- Can a normal customer still place an order?
- Can admin still read orders and mark delivered?
- Are user-controlled strings escaped before `innerHTML`?
- Are Firebase rules updated if data permissions changed?
- Did we avoid committing secrets?
- Did `node --check script.js` pass?
- Did inline scripts parse for `admin.html`, `orders.html`, and `spin.html`?

## Deployment Notes

Hosting:

```bash
firebase deploy --only hosting
```

Rules:

```bash
firebase deploy --only firestore:rules,storage
```

If Firebase CLI is not logged in:

```bash
firebase login
```

## Future Safer Target

Eventually, move money-sensitive logic server-side:

- Slip verification endpoint
- Order creation validation
- Spin awarding
- Discount creation

Until then, keep `main` conservative.

