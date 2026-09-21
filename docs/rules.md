# Digital Heroes --- AI Rules

## 1. Purpose

This file is the rule book for any AI coding assistant working on
Digital Heroes.

The AI must treat the project requirements as a specification, not as a
suggestion.

The AI must not silently change business rules.

------------------------------------------------------------------------

# 2. Source of Truth

Priority order:

1.  Current user/developer instruction.
2.  `prd.md`.
3.  `architecture.md`.
4.  `rules.md`.
5.  `tasks.md`.
6.  `memory.md`.
7.  Existing implementation.

If existing code conflicts with the PRD, do not blindly preserve the
code.

Identify the conflict and fix it according to the higher-priority
requirement.

------------------------------------------------------------------------

# 3. What AI Must Do

Before implementing a feature:

1.  Read the relevant PRD requirement.
2.  Check architecture.
3.  Check existing code.
4.  Check current task.
5.  Identify dependencies.
6.  Implement the smallest correct change.
7.  Validate the result.
8.  Update documentation when architecture or behavior changes.

For business-critical features, add tests.

------------------------------------------------------------------------

# 4. What AI Must Avoid

Never:

-   invent missing business rules,
-   change financial percentages without approval,
-   change score rules,
-   silently modify draw logic,
-   expose secrets,
-   put server secrets in client components,
-   bypass authorization,
-   trust frontend payment success,
-   generate fake production data,
-   delete existing working code without understanding it,
-   introduce a new library for a trivial problem,
-   rewrite the entire application to solve a small bug,
-   mix unrelated refactoring into a feature task,
-   use mock data in production paths,
-   silently change database schema without a migration.

------------------------------------------------------------------------

# 5. Required Technology

Preferred implementation:

-   Next.js
-   TypeScript
-   React
-   Supabase
-   PostgreSQL
-   Stripe
-   Zod
-   React Hook Form
-   Framer Motion
-   date-fns
-   Vitest
-   React Testing Library
-   Playwright

Styling:

-   CSS Modules / standard CSS.

Do not introduce Tailwind unless explicitly requested.

------------------------------------------------------------------------

# 6. Library Rules

## Use existing libraries first

Before adding a dependency, ask:

1.  Is this already available?
2.  Can native TypeScript/JavaScript solve it cleanly?
3.  Does the feature justify a dependency?
4.  Is the dependency maintained and compatible with the project?

Avoid dependency bloat.

## Validation

Use Zod for shared input validation where practical.

## Forms

Use React Hook Form for complex forms.

## Animation

Use Framer Motion for meaningful UI motion, not excessive animation.

## Dates

Use date-fns for date manipulation.

Do not manually manipulate date strings with fragile string arithmetic.

------------------------------------------------------------------------

# 7. React Rules

Prefer server components where server rendering is useful.

Use client components only when needed for:

-   browser interaction,
-   state,
-   event handlers,
-   animations,
-   client-only APIs.

Do not turn the entire application into client-side rendering
unnecessarily.

------------------------------------------------------------------------

# 8. API Rules

Every protected API must verify:

1.  authentication,
2.  authorization,
3.  input validation,
4.  business constraints.

Example:

``` text
request
 ↓
authenticate
 ↓
authorize
 ↓
validate
 ↓
business rule
 ↓
database
 ↓
response
```

Do not trust:

-   user IDs supplied by the client,
-   role values supplied by the client,
-   subscription status supplied by the client,
-   prize amounts supplied by the client.

------------------------------------------------------------------------

# 9. Database Rules

Database constraints should enforce important invariants where possible.

Examples:

``` text
score between 1 and 45
unique(user_id, score_date)
valid charity percentage
valid subscription state
valid winner state
```

Use migrations.

Never manually modify production schema without recording the change.

------------------------------------------------------------------------

# 10. Score Rules

These are hard business rules:

-   Score must be 1--45.
-   Every score has a date.
-   Only one score per user per date.
-   Latest five scores only.
-   New score replaces oldest retained score.
-   Existing same-date score can be edited/deleted.
-   Display newest first.

Never change these without explicit approval.

------------------------------------------------------------------------

# 11. Money Rules

Never use JavaScript floating-point numbers for money calculations where
exact monetary accuracy matters.

Use integer minor units.

Example:

``` text
₹100.50 → 10050 paise
```

Round only according to an explicit business rule.

Never hide rounding.

------------------------------------------------------------------------

# 12. Prize Pool Rules

Current defined distribution:

``` text
5 match = 40%
4 match = 35%
3 match = 25%
```

These add to:

``` text
100%
```

5-match jackpot:

-   rolls over if unclaimed.

Other tiers:

-   do not roll over.

Multiple winners:

-   split the tier equally.

Do not invent the subscription-to-prize-pool percentage.

Make it configurable until confirmed.

------------------------------------------------------------------------

# 13. Draw Rules

The draw can use:

-   random logic,
-   algorithmic weighted logic based on score frequency.

Admin must be able to:

-   configure,
-   simulate,
-   publish.

Simulation must not mutate production settlement state.

Publishing must be explicit.

After publication, do not silently regenerate results.

------------------------------------------------------------------------

# 14. Randomness Rules

For production draws, randomness must be appropriate for the business
requirement.

Do not use:

``` js
Math.random()
```

as an unquestioned production lottery mechanism.

The exact production randomization mechanism is an unresolved
implementation/product decision and must be confirmed before real-money
production use.

------------------------------------------------------------------------

# 15. Subscription Rules

Subscription status must be determined server-side.

Do not trust:

``` text
localStorage
client state
cookies created by the client
frontend subscription flags
```

Stripe webhook events must be verified.

Webhook processing should be idempotent.

------------------------------------------------------------------------

# 16. Authentication Rules

A user can be authenticated without being an admin.

Always distinguish:

``` text
authenticated
vs
authorized
```

Admin routes require server-side role verification.

Never implement admin access using a hidden frontend button as the
security mechanism.

------------------------------------------------------------------------

# 17. Charity Rules

Minimum charity contribution:

``` text
10%
```

Users may increase their percentage.

Charity selection is part of signup/subscription flow.

Do not make charity contribution dependent on winning.

Independent donation is separate from gameplay.

------------------------------------------------------------------------

# 18. Winner Verification Rules

Winner proof is required only for winners.

Proof:

-   screenshot of golf scores.

Admin:

-   approve,
-   reject.

Payout:

``` text
Pending → Paid
```

Do not mark a winner paid merely because proof was uploaded.

------------------------------------------------------------------------

# 19. UI Rules

Design direction:

-   modern,
-   clean,
-   emotional,
-   charity-first,
-   subtle motion.

Avoid making the interface look like a traditional golf website.

Do not make:

-   fairways,
-   plaid,
-   golf clubs,
-   generic golf stock imagery

the primary visual language.

------------------------------------------------------------------------

# 20. Accessibility

All interactive elements must have:

-   accessible labels,
-   keyboard navigation,
-   visible focus states,
-   sensible contrast,
-   meaningful error messages.

Do not communicate important information only through color.

------------------------------------------------------------------------

# 21. Error Handling

Every error must be:

1.  detected,
2.  logged when appropriate,
3.  converted into a safe user-facing message,
4.  prevented from exposing secrets.

Never show:

-   database credentials,
-   stack traces,
-   Stripe secret data,
-   service-role keys.

------------------------------------------------------------------------

# 22. Error-Solving Procedure

When an error occurs:

### Step 1 --- Reproduce

Identify the exact action causing the error.

### Step 2 --- Read the complete error

Do not fix only the last line.

### Step 3 --- Identify the layer

Is it:

-   UI,
-   TypeScript,
-   API,
-   auth,
-   database,
-   Stripe,
-   deployment,
-   environment variable,
-   browser?

### Step 4 --- Find root cause

Do not add random packages or configuration changes.

### Step 5 --- Make smallest fix

Prefer a targeted change.

### Step 6 --- Re-test

Test both:

-   successful path,
-   failure/edge path.

### Step 7 --- Document

If the issue changes project architecture or creates a reusable rule,
update documentation.

------------------------------------------------------------------------

# 23. TypeScript Rules

Avoid:

``` ts
any
```

unless there is a documented reason.

Prefer:

-   interfaces/types,
-   discriminated unions,
-   validated input,
-   typed database responses.

Do not silence TypeScript errors with:

``` ts
// @ts-ignore
```

unless absolutely necessary and documented.

------------------------------------------------------------------------

# 24. Git Rules

Use small commits.

Example:

``` text
feat: add score entry flow
fix: prevent duplicate score dates
feat: add draw simulation
fix: validate charity percentage
```

Do not combine:

``` text
feature + unrelated refactor + formatting entire project
```

------------------------------------------------------------------------

# 25. Database Migration Rules

Every schema change must have a migration.

Migration should be:

-   reproducible,
-   reviewed,
-   safe,
-   named clearly.

Example:

``` text
20260920_create_scores_table.sql
```

------------------------------------------------------------------------

# 26. Testing Rules

At minimum:

### Unit tests

-   score validation,
-   rolling five-score logic,
-   duplicate-date rule,
-   prize distribution,
-   jackpot rollover,
-   charity percentage validation.

### Integration tests

-   authenticated score creation,
-   subscription access,
-   draw simulation,
-   winner verification.

### E2E tests

-   signup,
-   login,
-   subscription flow,
-   dashboard,
-   admin draw flow.

------------------------------------------------------------------------

# 27. Definition of Done

A task is not complete just because code compiles.

Done means:

-   requirement implemented,
-   types pass,
-   tests pass where relevant,
-   error states handled,
-   authorization verified,
-   responsive UI checked,
-   no unnecessary dependency added,
-   documentation updated if required.

------------------------------------------------------------------------

# 28. When Requirements Are Ambiguous

Do not guess.

Mark:

``` text
OPEN QUESTION
```

and record:

-   what is known,
-   what is missing,
-   what options exist,
-   what decision is required.

For example:

> The PRD defines the prize distribution percentages but does not define
> what percentage of subscription revenue enters the prize pool.

That should become a configurable setting, not an invented number.
