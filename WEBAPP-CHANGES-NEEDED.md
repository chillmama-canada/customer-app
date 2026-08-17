# Webapp changes needed (triggered by Customer App development)

Since the Customer App shares the `chillmama-Webapp` database and backend, some Customer App work will require changes on the webapp side. Track those here as they come up, so they don't get lost or forgotten when work eventually happens in that repo (on a different machine/session). When Claude Code (in this repo) identifies a needed webapp-side change, it should add an entry here with enough context to hand off cleanly — assume whoever picks it up won't have this conversation's context.

**Workflow reminder**: this file lives in the customer-app repo (where the need is discovered), but the actual work happens in the `chillmama-Webapp` repo. When you're ready to act on an item, copy it into that repo's own `CLAUDE.md` or open a tracked issue there, then mark it "In progress" here.

## Needed

- **`/api/mobile/auth/*` endpoints** — register, login, refresh (JWT-based, not session-cookie-based) so the Customer App can authenticate against the same `Customer`/`Helper` tables the webapp's NextAuth already uses. Currently these routes don't exist yet (webapp README reserves `/api/mobile/` for "Phase 4," now becoming relevant sooner).
- **Verify/add `language` field on Helper profiles** — needed for the Customer App's recommendation filtering (e.g. "prefer Cantonese-speaking helper"). Check the current Prisma schema — if it doesn't exist, this is a schema migration on the webapp side first.
- **Verify queryable "completed jobs count" on Helper** — needed for recommendation filtering (e.g. "at least 10 jobs completed"). Confirm whether this already exists as a field/computed value, or needs to be added.
- **General `/api/mobile/` read endpoints** — helpers search/filter, bookings CRUD, reviews — needed for the Customer App's core recommendation and booking flows. Scope these out once the Customer App's data-fetching layer is being built.

## In progress

*(none yet)*

## Done

*(none yet)*
