import type { BusinessType } from './database';

export interface BusinessCardItem {
  id: string;
  slug: string;
  name: string;
  type: BusinessType;
  description: string | null;
  logo_url: string | null;
  city_name: string | null;
  whatsapp: string | null;
  products_count?: number;
  services_count?: number;
  average_rating?: number | null;
  reviews_count?: number;
}

export interface BoutiqueFormInput {
  name: string;
  description: string | null;
  phone: string | null;
  whatsapp: string;
  city_id: string;
  address_line: string | null;
}
