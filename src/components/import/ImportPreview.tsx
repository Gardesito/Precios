import { useState } from 'react'
import { IMPORT_CATEGORIES, type ImportRow } from '../../types/import'
import { formatPrice } from '../../utils/currency'

type Props = {
  rows: ImportRow[]
  onChange: (id: string, patch: Partial<ImportRow>) => void
  onToggleExcluded: (id: string) => void
}

const numberValue = (value: string) => value.trim() === '' ? null : Number(value.replace(',', '.'))

export function ImportPreview({ rows, onChange, onToggleExcluded }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  return <div className="import-table-wrap"><table className="import-table">
    <thead><tr><th>Estado de validación</th><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio anterior</th><th>Precio actual</th><th>Descuento</th><th>Acciones</th></tr></thead>
    <tbody>{rows.map((row) => {
      const editing = editingId === row.id
      const messages = [...row.errors, ...row.warnings]
      return <tr key={row.id} className={row.excluded ? 'is-excluded' : row.errors.length ? 'has-errors' : ''}>
        <td><span className={`validation-pill ${row.excluded ? 'excluded' : row.errors.length ? 'error' : row.warnings.length ? 'warning' : 'valid'}`}>{row.excluded ? 'Excluido' : row.errors.length ? 'Con errores' : row.warnings.length ? 'Advertencia' : 'Válido'}</span>{messages.length > 0 && <small>{messages.join(' ')}</small>}<small>Fila {row.sourceRow}</small></td>
        <td>{editing ? <input value={row.code} onChange={(event) => onChange(row.id, { code: event.target.value })} /> : row.code || '—'}</td>
        <td>{editing ? <input value={row.name} onChange={(event) => onChange(row.id, { name: event.target.value.toLocaleUpperCase('es-AR') })} /> : row.name || '—'}</td>
        <td>{editing ? <select value={row.category} onChange={(event) => onChange(row.id, { category: event.target.value as ImportRow['category'] })}><option value="">Sin categoría</option>{IMPORT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select> : row.category || '—'}</td>
        <td>{editing ? <input inputMode="decimal" value={row.previousPrice ?? ''} onChange={(event) => onChange(row.id, { previousPrice: numberValue(event.target.value) })} /> : row.previousPrice === null ? '—' : `$ ${formatPrice(row.previousPrice)}`}</td>
        <td>{editing ? <input inputMode="decimal" value={row.price ?? ''} onChange={(event) => onChange(row.id, { price: numberValue(event.target.value) })} /> : row.price === null ? '—' : `$ ${formatPrice(row.price)}`}</td>
        <td>{editing ? <input inputMode="decimal" value={row.discount ?? ''} onChange={(event) => onChange(row.id, { discount: numberValue(event.target.value) })} /> : row.discount === null ? '—' : new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 2 }).format(row.discount)}</td>
        <td><div className="row-actions"><button type="button" onClick={() => setEditingId(editing ? null : row.id)}>{editing ? 'Listo' : 'Editar'}</button><button type="button" className="danger-link" onClick={() => onToggleExcluded(row.id)}>{row.excluded ? 'Incluir' : 'Excluir'}</button></div></td>
      </tr>
    })}</tbody>
  </table></div>
}
