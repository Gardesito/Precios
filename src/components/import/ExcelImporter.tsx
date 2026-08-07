import { useRef, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { branches, getBranchName } from '../../data/branches'
import type { ImportedProduct, ImportRow } from '../../types/import'
import { parseExcelFile } from '../../utils/excelParser'
import { isValidImportRow, validateImportRows } from '../../utils/importValidation'
import { roundPrice } from '../../utils/priceNormalization'
import { ImportPreview } from './ImportPreview'
import { ImportSummary } from './ImportSummary'

type Props = { defaultBranchId: string; onImport: (products: ImportedProduct[], branchId: string) => void }

export function ExcelImporter({ defaultBranchId, onImport }: Props) {
  const [open, setOpen] = useState(false)
  const [branchId, setBranchId] = useState(defaultBranchId)
  const [rows, setRows] = useState<ImportRow[] | null>(null)
  const [fileInfo, setFileInfo] = useState<{ name: string; sheet: string; detectedBranch: string | null; ignored: string[] } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const importingRef = useRef(false)
  const branchName = getBranchName(branchId)

  const close = () => {
    if (loading) return
    setOpen(false); setRows(null); setFileInfo(null); setError(''); importingRef.current = false
  }
  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError(''); setLoading(true)
    try {
      const result = await parseExcelFile(file)
      setRows(result.rows)
      setFileInfo({ name: result.fileName, sheet: result.sheetName, detectedBranch: result.detectedBranchName, ignored: result.ignoredSheets })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo leer el archivo Excel.')
    } finally { setLoading(false) }
  }
  const updateRow = (id: string, patch: Partial<ImportRow>) => {
    setRows((current) => current ? validateImportRows(current.map((row) => row.id === id ? { ...row, ...patch } : row)) : current)
  }
  const toggleExcluded = (id: string) => {
    setRows((current) => current ? validateImportRows(current.map((row) => row.id === id ? { ...row, excluded: !row.excluded } : row)) : current)
  }
  const confirm = () => {
    if (!rows || importingRef.current) return
    const valid = rows.filter(isValidImportRow)
    if (!valid.length) { setError('No hay filas válidas para importar.'); return }
    const message = `Vas a importar ${valid.length} productos para ${branchName}. Esta acción generará ${Math.ceil(valid.length / 3)} páginas A4. ¿Deseás continuar?`
    if (!window.confirm(message)) return
    importingRef.current = true
    const products: ImportedProduct[] = valid.map((row) => ({
      id: crypto.randomUUID(), code: String(row.code), name: row.name.replace(/\s+/g, ' ').trim().toLocaleUpperCase('es-AR'), category: row.category,
      previousPrice: row.previousPrice === null ? null : roundPrice(row.previousPrice), price: roundPrice(row.price!), discount: row.discount,
      status: 'oferta', stock: null, stockText: '', branchId,
    }))
    onImport(products, branchId)
    close()
  }

  const mismatch = fileInfo?.detectedBranch && fileInfo.detectedBranch !== branchName
  const dialog = open ? <div className="import-backdrop" role="presentation"><section className="import-dialog" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <header><div><span className="eyebrow">IMPORTACIÓN</span><h2 id="import-title">Importar productos desde Excel</h2></div><button className="dialog-close" type="button" onClick={close} aria-label="Cerrar">×</button></header>
      {!rows ? <div className="import-start">
        <div className="field"><label htmlFor="import-branch">Sucursal *</label><select id="import-branch" value={branchId} onChange={(event) => setBranchId(event.target.value)}>{branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}</select><small>Seleccioná la sucursal antes de procesar el archivo.</small></div>
        <label className={`button button--primary file-button ${loading ? 'is-disabled' : ''}`}> {loading ? 'Leyendo archivo…' : 'Seleccionar archivo .xlsx o .xls'}<input type="file" accept=".xlsx,.xls" onChange={chooseFile} disabled={loading} /></label>
      </div> : <>
        <div className="import-meta"><span>Archivo: <strong>{fileInfo?.name}</strong></span><span>Hoja: <strong>{fileInfo?.sheet}</strong></span>{fileInfo?.ignored.length ? <span>Hojas ignoradas: <strong>{fileInfo.ignored.join(', ')}</strong></span> : null}</div>
        {mismatch && <div className="import-alert warning">Advertencia: el archivo parece corresponder a {fileInfo?.detectedBranch}, pero seleccionaste {branchName}. Se respetará tu selección.</div>}
        <ImportSummary rows={rows} branchName={branchName} />
        <ImportPreview rows={rows} onChange={updateRow} onToggleExcluded={toggleExcluded} />
      </>}
      {error && <div className="import-alert error" role="alert">{error}</div>}
      <footer><button className="button button--ghost" type="button" onClick={close}>Cancelar</button>{rows && <button className="button button--primary" type="button" onClick={confirm} disabled={!rows.some(isValidImportRow)}>Importar productos</button>}</footer>
    </section></div> : null

  return <>
    <button className="button button--import" type="button" onClick={() => { setBranchId(defaultBranchId); setOpen(true) }}>Importar Excel</button>
    {dialog && createPortal(dialog, document.body)}
  </>
}
