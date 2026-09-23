import { createClient } from '@/lib/supabase/client'
import { products as mockProducts } from '@/lib/data'
import type { Product, SearchFilters } from '@/types'

export const productService = {
  async getAll(filters?: SearchFilters): Promise<Product[]> {
    const supabase = createClient()
    
    if (!supabase) {
      // Mode mock
      let filtered = [...mockProducts]
      
      if (filters?.query) {
        const q = filters.query.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      
      if (filters?.city && filters.city !== 'Toutes') {
        filtered = filtered.filter(p => p.city === filters.city)
      }
      
      if (filters?.priceMin) {
        filtered = filtered.filter(p => p.price >= filters.priceMin!)
      }
      
      if (filters?.priceMax) {
        filtered = filtered.filter(p => p.price <= filters.priceMax!)
      }
      
      if (filters?.sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price)
      } else if (filters?.sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price)
      } else if (filters?.sortBy === 'recent') {
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      }
      
      return filtered as Product[]
    }

    // Mode Supabase
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          shops!inner(name, city, slug)
        `)
        .eq('is_available', true)

      if (filters?.query) {
        query = query.ilike('name', `%${filters.query}%`)
      }

      if (filters?.city && filters.city !== 'Toutes') {
        query = query.eq('city', filters.city)
      }

      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters?.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true })
      } else if (filters?.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('updated_at', { ascending: false })
      }

      const limit = filters?.limit || 50
      const page = filters?.page || 0
      query = query.range(page * limit, (page + 1) * limit - 1)

      const { data, error } = await query

      if (error) throw error

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        oldPrice: p.old_price,
        images: JSON.parse(p.images || '[]'),
        stock: p.stock,
        isAvailable: p.is_available,
        variants: p.variants ? JSON.parse(p.variants) : [],
        delivery: p.delivery,
        pickup: p.pickup,
        shopId: p.shop_id,
        shopName: p.shops?.name,
        city: p.city,
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        updatedAt: p.updated_at,
        createdAt: p.created_at,
      }))
    } catch (error) {
      console.error('Erreur productService.getAll:', error)
      return mockProducts as Product[]
    }
  },

  async getById(id: string): Promise<Product | null> {
    const supabase = createClient()
    
    if (!supabase) {
      return mockProducts.find(p => p.id === id || p.slug === id) as Product || null
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          shops(name, city, slug)
        `)
        .or(`id.eq.${id},slug.eq.${id}`)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        price: data.price,
        oldPrice: data.old_price,
        images: JSON.parse(data.images || '[]'),
        stock: data.stock,
        isAvailable: data.is_available,
        variants: data.variants ? JSON.parse(data.variants) : [],
        delivery: data.delivery,
        pickup: data.pickup,
        shopId: data.shop_id,
        shopName: data.shops?.name,
        city: data.city,
        rating: data.rating || 0,
        reviewCount: data.review_count || 0,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error('Erreur productService.getById:', error)
      return mockProducts.find(p => p.id === id) as Product || null
    }
  },

  async getByShop(shopId: string): Promise<Product[]> {
    const supabase = createClient()
    
    if (!supabase) {
      return mockProducts.filter(p => p.shopId === shopId) as Product[]
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .eq('is_available', true)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        oldPrice: p.old_price,
        images: JSON.parse(p.images || '[]'),
        stock: p.stock,
        isAvailable: p.is_available,
        variants: p.variants ? JSON.parse(p.variants) : [],
        delivery: p.delivery,
        pickup: p.pickup,
        shopId: p.shop_id,
        city: p.city,
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        updatedAt: p.updated_at,
      }))
    } catch (error) {
      console.error('Erreur productService.getByShop:', error)
      return []
    }
  },

  async comparePrices(productName: string) {
    // Pour comparateur - groupe par nom similaire
    const all = await this.getAll({ query: productName })
    
    // Grouper par similarité de nom (simplifié)
    const groups = all.reduce((acc, product) => {
      const key = product.name.toLowerCase().split(' ').slice(0, 3).join(' ')
      if (!acc[key]) acc[key] = []
      acc[key].push(product)
      return acc
    }, {} as Record<string, Product[]>)

    return Object.entries(groups).map(([name, offers]) => ({
      name: offers[0].name,
      category: offers[0].category,
      offers: offers.sort((a, b) => a.price - b.price),
      bestPrice: Math.min(...offers.map(o => o.price)),
      savings: Math.max(...offers.map(o => o.price)) - Math.min(...offers.map(o => o.price)),
    }))
  }
}
