import type { Metadata } from 'next';
import { getCurrentProfile } from '@/lib/auth';
import { getServerSupabase } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';
import { listServiceCategories } from '@/lib/data';
import { ServiceManager } from '@/components/dashboard/ServiceManager';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mes services' };

export default async function DashboardServicesPage() {
  let businesses: Array<{ id: string; name: string; type: string }> = [];
  if (isSupabaseConfigured()) {
    const profile = await getCurrentProfile();
    if (profile) {
      const supabase = await getServerSupabase();
      const { data } = await supabase
        .from('business_members')
        .select('businesses(id, name, type)')
        .eq('profile_id', profile.id);
      businesses = (data ?? [])
        .map((row) => (Array.isArray(row.businesses) ? row.businesses[0] : row.businesses))
        .filter((b): b is { id: string; name: string; type: string } => Boolean(b));
    }
  }
  const categories = await listServiceCategories();
  return <ServiceManager businesses={businesses} categories={categories} />;
}
