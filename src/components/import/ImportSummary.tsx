import { IMPORT_CATEGORIES, type ImportRow } from '../../types/import'
import { isValidImportRow } from '../../utils/importValidation'

const labels: Record<string, string> = {
  'FRUTA Y VERDURA': 'Fruta y verdura', OFERTAS: 'Ofertas', 'LÁCTEOS': 'Lácteos',
  'ALMACÉN': 'Almacén', CONGELADOS: 'Congelados', BEBIDAS: 'Bebidas', LIMPIEZA: 'Limpieza',
}

export function ImportSummary({ rows, branchName }: { rows: ImportRow[]; branchName: string }) {
  const valid = rows.filter(isValidImportRow)
  return <div className="import-summary">
    <div className="import-summary__headline">
      <strong>{valid.length} productos detectados</strong>
      <strong>{Math.ceil(valid.length / 3)} páginas A4</strong>
      <strong>Sucursal: {branchName}</strong>
    </div>
    <div className="category-summary">
      {IMPORT_CATEGORIES.map((category) => <span key={category}>{labels[category]}: <strong>{valid.filter((row) => row.category === category).length}</strong></span>)}
    </div>
  </div>
}
