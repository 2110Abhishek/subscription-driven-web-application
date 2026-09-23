export interface CharityItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export const defaultCharities: CharityItem[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Golf For Good Foundation',
    slug: 'golf-for-good',
    description: 'Supporting under-privileged youth through community golf mentorship programs and sports equipment access.',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Junior Fairway Alliance',
    slug: 'junior-fairway',
    description: 'Empowering young athletes with educational scholarships and health resources across regional communities.',
    image: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Green Heroes Conservation',
    slug: 'green-heroes',
    description: 'Promoting sustainable turf management and environmental conservation across sporting venues.',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=600',
  },
];

export class CharityService {
  static async getCharities(): Promise<CharityItem[]> {
    try {
      const res = await fetch('/api/charities');
      const data = await res.json();
      if (data && data.charities && data.charities.length > 0) {
        return data.charities;
      }
    } catch {
      // Fallback to default verified charities
    }
    return defaultCharities;
  }

  static getCharityById(id: string): CharityItem | undefined {
    return defaultCharities.find((c) => c.id === id);
  }
}
