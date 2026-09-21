# Digital Heroes --- Product Requirements Document

## 1. Product Identity

**Product:** Digital Heroes\
**Domain:** digitalheroes.co.in\
**Document basis:** Digital Heroes PRD (Level 1), Version 1.0, March
2026\
**Product type:** Subscription-driven golf performance, charity, and
monthly draw platform.

The source PRD describes Digital Heroes as a platform that combines golf
performance tracking, charity fundraising, and a monthly draw-based
reward engine. The product should feel emotionally engaging and modern
and should deliberately avoid the visual language of a traditional golf
website.

The PRD is the source of truth for the selection assignment. Where this
document introduces an implementation decision that is not explicitly
specified by the source PRD, it is labeled as an **Implementation
Decision** rather than presented as a source requirement.

------------------------------------------------------------------------

# 2. What We Are Building

We are building a web application where a user can:

1.  Discover the Digital Heroes concept.
2.  Browse charities.
3.  Subscribe to a monthly or yearly plan.
4.  Select a charity and choose a charity contribution percentage.
5.  Enter and maintain their latest five Stableford golf scores.
6.  Participate in monthly prize draws.
7.  See their draw participation and winnings.
8.  If selected as a winner, upload proof of their golf scores.
9.  Track verification and payout status.

Administrators can:

1.  Manage users.
2.  Manage subscriptions.
3.  Edit golf scores where required.
4.  Configure the draw.
5.  Simulate a draw before publishing.
6.  Publish draw results.
7.  Manage charities and charity content.
8.  Review winner proof.
9.  Approve/reject winner verification.
10. Mark payouts as completed.
11. View reports and analytics.

The core product is therefore not simply a golf tracker. It is a
connected system:

**Subscription → Charity Contribution → Score History → Draw Eligibility
→ Draw Result → Winner Verification → Payout → Reporting**

------------------------------------------------------------------------

# 3. Problem We Are Solving

## 3.1 User Problem

The product brings several activities into one experience:

-   Golf performance tracking.
-   Participation in a recurring reward mechanism.
-   Supporting a charity selected by the user.
-   Understanding personal participation and winnings.

The product should make this experience simple rather than forcing users
to manage separate systems.

## 3.2 Platform Problem

The platform must reliably coordinate:

-   subscription status,
-   user access,
-   score rules,
-   charity allocation,
-   draw generation,
-   prize-pool calculation,
-   winner verification,
-   payout status,
-   and administrative reporting.

The main engineering challenge is maintaining correct relationships
between these systems.

## 3.3 Trust Problem

Because money, prizes, charity contributions, and winner verification
are involved, the system must make important state changes traceable and
deterministic.

Examples:

-   A score cannot silently duplicate another score on the same date.
-   Only the latest five scores are retained.
-   Prize percentages must add up correctly.
-   A jackpot must roll over when unclaimed.
-   A winner must be verified before payment is completed.
-   Subscription state must control protected access.

------------------------------------------------------------------------

# 4. Target Users

## 4.1 Public Visitor

A person who has not subscribed.

They need to:

-   understand the platform concept,
-   explore charities,
-   understand draw mechanics,
-   understand the value proposition,
-   start the subscription process.

## 4.2 Registered Subscriber

A paying platform user.

They need to:

-   manage their profile and settings,
-   maintain golf scores,
-   select a charity,
-   manage their charity contribution percentage,
-   participate in draws,
-   see upcoming participation,
-   see winnings,
-   upload winner proof if selected.

## 4.3 Administrator

An operational user with platform-wide access.

They need to:

-   manage users,
-   manage subscriptions,
-   manage scores,
-   configure and run draws,
-   simulate draws,
-   publish results,
-   manage charities,
-   verify winners,
-   manage payouts,
-   inspect analytics.

The PRD defines these three roles and their access boundaries.

------------------------------------------------------------------------

# 5. Core Objectives

The PRD defines six core objectives:

1.  **Subscription** --- robust subscription and payment system.
2.  **Score Entry** --- simple and engaging score-entry experience.
3.  **Custom Draw** --- algorithm-powered or random monthly draws.
4.  **Charity** --- seamless charity contribution logic.
5.  **Admin** --- comprehensive administration tools.
6.  **Design** --- outstanding UI/UX that stands out in the golf
    industry.

------------------------------------------------------------------------

# 6. Subscription & Payment Requirements

## Plans

-   Monthly plan.
-   Yearly plan at a discounted rate.

## Payment Provider

The PRD specifies:

-   Stripe, or
-   another PCI-compliant equivalent.

**Implementation Decision:** Use Stripe unless the project owner
explicitly selects another PCI-compliant provider.

## Access Control

Non-subscribers receive restricted access to platform features.

Authenticated requests should validate current subscription state.

## Subscription Lifecycle

The system must represent at least:

-   active,
-   inactive/lapsed,
-   renewal information,
-   cancellation state.

The exact Stripe webhook/event mapping should be documented during
implementation.

------------------------------------------------------------------------

# 7. Score Management Requirements

Users enter their latest five golf scores in Stableford format.

## Rules

-   Score range: **1--45**.
-   Every score has a date.
-   Only the latest five scores are retained.
-   A new score replaces the oldest retained score when the user already
    has five.
-   Scores display newest first.
-   Only one score is allowed for a given date.
-   An existing score for that date can be edited or deleted.
-   Duplicate score dates are prohibited.

## Example

Stored:

``` text
2026-09-10 → 34
2026-09-05 → 31
2026-08-29 → 37
2026-08-20 → 28
2026-08-12 → 35
```

New score:

``` text
2026-09-15 → 39
```

Result:

``` text
2026-09-15 → 39
2026-09-10 → 34
2026-09-05 → 31
2026-08-29 → 37
2026-08-20 → 28
```

The oldest score is removed.

------------------------------------------------------------------------

# 8. Draw & Reward Requirements

## Draw Types

The PRD supports:

-   5-number match,
-   4-number match,
-   3-number match.

## Draw Logic

Two supported approaches:

### Random

Standard lottery-style random generation.

### Algorithmic

Weighted based on score frequency.

The admin can control which approach is used.

## Draw Operations

-   Monthly cadence.
-   Admin controls publishing.
-   Simulation before publishing.
-   Jackpot rollover if unclaimed.

A draw should have a lifecycle such as:

``` text
DRAFT
→ SIMULATED
→ PUBLISHED
→ SETTLEMENT
→ COMPLETED
```

The exact state names are an implementation decision.

------------------------------------------------------------------------

# 9. Prize Pool Logic

A fixed portion of subscriptions contributes to the prize pool.

The PRD defines:

  Match              Pool Share Rollover
  ---------------- ------------ -----------------
  5-number match            40% Yes --- jackpot
  4-number match            35% No
  3-number match            25% No

Additional rules:

-   Pool tiers are calculated from active subscriber count.
-   Multiple winners in the same tier split that tier equally.
-   The 5-match jackpot carries forward if unclaimed.

## Important Calculation Boundary

The source PRD does not specify the exact monetary percentage of each
subscription that goes into the prize pool.

Therefore:

**Do not invent this percentage.**

Create a configurable platform setting for the prize-pool contribution
percentage until the product owner specifies the actual value.

------------------------------------------------------------------------

# 10. Charity System

Charity is a primary part of the product story.

## Contribution Model

-   User selects a charity during signup.
-   Minimum contribution: **10% of subscription fee**.
-   User may voluntarily increase the charity percentage.
-   Independent donation is supported and is not tied to gameplay.

## Charity Directory

The directory should support:

-   search,
-   filtering,
-   charity listing,
-   description,
-   images,
-   upcoming events such as golf days.

## Homepage

A featured charity section should be available.

------------------------------------------------------------------------

# 11. Winner Verification

Winner verification applies only to winners.

Process:

``` text
Winner Selected
      ↓
Winner Uploads Proof
      ↓
Admin Reviews Proof
      ↓
Approved / Rejected
      ↓
Payment Pending
      ↓
Payment Completed
```

Proof consists of a screenshot of scores from the golf platform.

Payment state:

``` text
Pending → Paid
```

------------------------------------------------------------------------

# 12. User Dashboard

The dashboard must contain:

-   subscription status,
-   active/inactive state,
-   renewal date,
-   score entry/edit interface,
-   selected charity,
-   charity contribution percentage,
-   draws entered,
-   upcoming draws,
-   total winnings,
-   current payment status.

The dashboard should make the user's current state understandable
without requiring them to navigate through many pages.

------------------------------------------------------------------------

# 13. Admin Dashboard

The admin dashboard contains five operational surfaces.

## 13.1 User Management

-   View/edit user profiles.
-   Edit golf scores.
-   Manage subscriptions.

## 13.2 Draw Management

-   Configure draw logic.
-   Select random/algorithmic logic.
-   Run simulations.
-   Publish results.

## 13.3 Charity Management

-   Add charities.
-   Edit charities.
-   Delete/deactivate charities.
-   Manage content and media.

## 13.4 Winner Management

-   View winner list.
-   Verify submissions.
-   Mark payouts as completed.

## 13.5 Reports & Analytics

At minimum:

-   total users,
-   total prize pool,
-   charity contribution totals,
-   draw statistics.

------------------------------------------------------------------------

# 14. UI/UX Requirements

The PRD explicitly says the product should not resemble a traditional
golf website.

## Design Direction

**Desired:**

-   clean,
-   modern,
-   motion-enhanced,
-   emotion-driven,
-   charity-led storytelling.

**Avoid as primary design language:**

-   fairway imagery,
-   plaid,
-   club imagery,
-   traditional golf-site aesthetics.

## Homepage Must Communicate

1.  What users do.
2.  How they win.
3.  Charity impact.
4.  Clear subscription CTA.

## Motion

Use subtle:

-   transitions,
-   micro-interactions,
-   loading states,
-   feedback animations.

The subscription CTA must be prominent.

------------------------------------------------------------------------

# 15. Functional Flow

``` text
PUBLIC VISITOR
   │
   ├── Home
   ├── How It Works
   ├── Charities
   ├── Draw Information
   │
   └── Subscribe
          │
          ▼
       SIGN UP
          │
          ▼
    SELECT PLAN
          │
          ▼
 SELECT CHARITY + %
          │
          ▼
       PAYMENT
          │
          ▼
 ACTIVE SUBSCRIBER
          │
          ├── Profile
          ├── Scores
          ├── Charity
          ├── Draws
          └── Winnings
```

Monthly operational flow:

``` text
Active Subscribers
       ↓
Determine Eligible Participants
       ↓
Calculate Prize Pool
       ↓
Apply Jackpot Rollover
       ↓
Generate Draw
       ↓
Admin Simulation
       ↓
Admin Publish
       ↓
Determine Match Tiers
       ↓
Create Winners
       ↓
Winner Proof Upload
       ↓
Admin Verification
       ↓
Payout
       ↓
Reports
```

------------------------------------------------------------------------

# 16. Non-Functional Requirements

## Accuracy

Financial and draw calculations must be deterministic and testable.

## Security

-   Protected authenticated routes.
-   Admin authorization.
-   Server-side subscription checks.
-   Server-side validation.
-   Secrets only in environment variables.
-   Never expose payment secrets in frontend code.

## Reliability

Important operations should be idempotent where applicable.

Examples:

-   Stripe webhook processing.
-   Draw publishing.
-   Winner settlement.
-   Payout state transitions.

## Responsive Design

The final product must work on:

-   desktop,
-   tablet,
-   mobile.

The PRD explicitly includes responsive design in the testing checklist.

------------------------------------------------------------------------

# 17. Deployment Requirements

The PRD requires:

-   publicly accessible live website,
-   new Vercel account,
-   new Supabase project,
-   correctly configured environment variables,
-   connected backend/database.

**Implementation Decision:** Use Next.js deployed on Vercel and Supabase
for PostgreSQL/auth/storage unless the assignment owner requires another
stack.

------------------------------------------------------------------------

# 18. Mandatory Deliverables

The source PRD requires:

1.  Live website.
2.  Functional user panel.
3.  Functional admin panel.
4.  Connected database with proper schema.
5.  Clean, structured, well-commented source code.
6.  Test credentials.

------------------------------------------------------------------------

# 19. Testing Checklist

The implementation must cover:

-   signup/login,
-   monthly subscription,
-   yearly subscription,
-   rolling five-score logic,
-   duplicate score date prevention,
-   draw simulation,
-   draw publishing,
-   prize calculations,
-   charity selection,
-   charity contribution calculation,
-   winner proof submission,
-   winner verification,
-   payout tracking,
-   user dashboard,
-   admin panel,
-   data accuracy,
-   responsive design,
-   error handling,
-   edge cases.

------------------------------------------------------------------------

# 20. Ambiguities That Must Not Be Invented

The source PRD intentionally leaves some implementation details open.

Do not silently invent:

-   exact subscription prices,
-   exact yearly discount,
-   exact percentage of subscription allocated to prize pool,
-   exact draw number-generation algorithm,
-   exact meaning of "score frequency" weighting,
-   exact payout provider,
-   exact charity payment settlement mechanism,
-   exact winner proof file limits,
-   exact admin role hierarchy beyond administrator,
-   exact notification channels,
-   exact retention/legal policy.

Resolve these as explicit product decisions or configurable settings.

------------------------------------------------------------------------

# 21. Success Criteria

The application is successful when a tester can:

1.  Visit the public website.
2.  Understand the product.
3.  Register.
4.  Select a subscription.
5.  Select a charity.
6.  Complete payment in the configured environment.
7.  Enter five scores.
8.  Confirm rolling score behavior.
9.  Participate in a simulated/published draw.
10. View results.
11. Upload winner proof if selected.
12. Have an admin verify the proof.
13. Track payout state.
14. See accurate dashboard and admin statistics.

The evaluation criteria in the source PRD emphasize requirements
interpretation, system design, UI/UX creativity, data handling,
scalability thinking, and problem-solving.
