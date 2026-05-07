export function formatPrice(price: number, type?: string): string {
  let verbalPrice = ''
  
  if (price >= 1000000000) {
    verbalPrice = `${(price / 1000000000).toFixed(1).replace(/\.0$/, '')} billion`
  } else if (price >= 1000000) {
    verbalPrice = `${(price / 1000000).toFixed(1).replace(/\.0$/, '')} million`
  } else if (price >= 1000) {
    verbalPrice = `${(price / 1000).toFixed(1).replace(/\.0$/, '')} thousand`
  } else {
    verbalPrice = price.toString()
  }

  return `${verbalPrice} naira`
}

/** Format date to readable string */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

/** Merge class names — simple concatenation (Tailwind v4 handles dedup) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Generate initials from full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Amenity label mapping */
export const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi',
  parking: 'Parking',
  pool: 'Swimming Pool',
  gym: 'Gym',
  air_conditioning: 'Air Conditioning',
  kitchen: 'Kitchen',
  washer: 'Washer',
  dryer: 'Dryer',
  garden: 'Garden',
  security: '24/7 Security',
  generator: 'Generator',
  beach_access: 'Beach Access',
  rooftop: 'Rooftop',
  breakfast: 'Breakfast',
  tv: 'TV',
  workspace: 'Workspace',
  elevator: 'Elevator',
  pet_friendly: 'Pet Friendly',
}

/** All available amenities for forms */
export const ALL_AMENITIES = Object.keys(AMENITY_LABELS)

/** Calculate number of nights between two dates */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
