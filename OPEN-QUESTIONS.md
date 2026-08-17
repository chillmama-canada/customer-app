# Chillmama Customer App — Open Questions

Living list of product/design decisions not yet made. When Claude Code encounters a new one mid-task, it should add it here (with context on why it came up) and ask the user, rather than guessing and moving on. When a question gets resolved, move it to the "Resolved" section at the bottom with the decision and date, rather than deleting it — keeps a record of why things are the way they are.

## Open

- **Swipe-left exclusion permanence** — does swiping left on a recommended helper permanently exclude them from that search, or could they resurface later if the customer wants to reconsider?
- **Reminder lead time(s)** — exact timing for AI-initiated reminders (e.g. night before + morning of? just one?).
- **Reminder deep-link target** — does tapping a reminder notification open Chat (continuing the conversation, fits the Butler persona) or My Bookings (a plain list)?
- **Memory encryption approach** — at-rest encryption (server can still read/use the data to personalize) vs. end-to-end (server can't read it, changes how AI personalization would need to work). High-stakes — affects the architecture of the whole memory system.
- **Memory data retention & deletion** — how long is customer preference/history data kept, and how does a customer request deletion? (Relevant given PIPEDA / Canadian privacy expectations.)
- **Memory aggregation** — is per-customer memory ever aggregated/anonymized for platform-level insights, or strictly siloed per customer?
- **Onboarding flow scope** — collect initial preferences upfront during signup, or let the AI learn them conversationally over time only?
- **Social login timing** — needed at launch, or email/password first with social login later?
- **AI chatbot backend architecture confirmation** — assumed direction is a backend proxy (Claude API called server-side from the webapp's Next.js API, not directly from the mobile client) — needs explicit confirmation before AI integration work starts.
- **Push notification service** — Expo's push service vs. a dedicated service (e.g. Firebase Cloud Messaging).

## Resolved

*(none yet)*
