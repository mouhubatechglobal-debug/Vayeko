import type { Metadata } from 'next';
import { listCities } from '@/lib/data';
import { BusinessForm } from '@/components/dashboard/BusinessForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Ma boutique' };

export default async function DashboardBoutiquePage() {
  const cities = await listCities();
  return <BusinessForm cities={cities} />;
}
