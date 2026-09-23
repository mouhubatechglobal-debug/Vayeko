export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffHour < 24) return `Il y a ${diffHour}h`
  if (diffDay < 7) return `Il y a ${diffDay}j`
  return formatDate(d)
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const formattedPhone = cleanPhone.startsWith('228') ? cleanPhone : `228${cleanPhone}`
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 100)
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function formatPhone(phone: string): string {
  // Format: +228 90 12 34 56
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length === 8) {
    return `+228 ${cleaned.slice(0,2)} ${cleaned.slice(2,4)} ${cleaned.slice(4,6)} ${cleaned.slice(6,8)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('228')) {
    const local = cleaned.slice(3)
    return `+228 ${local.slice(0,2)} ${local.slice(2,4)} ${local.slice(4,6)} ${local.slice(6,8)}`
  }
  return phone
}
