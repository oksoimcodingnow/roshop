# 01 Codex Packet

Status: DRAFT
Date: YYYY-MM-DD
Builder: Codex
Reviewer: Claude Pro / ChatGPT Plus

## Goal

Describe the change in one or two sentences.

## Why This Change Matters

Explain the user or engineering value.

## Files Changed

| File | Change |
|------|--------|
| `path/to/file` | Short description |

## Implementation Summary

- Bullet 1
- Bullet 2
- Bullet 3

## Risk Areas

- Payment / checkout:
- Firebase rules:
- Auth / admin:
- User data:
- XSS / rendering:
- Deployment:

## Verification Performed

| Check | Result |
|-------|--------|
| `node --check script.js` | Not run / passed / failed |
| Inline scripts parse | Not run / passed / failed |
| Manual checkout | Not run / passed / failed |
| Manual admin order flow | Not run / passed / failed |
| Firebase rules deploy/dry-run | Not run / passed / failed |

## Diff Summary For Reviewer

Paste a concise diff summary here. For large diffs, do not paste everything; include the key files and behavior changes.

## Questions For Reviewer

1. Is this safe for a shop/payment flow?
2. Are Firebase rules too permissive or too strict?
3. Are any user-controlled values rendered unsafely?
4. What should be tested before merge?

