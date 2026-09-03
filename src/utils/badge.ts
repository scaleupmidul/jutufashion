export type NormalizedBadge = 'New' | 'Best' | 'Limited' | 'Sale' | null;

/**
 * Normalizes any badge string strictly to the allowed set:
 * 'New' | 'Best' | 'Limited' | 'Sale' | null
 */
export function formatBadge(badge?: string | null): NormalizedBadge {
  if (!badge) return null;
  const upper = badge.trim().toUpperCase();
  if (upper === 'NEW') return 'New';
  if (upper === 'BEST' || upper === 'BEST SELLER' || upper === 'BESTSELLER') return 'Best';
  if (upper === 'LIMITED' || upper === 'LIMITED EDITION') return 'Limited';
  if (upper === 'SALE') return 'Sale';
  if (upper === 'NONE' || upper === '') return null;
  
  // If exact match with valid case:
  if (badge === 'New' || badge === 'Best' || badge === 'Limited' || badge === 'Sale') {
    return badge;
  }

  return null;
}
