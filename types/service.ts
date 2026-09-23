import type { Service } from './database';

export interface ServiceCardItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cfa: number | null;
  rate_type: Service['rate_type'];
  category_name: string | null;
  city_name: string | null;
  business_name: string | null;
  whatsapp: string | null;
  average_rating: number | null;
  reviews_count: number;
}

export interface ServiceDetail extends ServiceCardItem {
  phone: string | null;
  opening_hours: Record<string, string> | null;
}

export interface ServiceFormInput {
  name: string;
  description: string;
  category_id: string;
  price_cfa: number | null;
  rate_type: Service['rate_type'];
  phone: string | null;
  whatsapp: string;
  opening_hours: Record<string, string> | null;
}
