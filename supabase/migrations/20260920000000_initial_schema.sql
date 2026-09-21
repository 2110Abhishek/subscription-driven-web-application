-- Migration: Initial Schema for Digital Heroes Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'stripe',
    provider_subscription_id TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
    status TEXT NOT NULL CHECK (status IN ('active', 'lapsed', 'canceled')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Subscription Events (Audit Log)
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Charities Table
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_url TEXT,
    events JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Charity Selections Table
CREATE TABLE IF NOT EXISTS public.charity_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE RESTRICT,
    contribution_percentage INT NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
    effective_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Scores Table (Stableford 1-45, Unique user_id + score_date)
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

-- 7. Draws Table
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published', 'completed')),
    engine_type TEXT NOT NULL DEFAULT 'random' CHECK (engine_type IN ('random', 'algorithmic')),
    draw_numbers INT[] DEFAULT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Draw Configurations Table
CREATE TABLE IF NOT EXISTS public.draw_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    prize_pool_percentage INT NOT NULL DEFAULT 50 CHECK (prize_pool_percentage > 0 AND prize_pool_percentage <= 100),
    jackpot_rollover_amount INT NOT NULL DEFAULT 0 CHECK (jackpot_rollover_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Draw Participants Snapshot Table
CREATE TABLE IF NOT EXISTS public.draw_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scores_snapshot INT[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Prize Pools Table (Monetary values in minor units / cents)
CREATE TABLE IF NOT EXISTS public.prize_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID NOT NULL UNIQUE REFERENCES public.draws(id) ON DELETE CASCADE,
    total_pool_amount INT NOT NULL DEFAULT 0,
    five_match_pool INT NOT NULL DEFAULT 0,
    four_match_pool INT NOT NULL DEFAULT 0,
    three_match_pool INT NOT NULL DEFAULT 0,
    rolled_over_amount INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Winners Table
CREATE TABLE IF NOT EXISTS public.winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_tier INT NOT NULL CHECK (match_tier IN (3, 4, 5)),
    prize_amount INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'unverified' CHECK (status IN ('unverified', 'proof_submitted', 'verified', 'rejected')),
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Winner Proofs Table
CREATE TABLE IF NOT EXISTS public.winner_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    winner_id UUID NOT NULL UNIQUE REFERENCES public.winners(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Payouts Table
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    winner_id UUID NOT NULL UNIQUE REFERENCES public.winners(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid')),
    transaction_ref TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Admin Actions (Audit Trail)
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    action_type TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Platform Settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('prize_pool_contribution_pct', '50'::jsonb, 'Percentage of subscription revenue allocated to draw prize pool'),
    ('default_monthly_price', '1500'::jsonb, 'Default monthly subscription price in cents ($15.00)'),
    ('default_yearly_price', '15000'::jsonb, 'Default yearly subscription price in cents ($150.00)'),
    ('draw_schedule', '"monthly"'::jsonb, 'Draw cadence')
ON CONFLICT (key) DO NOTHING;

-- RLS (Row Level Security) Policies Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_proofs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users read own, admin reads all
DROP POLICY IF EXISTS "Public profiles are readable by user or admin" ON public.profiles;
CREATE POLICY "Public profiles are readable by user or admin" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Scores: Users manage own scores, admin reads/writes all
DROP POLICY IF EXISTS "Users can manage own scores" ON public.scores;
CREATE POLICY "Users can manage own scores" ON public.scores
    FOR ALL USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Charities: Everyone can read active charities, admin manages all
DROP POLICY IF EXISTS "Charities read policy" ON public.charities;
CREATE POLICY "Charities read policy" ON public.charities
    FOR SELECT USING (is_active = TRUE OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

