import type { Product } from './product'

export const IMPORT_CATEGORIES = [
  'FRUTA Y VERDURA',
  'OFERTAS',
  'LÁCTEOS',
  'ALMACÉN',
  'CONGELADOS',
  'BEBIDAS',
  'LIMPIEZA',
] as const

export type ImportCategory = typeof IMPORT_CATEGORIES[number]

export type ImportRow = {
  id: string
  sourceRow: number
  code: string
  name: string
  category: ImportCategory | ''
  previousPrice: number | null
  price: number | null
  discount: number | null
  excluded: boolean
  errors: string[]
  warnings: string[]
}

export type ExcelParseResult = {
  fileName: string
  sheetName: string
  detectedBranchName: string | null
  rows: ImportRow[]
  ignoredSheets: string[]
}

export type ImportedProduct = Product & {
  code: string
  category: string
  previousPrice: number | null
  discount: number | null
}
