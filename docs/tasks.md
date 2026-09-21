# Digital Heroes --- Development Tasks

## 0. How to Use This File

Build in small vertical increments.

Each task should:

-   have a clear outcome,
-   be independently testable,
-   avoid unnecessary refactoring,
-   update documentation when needed.

Do not jump directly to the final UI before the core data and business
rules are stable.

------------------------------------------------------------------------

# Phase 1 --- Project Foundation

## T001 --- Create repository

**Goal:** Create Git repository.

Tasks:

-   initialize repository,
-   add `.gitignore`,
-   add README,
-   create initial commit.

Done when:

-   repository builds,
-   secrets are excluded.

------------------------------------------------------------------------

## T002 --- Initialize Next.js

Tasks:

-   create Next.js TypeScript project,
-   configure App Router,
-   configure linting,
-   verify local build.

Done when:

``` text
npm run dev
npm run build
```

work.

------------------------------------------------------------------------

## T003 --- Configure base styling

Tasks:

-   create global CSS,
-   typography system,
-   spacing tokens,
-   border radius tokens,
-   shadows,
-   responsive breakpoints.

Avoid implementing complete pages yet.

------------------------------------------------------------------------

## T004 --- Configure Supabase

Tasks:

-   create new Supabase project,
-   configure environment variables,
-   create browser/server clients,
-   test database connection.

------------------------------------------------------------------------

## T005 --- Configure Stripe

Tasks:

-   create Stripe test configuration,
-   add environment variables,
-   create server Stripe client,
-   verify API connection.

------------------------------------------------------------------------

# Phase 2 --- Database

## T006 --- Create profiles table

Fields should include the minimum required profile identity data.

Add role:

``` text
subscriber
admin
```

Do not allow users to self-promote to admin.

------------------------------------------------------------------------

## T007 --- Create subscriptions table

Track:

-   user,
-   provider,
-   provider subscription ID,
-   plan,
-   status,
-   renewal/cancellation information.

------------------------------------------------------------------------

## T008 --- Create charities table

Track:

-   name,
-   slug,
-   description,
-   image,
-   events,
-   active status.

------------------------------------------------------------------------

## T009 --- Create charity selections

Track:

-   user,
-   charity,
-   contribution percentage,
-   effective period.

------------------------------------------------------------------------

## T010 --- Create scores table

Enforce:

-   user relationship,
-   score 1--45,
-   score date,
-   duplicate date prevention.

------------------------------------------------------------------------

## T011 --- Create draw tables

Create entities for:

-   draws,
-   configuration,
-   participants,
-   results,
-   prize pools.

------------------------------------------------------------------------

## T012 --- Create winner tables

Create:

-   winners,
-   proof submissions,
-   payouts.

------------------------------------------------------------------------

## T013 --- Create audit records

Track important admin operations.

Examples:

-   draw simulation,
-   draw publication,
-   winner verification,
-   payout completion.

------------------------------------------------------------------------

## T014 --- Seed development data

Add safe fake data for:

-   charities,
-   users,
-   sample draws.

Never seed fake production winners or payments.

------------------------------------------------------------------------

# Phase 3 --- Authentication

## T015 --- Signup

Implement:

-   email/password or configured auth method,
-   profile creation,
-   validation.

------------------------------------------------------------------------

## T016 --- Login

Implement:

-   login,
-   session persistence,
-   error states.

------------------------------------------------------------------------

## T017 --- Logout

Implement:

-   logout,
-   redirect,
-   session cleanup.

------------------------------------------------------------------------

## T018 --- Protected routes

Protect:

``` text
/dashboard/*
/admin/*
```

------------------------------------------------------------------------

## T019 --- Admin authorization

Verify role server-side.

Test:

-   subscriber cannot access admin,
-   admin can access admin.

------------------------------------------------------------------------

# Phase 4 --- Public Website

## T020 --- Homepage

Homepage must explain:

-   what Digital Heroes is,
-   what users do,
-   how they win,
-   charity impact,
-   subscription CTA.

------------------------------------------------------------------------

## T021 --- How It Works

Explain:

``` text
Subscribe
→ Select Charity
→ Add Scores
→ Enter Draw
→ Win
→ Verify
→ Get Paid
```

------------------------------------------------------------------------

## T022 --- Charity Directory

Implement:

-   listing,
-   search,
-   filtering.

------------------------------------------------------------------------

## T023 --- Charity Details

Implement:

-   description,
-   image,
-   upcoming events.

------------------------------------------------------------------------

## T024 --- Draw Information

Explain:

-   3-number,
-   4-number,
-   5-number,
-   prize distribution,
-   jackpot rollover.

------------------------------------------------------------------------

# Phase 5 --- Subscription

## T025 --- Plan selection

Create:

-   monthly plan,
-   yearly plan.

Do not hard-code prices in business logic.

------------------------------------------------------------------------

## T026 --- Charity selection during signup

Implement:

-   required charity selection,
-   minimum 10% contribution,
-   increase option.

------------------------------------------------------------------------

## T027 --- Stripe checkout

Implement:

-   checkout session,
-   success state,
-   cancellation state.

------------------------------------------------------------------------

## T028 --- Stripe webhook

Handle relevant events.

Requirements:

-   verify signature,
-   idempotency,
-   update subscription state.

------------------------------------------------------------------------

## T029 --- Subscription access guard

Implement server-side active subscription checks.

Test:

-   active subscriber,
-   lapsed subscriber,
-   non-subscriber.

------------------------------------------------------------------------

# Phase 6 --- Score System

## T030 --- Score input form

Fields:

-   date,
-   Stableford score.

Validation:

``` text
1 ≤ score ≤ 45
```

------------------------------------------------------------------------

## T031 --- Duplicate date prevention

Reject:

``` text
same user + same date
```

unless editing existing record.

------------------------------------------------------------------------

## T032 --- Edit score

Allow editing an existing score.

------------------------------------------------------------------------

## T033 --- Delete score

Allow deletion.

------------------------------------------------------------------------

## T034 --- Five-score rolling logic

When adding the sixth retained score:

-   identify oldest,
-   remove it,
-   retain five newest.

------------------------------------------------------------------------

## T035 --- Score history UI

Display newest first.

------------------------------------------------------------------------

## T036 --- Score tests

Test:

-   first score,
-   five scores,
-   sixth score,
-   duplicate date,
-   invalid score,
-   edit,
-   delete.

------------------------------------------------------------------------

# Phase 7 --- Charity

## T037 --- Charity selection page

Allow subscriber to view/select charity.

------------------------------------------------------------------------

## T038 --- Contribution percentage

Implement:

``` text
minimum = 10%
```

Allow increase.

------------------------------------------------------------------------

## T039 --- Charity totals

Create calculations for admin reporting.

------------------------------------------------------------------------

# Phase 8 --- Draw Engine

## T040 --- Draw configuration model

Support:

-   draw date,
-   draw type,
-   logic type,
-   prize configuration,
-   status.

------------------------------------------------------------------------

## T041 --- Participant selection

Determine eligible active subscribers.

Create a participant snapshot for the draw.

------------------------------------------------------------------------

## T042 --- Prize pool calculation

Implement:

``` text
5 match = 40%
4 match = 35%
3 match = 25%
```

Keep subscription-to-prize-pool contribution configurable.

------------------------------------------------------------------------

## T043 --- Random draw engine

Implement isolated random draw logic.

Do not use `Math.random()` for a production real-money draw without
explicit approval.

------------------------------------------------------------------------

## T044 --- Algorithmic draw engine

Implement weighted score-frequency logic only after the exact weighting
definition is approved.

------------------------------------------------------------------------

## T045 --- Match evaluator

Determine:

-   5-match,
-   4-match,
-   3-match.

------------------------------------------------------------------------

## T046 --- Winner splitting

If multiple winners exist:

``` text
tier pool / winner count
```

------------------------------------------------------------------------

## T047 --- Jackpot rollover

If no 5-match winner:

``` text
unclaimed jackpot
→ next draw jackpot
```

------------------------------------------------------------------------

## T048 --- Draw simulation

Simulation must:

-   use selected configuration,
-   show predicted outcome,
-   not create final winners,
-   not trigger payouts.

------------------------------------------------------------------------

## T049 --- Draw publication

Publishing:

-   freezes result,
-   creates final winners,
-   creates prize allocation,
-   prevents accidental duplicate publishing.

------------------------------------------------------------------------

## T050 --- Draw tests

Test:

-   no winners,
-   one winner,
-   multiple winners,
-   jackpot rollover,
-   tier calculation,
-   repeated publish attempt.

------------------------------------------------------------------------

# Phase 9 --- User Dashboard

## T051 --- Dashboard shell

Create:

-   navigation,
-   header,
-   responsive layout.

------------------------------------------------------------------------

## T052 --- Subscription card

Show:

-   active/inactive,
-   renewal date.

------------------------------------------------------------------------

## T053 --- Score module

Show:

-   five scores,
-   add/edit/delete.

------------------------------------------------------------------------

## T054 --- Charity module

Show:

-   selected charity,
-   contribution percentage.

------------------------------------------------------------------------

## T055 --- Draw module

Show:

-   draws entered,
-   upcoming draws,
-   results.

------------------------------------------------------------------------

## T056 --- Winnings module

Show:

-   total winnings,
-   payment state.

------------------------------------------------------------------------

# Phase 10 --- Winner Verification

## T057 --- Winner page

Show winner state and required action.

------------------------------------------------------------------------

## T058 --- Proof upload

Allow screenshot upload.

Validate:

-   file type,
-   size,
-   authenticated ownership,
-   winner eligibility.

------------------------------------------------------------------------

## T059 --- Storage

Store proof in private/protected storage.

------------------------------------------------------------------------

## T060 --- Admin review

Admin can:

-   inspect proof,
-   approve,
-   reject.

------------------------------------------------------------------------

## T061 --- Payout status

Implement:

``` text
Pending
Paid
```

Admin can mark payout completed.

------------------------------------------------------------------------

# Phase 11 --- Admin

## T062 --- Admin dashboard

Show:

-   users,
-   prize pool,
-   charity totals,
-   draw statistics.

------------------------------------------------------------------------

## T063 --- User management

Implement:

-   list,
-   search,
-   profile view,
-   edit,
-   subscription view.

------------------------------------------------------------------------

## T064 --- Score management

Allow authorized admin editing.

------------------------------------------------------------------------

## T065 --- Subscription management

Show subscription state and provider metadata safely.

------------------------------------------------------------------------

## T066 --- Charity management

Implement:

-   add,
-   edit,
-   deactivate/delete according to data safety policy,
-   media.

------------------------------------------------------------------------

## T067 --- Draw management

Implement:

-   configuration,
-   simulation,
-   publish,
-   history.

------------------------------------------------------------------------

## T068 --- Winner management

Implement:

-   winners list,
-   proof review,
-   verification,
-   payout.

------------------------------------------------------------------------

## T069 --- Reports

Implement:

-   total users,
-   prize pool,
-   charity totals,
-   draw statistics.

------------------------------------------------------------------------

# Phase 12 --- UI Polish

## T070 --- Design system

Create reusable:

-   Button,
-   Input,
-   Select,
-   Modal,
-   Card,
-   Table,
-   Badge,
-   Toast,
-   EmptyState,
-   Skeleton,
-   ConfirmDialog.

------------------------------------------------------------------------

## T071 --- Motion

Add subtle:

-   page transitions,
-   card transitions,
-   form feedback,
-   loading states.

------------------------------------------------------------------------

## T072 --- Responsive layout

Test:

-   mobile,
-   tablet,
-   desktop.

------------------------------------------------------------------------

## T073 --- Accessibility

Check:

-   keyboard,
-   labels,
-   focus,
-   contrast,
-   error messaging.

------------------------------------------------------------------------

# Phase 13 --- Testing

## T074 --- Unit tests

Cover domain logic.

------------------------------------------------------------------------

## T075 --- Integration tests

Cover:

-   auth,
-   database,
-   subscription,
-   score,
-   draw.

------------------------------------------------------------------------

## T076 --- E2E tests

Cover critical user journeys.

------------------------------------------------------------------------

## T077 --- Edge-case testing

Test:

-   expired subscription,
-   duplicate score date,
-   invalid score,
-   no draw winners,
-   multiple winners,
-   repeated publishing,
-   rejected proof,
-   missing charity,
-   failed payment.

------------------------------------------------------------------------

# Phase 14 --- Security

## T078 --- Authorization audit

Verify every protected operation.

------------------------------------------------------------------------

## T079 --- Input validation audit

Verify server-side validation.

------------------------------------------------------------------------

## T080 --- Secret audit

Search repository for accidental secrets.

------------------------------------------------------------------------

## T081 --- Storage security

Verify winner proof is not publicly accessible without authorization.

------------------------------------------------------------------------

# Phase 15 --- Deployment

## T082 --- Production Supabase

Create new required project.

------------------------------------------------------------------------

## T083 --- Production Vercel

Deploy to new required account.

------------------------------------------------------------------------

## T084 --- Environment variables

Configure production secrets.

------------------------------------------------------------------------

## T085 --- Stripe production/test mode decision

Confirm the environment before accepting real payments.

------------------------------------------------------------------------

## T086 --- Smoke testing

Test:

-   homepage,
-   signup,
-   login,
-   subscription,
-   scores,
-   dashboard,
-   admin,
-   draw,
-   winner flow.

------------------------------------------------------------------------

# Phase 16 --- Final Submission

## T087 --- Test credentials

Prepare:

-   subscriber account,
-   admin account.

Never expose real secrets in documentation.

------------------------------------------------------------------------

## T088 --- README

Document:

-   setup,
-   environment variables,
-   database migration,
-   deployment,
-   test accounts,
-   architecture.

------------------------------------------------------------------------

## T089 --- Final PRD checklist

Verify every PRD requirement.

------------------------------------------------------------------------

## T090 --- Final build

Run:

``` text
lint
typecheck
test
build
```

------------------------------------------------------------------------

## T091 --- Final responsive test

Check desktop and mobile.

------------------------------------------------------------------------

## T092 --- Final handoff

Deliver:

-   live URL,
-   source code,
-   credentials,
-   database,
-   documentation.
