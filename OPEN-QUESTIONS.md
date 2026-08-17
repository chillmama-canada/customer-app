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
- **AI chatbot backend architecture confirmation** — assumed direction is a backend proxy (Claude API called server-side from the webapp's Next.js API, not directly from the mobile client) — needs explicit confirmation before AI integration work starts.
- **Push notification service** — Expo's push service vs. a dedicated service (e.g. Firebase Cloud Messaging).
- **Reschedule/cancel existing bookings** — the chat assistant's "review an upcoming booking" step (2026-08-17) shows the booking's details but explicitly says it can't reschedule or cancel yet — that's a real gap, not just missing UI polish, since customers will expect it. Needs a decision on the flow (does cancelling require helper notice/a fee? can you reschedule within the chat the same way you book?) before building it.
- **Real availability calendar & timezone handling for bookings** — there's no structured availability data anywhere in the schema (`Service.availableTimes` is freeform text like "Mon-Sat 8am-6pm", not machine-readable, and customers have no declared availability at all). The booking flow's slot suggestions (2026-08-17, `GET /api/mobile/bookings/slots`) are an honest stand-in: a fixed daytime grid (9/11/1/3/5) filtered only by conflicting bookings, computed in the server's local time rather than an explicit timezone (presumably should be America/Vancouver). Worth deciding whether helpers eventually get real structured availability, and whether slot times need explicit timezone handling before this goes further than a demo.

## Resolved

- **Registration role choice** — resolved 2026-08-16: the Customer App registers customers only, no "I'm a customer / I'm a helper" chooser (that pattern is a webapp-only mockup — helpers get their own future Helper App per section 5). Register screen goes straight to name/email/password.
- **Social login timing** — resolved 2026-08-16: needed, via Google, Apple, and Facebook. UI shell (buttons on Login and Register) is built, but the buttons are stubs — there's no backend OAuth token-exchange endpoint yet and no provider app credentials configured. See `WEBAPP-CHANGES-NEEDED.md` for the backend work; provider credentials (Google OAuth client, Apple Services ID, Facebook App ID) still need to be created/provided before this can be wired up for real.
