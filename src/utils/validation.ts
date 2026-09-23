// Vayeko - Validation des données
// Toutes les données utilisateur doivent être validées côté client ET serveur

export const validators = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email) && email.length <= 255
  },

  phone: (phone: string): boolean => {
    // Format Togo: +228 XX XX XX XX ou 90 XX XX XX
    const cleaned = phone.replace(/[^0-9+]/g, '')
    return /^(\+228)?[0-9]{8}$/.test(cleaned) || /^\+228[0-9]{8}$/.test(cleaned)
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' }
    }
    if (password.length > 128) {
      return { valid: false, message: 'Le mot de passe est trop long' }
    }
    return { valid: true }
  },

  price: (price: number): boolean => {
    return Number.isInteger(price) && price >= 0 && price <= 100_000_000 // Max 100M FCFA
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100
  },

  description: (desc: string): boolean => {
    return desc.trim().length >= 10 && desc.trim().length <= 5000
  },

  city: (city: string): boolean => {
    const validCities = ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié', 'Aného']
    return validCities.includes(city)
  },

  file: (file: File, options?: { maxSizeMB?: number; allowedTypes?: string[] }): { valid: boolean; message?: string } => {
    const maxSize = (options?.maxSizeMB || 5) * 1024 * 1024
    const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/png', 'image/webp']

    if (file.size > maxSize) {
      return { valid: false, message: `Fichier trop volumineux (max ${options?.maxSizeMB || 5}MB)` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: `Type de fichier non autorisé. Autorisés: ${allowedTypes.join(', ')}` }
    }

    // Vérifier extension dangereuse
    const dangerousExts = ['.exe', '.sh', '.bat', '.js', '.php', '.html']
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (dangerousExts.includes(ext)) {
      return { valid: false, message: 'Extension de fichier non autorisée' }
    }

    return { valid: true }
  },

  slug: (slug: string): boolean => {
    return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 100
  },

  rating: (rating: number): boolean => {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5
  }
}

export function validateSearchQuery(query: string): boolean {
  // Empêcher injection, XSS
  if (query.length > 200) return false
  // Pas de caractères dangereux
  const dangerous = /[<>\"'`;]/g
  return !dangerous.test(query)
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Enlever < et >
    .slice(0, 1000) // Limiter taille
}

export function validateOrderData(data: { productId: string; quantity: number; city: string }) {
  const errors: string[] = []
  
  if (!data.productId || typeof data.productId !== 'string') {
    errors.push('Produit invalide')
  }
  
  if (!Number.isInteger(data.quantity) || data.quantity < 1 || data.quantity > 100) {
    errors.push('Quantité invalide (1-100)')
  }
  
  if (!validators.city(data.city)) {
    errors.push('Ville invalide')
  }
  
  return { valid: errors.length === 0, errors }
}

export function validateReservationData(data: { serviceId: string; date: string; time: string }) {
  const errors: string[] = []
  
  if (!data.serviceId) errors.push('Service requis')
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(data.date)) errors.push('Date invalide (YYYY-MM-DD)')
  else {
    const d = new Date(data.date)
    const now = new Date()
    now.setHours(0,0,0,0)
    if (d < now) errors.push('Date ne peut pas être dans le passé')
  }
  
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(data.time)) errors.push('Heure invalide (HH:mm)')
  
  return { valid: errors.length === 0, errors }
}
