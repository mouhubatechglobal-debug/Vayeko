import { createClient } from '@/lib/supabase/client'
import { professionCategories, professions, type Profession, type ProfessionCategory, VerificationStatus } from '@/lib/professions'

export const professionService = {
  async getCategories(): Promise<ProfessionCategory[]> {
    const supabase = createClient()
    
    if (!supabase) {
      return professionCategories
    }

    try {
      const { data, error } = await supabase
        .from('profession_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        color: c.color,
      }))
    } catch (error) {
      console.error('Erreur getCategories:', error)
      return professionCategories
    }
  },

  async getAll(): Promise<Profession[]> {
    const supabase = createClient()
    
    if (!supabase) {
      return professions.filter(p => p.isActive)
    }

    try {
      const { data, error } = await supabase
        .from('professions')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.category_id,
        description: p.description,
        icon: p.icon,
        requiresVerification: p.requires_verification,
        isActive: p.is_active,
      }))
    } catch (error) {
      console.error('Erreur getAll professions:', error)
      return professions.filter(p => p.isActive)
    }
  },

  async getByCategory(categoryId: string): Promise<Profession[]> {
    const all = await this.getAll()
    return all.filter(p => p.categoryId === categoryId)
  },

  async search(query: string): Promise<Profession[]> {
    const all = await this.getAll()
    const q = query.toLowerCase()
    return all.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.slug.includes(q)
    )
  },

  async createProfessionalProfile(data: {
    userId: string
    professionId?: string
    customProfession?: string
    description?: string
    experience?: string
    businessId?: string
  }) {
    const supabase = createClient()
    
    if (!supabase) {
      // Mode mock
      console.log('Mock create professional profile:', data)
      return { data: { id: `pro-${Date.now()}`, ...data, verification_status: VerificationStatus.NON_VERIFIE }, error: null }
    }

    try {
      // Validation: profession_id OU custom_profession, pas les deux sauf si autre
      if (!data.professionId && !data.customProfession) {
        throw new Error('Profession ou profession personnalisée requise')
      }

      if (data.professionId && data.customProfession && data.professionId !== 'autre') {
        throw new Error('Ne peut pas avoir profession_id et custom_profession sauf pour autre')
      }

      const { data: result, error } = await supabase
        .from('professional_profiles')
        .insert({
          user_id: data.userId,
          profession_id: data.professionId || null,
          custom_profession: data.customProfession || null,
          business_id: data.businessId || null,
          description: data.description,
          experience: data.experience,
          verification_status: 'NON_VERIFIE',
        })
        .select()
        .single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getUserProfessions(userId: string) {
    const supabase = createClient()
    
    if (!supabase) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          professions(name, slug, icon, requires_verification),
          businesses(name, slug)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur getUserProfessions:', error)
      return []
    }
  },

  async requestVerification(profileId: string) {
    const supabase = createClient()
    
    if (!supabase) {
      return { data: { verification_status: VerificationStatus.EN_VERIFICATION }, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .update({ verification_status: 'EN_VERIFICATION' })
        .eq('id', profileId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}
