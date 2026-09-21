-- Seed Data for Digital Heroes Development

-- Seed Charities
INSERT INTO public.charities (id, name, slug, description, image_url, events, is_active)
VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        'Golf For Good Foundation',
        'golf-for-good',
        'Supporting under-privileged youth through community golf mentorship programs and sports equipment access.',
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600',
        '[{"title": "Annual Charity Golf Classic", "date": "2026-10-15", "location": "Royal St. Andrew Field"}]'::jsonb,
        TRUE
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Junior Fairway Alliance',
        'junior-fairway',
        'Empowering young athletes with educational scholarships and health resources across regional communities.',
        'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=600',
        '[{"title": "Youth Open Championship", "date": "2026-11-02", "location": "Pebble Creek Grounds"}]'::jsonb,
        TRUE
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Green Heroes Conservation',
        'green-heroes',
        'Promoting sustainable turf management and environmental conservation across sporting venues.',
        'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=600',
        '[{"title": "Eco Turf Summit", "date": "2026-12-05", "location": "Metropolitan Green Hub"}]'::jsonb,
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
