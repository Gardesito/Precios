export const roundPrice = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100

export const parseNumericValue = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const clean = value.trim().replace(/\s/g, '')
  if (!clean) return null
  const normalized = clean.includes(',')
    ? clean.replace(/\./g, '').replace(',', '.')
    : clean
  const parsed = Number(normalized.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}
