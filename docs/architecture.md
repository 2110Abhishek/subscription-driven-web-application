# Digital Heroes --- Architecture

## 1. Architecture Goal

Build a maintainable full-stack system where subscription, scoring,
charity, draw, winner verification, and administration are separated
into clear modules while sharing a single reliable data model.

The architecture must make financial and draw-related operations
auditable and testable.

------------------------------------------------------------------------

# 2. Recommended Tech Stack

These are implementation decisions, not direct requirements of the
source PRD.

  Layer            Technology
  ---------------- ---------------------------------------------
  Framework        Next.js + TypeScript
  UI               React
  Styling          CSS Modules / plain CSS
  UI animation     Framer Motion
  Backend API      Next.js Route Handlers / Server Actions
  Database         Supabase PostgreSQL
  Authentication   Supabase Auth
  Storage          Supabase Storage
  Payments         Stripe
  Validation       Zod
  Forms            React Hook Form
  Date handling    date-fns
  Testing          Vitest + React Testing Library + Playwright
  Deployment       Vercel
  Source control   Git + GitHub

### Why this stack

The PRD explicitly requires a new Vercel account and a new Supabase
project, and gives Supabase as an example backend/database. The
architecture therefore uses Next.js + Supabase as the primary
implementation.

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│                                                     │
│  Public UI │ Auth │ User Dashboard │ Admin Panel   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Next.js Application                │
│                                                     │
│ UI Components                                       │
│ Server Components                                   │
│ Route Handlers / Server Actions                     │
│ Middleware / Authorization                          │
│ Domain Services                                     │
└───────────────┬─────────────┬───────────────┬──────┘
                │             │               │
                ▼             ▼               ▼
        ┌────────────┐ ┌────────────┐ ┌─────────────┐
        │ Supabase   │ │   Stripe   │ │ Supabase    │
        │ PostgreSQL │ │ Payments   │ │ Storage     │
        └────────────┘ └────────────┘ └─────────────┘
```

------------------------------------------------------------------------

# 4. Application Layers

## Layer 1 --- Presentation

Responsibilities:

-   pages,
-   layouts,
-   components,
-   forms,
-   tables,
-   cards,
-   loading states,
-   error states,
-   responsive UI,
-   animations.

The presentation layer must not contain financial or draw business
logic.

## Layer 2 --- Application

Responsibilities:

-   coordinate use cases,
-   validate input,
-   check authorization,
-   call domain services,
-   return predictable results.

Examples:

``` text
createSubscription()
addScore()
updateScore()
deleteScore()
selectCharity()
simulateDraw()
publishDraw()
submitWinnerProof()
verifyWinner()
markPayoutPaid()
```

## Layer 3 --- Domain

Contains business rules:

-   five-score rolling rule,
-   duplicate-date rule,
-   score range,
-   draw matching,
-   prize distribution,
-   jackpot rollover,
-   charity percentage validation,
-   winner state transitions.

Business logic should be testable without rendering React.

## Layer 4 --- Data

Responsibilities:

-   Supabase queries,
-   transactions where supported,
-   database functions/RPC where appropriate,
-   storage access,
-   Stripe persistence.

------------------------------------------------------------------------

# 5. Folder Structure

``` text
digital-heroes/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── how-it-works/
│   │   │   └── page.tsx
│   │   ├── charities/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── draws/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── scores/
│   │   │   └── page.tsx
│   │   ├── charity/
│   │   │   └── page.tsx
│   │   ├── draws/
│   │   │   └── page.tsx
│   │   ├── winnings/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── subscriptions/
│   │   │   └── page.tsx
│   │   ├── draws/
│   │   │   └── page.tsx
│   │   ├── charities/
│   │   │   └── page.tsx
│   │   ├── winners/
│   │   │   └── page.tsx
│   │   └── reports/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── stripe/
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   ├── scores/
│   │   ├── charities/
│   │   ├── draws/
│   │   ├── winners/
│   │   └── admin/
│   │
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── public/
│   ├── dashboard/
│   ├── admin/
│   ├── scores/
│   ├── charities/
│   ├── draws/
│   └── winners/
│
├── domain/
│   ├── scores/
│   │   ├── score.rules.ts
│   │   ├── score.service.ts
│   │   └── score.types.ts
│   ├── draws/
│   │   ├── draw.rules.ts
│   │   ├── draw.service.ts
│   │   ├── draw.engine.ts
│   │   └── draw.types.ts
│   ├── prizes/
│   │   ├── prize.service.ts
│   │   └── prize.types.ts
│   ├── charity/
│   │   ├── charity.rules.ts
│   │   └── charity.service.ts
│   ├── winners/
│   │   ├── winner.service.ts
│   │   └── winner.types.ts
│   └── subscriptions/
│       ├── subscription.service.ts
│       └── subscription.types.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth/
│   │   └── permissions.ts
│   ├── validation/
│   │   └── schemas.ts
│   ├── errors/
│   │   └── app-error.ts
│   └── utils/
│
├── hooks/
├── types/
├── constants/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.example
├── middleware.ts
├── next.config.ts
├── package.json
└── README.md
```

------------------------------------------------------------------------

# 6. Data Model

Recommended core entities:

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

## Relationships

``` text
User
 ├── Profile
 ├── Subscription(s)
 ├── Scores (max 5 retained)
 ├── Charity Selection
 ├── Draw Participation
 └── Winners

Charity
 └── Charity Selections

Draw
 ├── Participants
 ├── Configuration
 ├── Prize Pool
 ├── Results
 └── Winners

Winner
 ├── Proof
 └── Payout
```

------------------------------------------------------------------------

# 7. Authentication Flow

``` text
Signup
  ↓
Supabase Auth user
  ↓
Create profile
  ↓
Select plan
  ↓
Select charity + percentage
  ↓
Stripe checkout
  ↓
Stripe webhook
  ↓
Subscription record becomes active
  ↓
Protected dashboard access
```

Authentication and authorization are separate concerns.

A logged-in user is not automatically an admin.

------------------------------------------------------------------------

# 8. Authorization

## Public

Can access:

-   homepage,
-   charity directory,
-   charity profiles,
-   draw explanation,
-   signup/login.

## Subscriber

Can access:

-   own profile,
-   own scores,
-   own charity selection,
-   own draws,
-   own winnings,
-   winner proof upload when eligible.

## Admin

Can access:

-   users,
-   subscriptions,
-   scores,
-   charities,
-   draw management,
-   winner verification,
-   reports.

Authorization must be enforced server-side.

------------------------------------------------------------------------

# 9. Score Flow

``` text
User submits score
        ↓
Validate date
        ↓
Validate 1–45
        ↓
Check duplicate date
        ↓
Save/update score
        ↓
Count user's retained scores
        ↓
If > 5:
    remove oldest
        ↓
Return scores newest-first
```

The database should also enforce uniqueness on:

``` text
(user_id, score_date)
```

where technically appropriate.

------------------------------------------------------------------------

# 10. Draw Architecture

Draw generation should be isolated from UI.

``` text
Draw Configuration
       ↓
Eligible Subscribers
       ↓
Participant Snapshot
       ↓
Prize Pool Calculation
       ↓
Number Generation
       ↓
Match Evaluation
       ↓
Tier Allocation
       ↓
Winner Records
       ↓
Simulation Result
       ↓
Admin Publish
```

A simulation must not accidentally create production winners or
payments.

Publishing should be an explicit action.

------------------------------------------------------------------------

# 11. Prize Calculation

Given:

``` text
total_prize_pool
```

calculate:

``` text
five_match_pool = total_prize_pool × 0.40
four_match_pool = total_prize_pool × 0.35
three_match_pool = total_prize_pool × 0.25
```

For each tier:

``` text
individual_prize =
tier_pool / number_of_winners
```

For the five-match tier:

``` text
if winners == 0:
    carry forward jackpot
else:
    distribute jackpot
```

Do not use floating-point arithmetic for monetary values.

**Implementation Decision:** Store money as integer minor units,
e.g. paise/cents.

------------------------------------------------------------------------

# 12. Charity Calculation

``` text
charity_percentage >= 10%
```

The selected percentage is applied to the subscription amount according
to the configured billing model.

The exact accounting/settlement model must remain configurable because
the PRD does not specify the complete payment settlement mechanism.

------------------------------------------------------------------------

# 13. Stripe Integration

``` text
Frontend
   ↓
Create checkout session
   ↓
Stripe Checkout
   ↓
Stripe payment
   ↓
Stripe webhook
   ↓
Verify webhook signature
   ↓
Update subscription
   ↓
Update user access
```

Never make the browser the source of truth for successful payment.

The webhook is the authoritative payment event source.

------------------------------------------------------------------------

# 14. Winner Flow

``` text
Draw Published
    ↓
Winner Created
    ↓
Winner notified/displayed
    ↓
Winner uploads screenshot
    ↓
Proof stored in Supabase Storage
    ↓
Admin reviews
    ├── Reject → winner remains unresolved
    └── Approve
           ↓
       Payment Pending
           ↓
       Payment Completed
```

------------------------------------------------------------------------

# 15. Error Architecture

All application errors should have:

``` text
code
message
status
optional metadata
```

Example:

``` text
SCORE_DATE_DUPLICATE
SCORE_OUT_OF_RANGE
SUBSCRIPTION_INACTIVE
DRAW_ALREADY_PUBLISHED
DRAW_NOT_READY
WINNER_PROOF_REQUIRED
WINNER_ALREADY_VERIFIED
UNAUTHORIZED
FORBIDDEN
```

Frontend should show human-readable messages while logs retain technical
context.

------------------------------------------------------------------------

# 16. Environment Variables

Example:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=
```

Never commit `.env.local`.

Never expose service-role or secret payment keys to the client.

------------------------------------------------------------------------

# 17. Deployment Architecture

``` text
GitHub
   ↓
Vercel
   ↓
Next.js Application
   │
   ├── Supabase Auth
   ├── Supabase PostgreSQL
   ├── Supabase Storage
   └── Stripe
```

Required deployment constraints from the PRD:

-   new Vercel account,
-   new Supabase project,
-   environment variables configured correctly.

------------------------------------------------------------------------

# 18. Scalability

Initial architecture should remain simple.

Avoid introducing unnecessary:

-   microservices,
-   queues,
-   Redis,
-   Kubernetes,
-   separate backend servers.

The product can start as a modular monolith.

If scale later requires it, draw execution and payment processing can be
extracted into background jobs without rewriting the domain layer.

------------------------------------------------------------------------

# 19. Source of Truth

For each domain:

  Domain                Source of truth
  --------------------- ---------------------------------------
  Authentication        Supabase Auth
  User profile          PostgreSQL
  Subscription state    Stripe events persisted in PostgreSQL
  Scores                PostgreSQL
  Charity               PostgreSQL
  Draw configuration    PostgreSQL
  Draw result           PostgreSQL
  Winner verification   PostgreSQL
  Proof file            Supabase Storage
  Payment event         Stripe webhook + PostgreSQL record
