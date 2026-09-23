import type { Product, ProductImage } from './database';

/** Produit tel que retourné par les requêtes de lecture publiques. */
export interface ProductWithImages extends Omit<Product, 'shop_id'> {
  shop_id: string;
  images: ProductImage[];
  shop_name?: string | null;
  shop_slug?: string | null;
  average_rating?: number | null;
  reviews_count?: number;
}

export interface ProductCardItem {
  id: string;
  slug: string;
  name: string;
  price_cfa: number;
  image_url: string | null;
  available: boolean;
  average_rating: number | null;
  reviews_count: number;
}

export interface ProductFormInput {
  name: string;
  description: string | null;
  category_id: string | null;
  price_cfa: number;
  available: boolean;
  stock: number | null;
  image_urls: string[];
}
