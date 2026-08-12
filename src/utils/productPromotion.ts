import type { PromotionType } from '../types/product'

export const PROMOTION_OPTIONS: ReadonlyArray<{ value: PromotionType; label: string }> = [
  { value: 'none', label: 'Sin promoción especial' },
  { value: '2x1', label: '2x1' },
  { value: '3x2', label: '3x2' },
  { value: '4x3', label: '4x3' },
  { value: 'second_unit_50', label: 'Segunda unidad al 50%' },
  { value: 'second_unit_70', label: 'Segunda unidad al 70%' },
  { value: 'buy_2_pay_1', label: 'Llevá 2, pagá 1' },
  { value: 'buy_2_20_off', label: 'Comprando 2, 20% OFF' },
  { value: 'custom', label: 'Personalizada' },
]

export const PROMOTION_LABELS: Record<Exclude<PromotionType, 'custom'>, string> = {
  none: '', '2x1': '2x1', '3x2': '3x2', '4x3': '4x3',
  second_unit_50: '2ª UNIDAD AL 50%', second_unit_70: '2ª UNIDAD AL 70%',
  buy_2_pay_1: 'LLEVÁ 2, PAGÁ 1', buy_2_20_off: 'COMPRANDO 2, 20% OFF',
}

export const normalizePromotionText = (value: string) => value.replace(/\s+/g, ' ').trim()

export const getPromotionText = (type: PromotionType | undefined, customText?: string) => {
  const safeType = type ?? 'none'
  if (safeType === 'custom') return normalizePromotionText(customText ?? '').toLocaleUpperCase('es-AR')
  return PROMOTION_LABELS[safeType] ?? ''
}

export const getPromotionSize = (text: string) => text.length <= 10 ? 'short' : text.length <= 22 ? 'medium' : 'long'
