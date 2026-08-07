import type { ImportRow } from '../types/import'

const comparable = (value: string) => value.trim().toLocaleUpperCase('es-AR')

export const validateImportRows = (rows: ImportRow[]): ImportRow[] => {
  const codeCounts = new Map<string, number>()
  const nameCounts = new Map<string, number>()

  rows.filter((row) => !row.excluded).forEach((row) => {
    const code = comparable(row.code)
    const name = comparable(row.name)
    if (code) codeCounts.set(code, (codeCounts.get(code) ?? 0) + 1)
    if (name) nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1)
  })

  return rows.map((row) => {
    const errors: string[] = []
    const warnings: string[] = []
    const code = comparable(row.code)
    const name = comparable(row.name)
    if (!row.code.trim()) errors.push('Código vacío.')
    if (!row.name.trim()) errors.push('Producto vacío.')
    if (row.price === null) errors.push('Precio actual vacío o no numérico.')
    else if (row.price <= 0) errors.push('El precio actual debe ser mayor que cero.')
    if (!row.category) errors.push('No se detectó una categoría para el producto.')
    if (code && (codeCounts.get(code) ?? 0) > 1) errors.push('Código duplicado dentro del archivo.')
    if (name && (nameCounts.get(name) ?? 0) > 1) errors.push('Producto duplicado dentro del archivo.')
    if (row.price !== null && row.previousPrice !== null && row.price > row.previousPrice) {
      warnings.push('El precio actual es mayor que el precio anterior.')
    }
    return { ...row, errors, warnings }
  })
}

export const isValidImportRow = (row: ImportRow) => !row.excluded && row.errors.length === 0
