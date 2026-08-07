import type { PromotionValidityByBranch } from '../types/promotion'
import { isDateInputValue } from '../utils/promotionValidity'

export const PROMOTION_VALIDITY_STORAGE_KEY = 'don-atilio-promotion-validity'

export function isPromotionValidityByBranch(value: unknown): value is PromotionValidityByBranch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.values(value).every((validity) => {
    if (!validity || typeof validity !== 'object') return false
    const item = validity as Record<string, unknown>
    return typeof item.startDate === 'string' && isDateInputValue(item.startDate)
      && typeof item.endDate === 'string' && isDateInputValue(item.endDate)
      && typeof item.visible === 'boolean'
  })
}
