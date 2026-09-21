# Digital Heroes --- Project Memory

## 1. Project Identity

**Project:** Digital Heroes\
**Website/domain referenced by PRD:** digitalheroes.co.in\
**Assignment:** Full-stack development trainee selection assignment\
**PRD version:** 1.0\
**PRD date:** March 2026\
**Primary source:** Digital Heroes PRD (Level 1)

The source document describes itself as the single source of truth for
design, development, and evaluation during the trainee selection
process.

------------------------------------------------------------------------

# 2. Product Summary

Digital Heroes is a subscription-driven web platform combining:

1.  golf performance tracking,
2.  monthly draw-based rewards,
3.  charitable giving.

The product should feel emotionally engaging and modern rather than like
a traditional golf website.

------------------------------------------------------------------------

# 3. Target Users

## Public Visitor

Can:

-   understand the platform,
-   browse charities,
-   understand draw mechanics,
-   initiate subscription.

## Registered Subscriber

Can:

-   manage profile/settings,
-   enter/edit golf scores,
-   select charity,
-   choose charity contribution percentage,
-   view participation,
-   view winnings,
-   upload winner proof.

## Administrator

Can:

-   manage users,
-   manage subscriptions,
-   edit scores,
-   configure draws,
-   simulate draws,
-   publish draws,
-   manage charities,
-   verify winners,
-   manage payouts,
-   view reports.

------------------------------------------------------------------------

# 4. Core Product Loop

``` text
Subscribe
   ↓
Select Charity
   ↓
Enter Scores
   ↓
Participate in Monthly Draw
   ↓
Possible Win
   ↓
Upload Proof
   ↓
Admin Verification
   ↓
Payout
```

------------------------------------------------------------------------

# 5. Hard Business Rules

## Scores

``` text
Range: 1–45
Format: Stableford
Maximum retained: 5
Duplicate date per user: prohibited
Ordering: newest first
Sixth score: replaces oldest
```

## Charity

``` text
Minimum contribution: 10%
User can voluntarily increase percentage
Independent donation exists separately
```

## Prize Pool

``` text
5-number match: 40%
4-number match: 35%
3-number match: 25%
```

Rollover:

``` text
5-match: yes
4-match: no
3-match: no
```

Multiple winners:

``` text
tier pool / number of winners
```

------------------------------------------------------------------------

# 6. Important Undefined Rules

Do not invent these without explicit product approval:

-   subscription price,
-   annual discount,
-   subscription revenue percentage allocated to prize pool,
-   exact weighted algorithm,
-   exact draw number-generation mechanism,
-   exact payout provider/process,
-   exact donation settlement,
-   proof file limits,
-   notification strategy,
-   legal/retention rules.

These should be tracked as open questions or configurable settings.

------------------------------------------------------------------------

# 7. Current Architecture Decision

Recommended implementation:

``` text
Next.js
TypeScript
React
Supabase PostgreSQL
Supabase Auth
Supabase Storage
Stripe
Vercel
```

Supporting libraries:

``` text
Zod
React Hook Form
Framer Motion
date-fns
Vitest
React Testing Library
Playwright
```

Styling:

``` text
CSS Modules / standard CSS
```

------------------------------------------------------------------------

# 8. Architecture Style

Use a modular monolith.

``` text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Data
```

Do not introduce microservices unless scale or a concrete requirement
demands them.

------------------------------------------------------------------------

# 9. Main Domains

``` text
Authentication
Profiles
Subscriptions
Scores
Charities
Draws
Prize Pools
Winners
Proofs
Payouts
Reports
Administration
```

------------------------------------------------------------------------

# 10. Main Data Entities

``` text
profiles
subscriptions
subscription_events
charities
charity_selections
scores
draws
draw_configurations
draw_participants
draw_results
prize_pools
winners
winner_proofs
payouts
admin_actions
platform_settings
```

------------------------------------------------------------------------

# 11. User Flow Memory

Public:

``` text
Home
→ How It Works
→ Charities
→ Draws
→ Subscribe
→ Signup
→ Plan
→ Charity
→ Payment
→ Dashboard
```

Subscriber:

``` text
Dashboard
├── Subscription
├── Scores
├── Charity
├── Draws
├── Winnings
└── Settings
```

Admin:

``` text
Admin
├── Overview
├── Users
├── Subscriptions
├── Scores
├── Draws
├── Charities
├── Winners
└── Reports
```

------------------------------------------------------------------------

# 12. Draw Memory

Draw lifecycle should be treated as:

``` text
Draft
→ Simulated
→ Published
→ Settlement
→ Completed
```

Simulation must not:

-   create final production winners,
-   trigger payouts,
-   permanently mutate production result state.

Publishing must be explicit and protected.

After publishing, results must not silently change.

------------------------------------------------------------------------

# 13. Payment Memory

Payment lifecycle:

``` text
User
 ↓
Checkout
 ↓
Stripe
 ↓
Webhook
 ↓
Verify event
 ↓
Persist subscription
 ↓
Grant access
```

Frontend payment success is not authoritative.

Webhook verification is required.

Webhook processing should be idempotent.

------------------------------------------------------------------------

# 14. Winner Memory

``` text
Winner Selected
 ↓
Proof Required
 ↓
Screenshot Uploaded
 ↓
Admin Review
 ↓
Approved / Rejected
 ↓
Pending
 ↓
Paid
```

Proof should be protected.

------------------------------------------------------------------------

# 15. UI Memory

The product should communicate:

-   charity impact first,
-   modern experience,
-   simple participation,
-   transparent draw mechanics.

Avoid traditional golf-site aesthetics.

Avoid using:

-   fairways,
-   plaid,
-   golf clubs

as the primary design language.

Use subtle motion and micro-interactions.

------------------------------------------------------------------------

# 16. Deployment Memory

Required by the PRD:

-   live public website,
-   new Vercel account,
-   new Supabase project,
-   configured environment variables,
-   connected backend/database,
-   test credentials.

------------------------------------------------------------------------

# 17. Environment Memory

Expected variables:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=
```

Never commit secrets.

------------------------------------------------------------------------

# 18. Security Memory

Always enforce:

``` text
Authentication
+
Authorization
+
Validation
+
Business rules
```

Never trust client-provided:

-   user role,
-   user ID for ownership-sensitive actions,
-   subscription status,
-   prize amount,
-   winner state.

------------------------------------------------------------------------

# 19. Testing Memory

Important tests:

### Score

-   1 score,
-   5 scores,
-   6th score,
-   duplicate date,
-   invalid score,
-   edit,
-   delete.

### Draw

-   3-match,
-   4-match,
-   5-match,
-   multiple winners,
-   no 5-match winner,
-   jackpot rollover,
-   simulation,
-   publish,
-   duplicate publish.

### Subscription

-   active,
-   inactive,
-   cancelled,
-   failed payment.

### Winner

-   proof upload,
-   invalid proof,
-   admin approval,
-   rejection,
-   payout.

------------------------------------------------------------------------

# 20. Current Open Questions

Track these before production:

  Question                                    Status
  ------------------------------------------- --------
  Monthly price                               Open
  Yearly price                                Open
  Yearly discount                             Open
  Prize-pool contribution from subscription   Open
  Exact random draw method                    Open
  Algorithmic weighting formula               Open
  Payment/payout method                       Open
  Charity settlement process                  Open
  Winner proof constraints                    Open
  Notifications                               Open
  Legal/compliance requirements               Open

Do not convert these into assumptions.

------------------------------------------------------------------------

# 21. Documentation Rules

When changing:

-   business logic → update `prd.md` and `memory.md`,
-   architecture → update `architecture.md` and `memory.md`,
-   AI behavior → update `rules.md`,
-   task status → update `tasks.md`.

Keep documents synchronized.

------------------------------------------------------------------------

# 22. AI Working Context

The AI should remember:

1.  Digital Heroes is not merely a CRUD golf application.
2.  Subscription, charity, draw, prize, verification, and payout are
    connected domains.
3.  Money calculations require exact handling.
4.  Draw results require controlled state transitions.
5.  Admin actions require authorization and auditability.
6.  Ambiguous business rules must not be invented.
7.  The UI should lead with emotional/charity impact rather than golf
    clichés.
8.  The product must be responsive.
9.  The final deployment has specific Vercel/Supabase constraints.

------------------------------------------------------------------------

# 23. Final Product Definition

The finished application should allow a real tester to move through:

``` text
PUBLIC
  ↓
SIGNUP
  ↓
SUBSCRIPTION
  ↓
CHARITY
  ↓
SCORES
  ↓
DRAW
  ↓
RESULT
  ↓
WINNER VERIFICATION
  ↓
PAYOUT
```

while an administrator can control:

``` text
USERS
SUBSCRIPTIONS
SCORES
CHARITIES
DRAWS
WINNERS
PAYOUTS
REPORTS
```

The implementation should remain modular enough that individual domains
can be tested and changed without rewriting the whole application.
