import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({
      charities: (charities || []).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image_url || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600',
        events: c.events || [],
        upcomingEvent: Array.isArray(c.events) && c.events[0]
          ? `${c.events[0].title} — ${c.events[0].date}`
          : 'Annual Charity Golf Classic — Oct 15, 2026',
      })),
    });
  } catch (err: any) {
    console.error('Public charities API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
