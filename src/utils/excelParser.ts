import * as XLSX from 'xlsx'
import { IMPORT_CATEGORIES, type ExcelParseResult, type ImportCategory, type ImportRow } from '../types/import'
import { validateImportRows } from './importValidation'
import { parseNumericValue, roundPrice } from './priceNormalization'

const categoryAliases = new Map<string, ImportCategory>([
  ['FRUTA Y VERDURA', 'FRUTA Y VERDURA'],
  ['OFERTAS', 'OFERTAS'],
  ['LACTEOS', 'LÁCTEOS'],
  ['ALMACEN', 'ALMACÉN'],
  ['CONGELADOS', 'CONGELADOS'],
  ['BEBIDAS', 'BEBIDAS'],
  ['LIMPIEZA', 'LIMPIEZA'],
])

const cleanText = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim()
const fold = (value: unknown) => cleanText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleUpperCase('es-AR')
const findCategory = (row: unknown[]): ImportCategory | null => {
  for (const value of row.slice(0, 5)) {
    const category = categoryAliases.get(fold(value))
    if (category && IMPORT_CATEGORIES.includes(category)) return category
  }
  return null
}

const isStructuralRow = (row: unknown[]) => {
  const values = row.slice(0, 5).map(fold).filter(Boolean)
  const joined = values.join(' ')
  return !values.length ||
    joined.includes('CODIGO PRODUCTO') ||
    joined.includes('ANTES AHORA') ||
    joined.startsWith('OFERTAS DEL ') ||
    (values.length === 1 && (values[0] === 'RIO GRANDE' || values[0] === 'ANTES' || values[0] === 'AHORA'))
}

const parseSheet = (sheet: XLSX.WorkSheet): ImportRow[] => {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true })
  const rows: ImportRow[] = []
  let category: ImportCategory | '' = ''

  matrix.forEach((source, index) => {
    const row = source as unknown[]
    const nextCategory = findCategory(row)
    if (nextCategory) {
      category = nextCategory
      return
    }
    if (isStructuralRow(row)) return
    const code = cleanText(row[0])
    const name = cleanText(row[1]).toLocaleUpperCase('es-AR')
    const price = parseNumericValue(row[4])
    const looksLikeProduct = Boolean(code || name || price !== null)
    if (!looksLikeProduct) return
    rows.push({
      id: crypto.randomUUID(),
      sourceRow: index + 1,
      code,
      name,
      category,
      previousPrice: parseNumericValue(row[3]) === null ? null : roundPrice(parseNumericValue(row[3])!),
      price: price === null ? null : roundPrice(price),
      discount: parseNumericValue(row[2]),
      excluded: false,
      errors: [],
      warnings: [],
    })
  })
  return validateImportRows(rows)
}

const validCount = (rows: ImportRow[]) => rows.filter((row) => row.errors.length === 0).length

const detectBranch = (fileName: string, sheetName: string, sheet: XLSX.WorkSheet) => {
  const firstCells = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true }).slice(0, 4).flat().map(fold).join(' ')
  const haystack = fold(`${fileName} ${sheetName} ${firstCells}`)
  if (haystack.includes('RIO GRANDE')) return 'Río Grande'
  return null
}

export const parseExcelFile = async (file: File): Promise<ExcelParseResult> => {
  if (!/\.(xlsx|xls)$/i.test(file.name)) throw new Error('El archivo debe tener formato .xlsx o .xls.')
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
  const inspected = workbook.SheetNames.map((sheetName) => ({
    sheetName,
    sheet: workbook.Sheets[sheetName],
    rows: parseSheet(workbook.Sheets[sheetName]),
  }))
  const selected = inspected.find(({ rows }) => validCount(rows) > 0)
  if (!selected) throw new Error('El archivo no contiene productos válidos.')
  return {
    fileName: file.name,
    sheetName: selected.sheetName,
    detectedBranchName: detectBranch(file.name, selected.sheetName, selected.sheet),
    rows: selected.rows,
    ignoredSheets: inspected.filter((item) => item.sheetName !== selected.sheetName && validCount(item.rows) === 0).map((item) => item.sheetName),
  }
}
