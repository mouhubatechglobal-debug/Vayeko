import type { Metadata } from 'next';
import { listProductCategories } from '@/lib/data';
import { ProductManager } from '@/components/dashboard/ProductManager';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mes produits' };

export default async function DashboardProduitsPage() {
  const categories = await listProductCategories();
  return <ProductManager categories={categories} />;
}
