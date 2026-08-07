import type { PromotionValidity } from '../types/promotion'

const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isDateInputValue(value: string): boolean {
  if (!DATE_VALUE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function formatPromotionDate(value: string, includeYear = false): string {
  const [year, month, day] = value.split('-')
  const shortDate = `${Number(day)}/${Number(month)}`
  return includeYear ? `${shortDate}/${year}` : shortDate
}

export function formatPromotionValidity({ startDate, endDate }: PromotionValidity): string {
  const differentYears = startDate.slice(0, 4) !== endDate.slice(0, 4)
  return `VÁLIDO DEL ${formatPromotionDate(startDate, differentYears)} AL ${formatPromotionDate(endDate, differentYears)}`
}

export function canShowPromotionValidity(validity: PromotionValidity | undefined): validity is PromotionValidity {
  return !!validity?.visible && isDateInputValue(validity.startDate) && isDateInputValue(validity.endDate)
}
