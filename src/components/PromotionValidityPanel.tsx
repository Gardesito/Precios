import { useEffect, useState, type FormEvent } from 'react'
import type { PromotionValidity } from '../types/promotion'
import { formatPromotionDate, isDateInputValue } from '../utils/promotionValidity'

type Props = {
  validity?: PromotionValidity
  onSave: (validity: PromotionValidity) => void
  onDelete: () => void
}

export function PromotionValidityPanel({ validity, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(!validity)
  const [startDate, setStartDate] = useState(validity?.startDate ?? '')
  const [endDate, setEndDate] = useState(validity?.endDate ?? '')
  const [visible, setVisible] = useState(validity?.visible ?? true)
  const [error, setError] = useState('')

  useEffect(() => {
    setStartDate(validity?.startDate ?? '')
    setEndDate(validity?.endDate ?? '')
    setVisible(validity?.visible ?? true)
    setEditing(!validity)
    setError('')
  }, [validity])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!startDate || !endDate) {
      setError('Ingresá las fechas Desde y Hasta.')
      return
    }
    if (!isDateInputValue(startDate) || !isDateInputValue(endDate)) {
      setError('Ingresá fechas válidas.')
      return
    }
    if (endDate < startDate) {
      setError('La fecha Hasta no puede ser anterior a la fecha Desde.')
      return
    }
    onSave({ startDate, endDate, visible })
    setEditing(false)
    setError('')
  }

  const toggleVisibility = () => {
    if (validity) onSave({ ...validity, visible: !validity.visible })
  }

  const remove = () => {
    if (!window.confirm('¿Eliminar completamente la vigencia de esta sucursal? Las fechas guardadas se borrarán.')) return
    onDelete()
  }

  return (
    <section className="panel-card promotion-panel">
      <div className="section-heading"><div><span className="eyebrow">CONFIGURACIÓN</span><h2>Vigencia de la promoción</h2></div></div>
      {validity && !editing ? (
        <div className="promotion-summary">
          <p><strong>Vigencia actual:</strong> {formatPromotionDate(validity.startDate)} al {formatPromotionDate(validity.endDate)}</p>
          <p className={`visibility-state visibility-state--${validity.visible ? 'visible' : 'hidden'}`}>{validity.visible ? 'Visible en los carteles' : 'Oculta en los carteles'}</p>
          <div className="promotion-actions">
            <button className="button button--primary" type="button" onClick={() => setEditing(true)}>Modificar</button>
            <button className="button button--ghost" type="button" onClick={toggleVisibility}>{validity.visible ? 'Ocultar' : 'Mostrar'}</button>
            <button className="button button--danger" type="button" onClick={remove}>Eliminar</button>
          </div>
        </div>
      ) : (
        <form className="promotion-form" onSubmit={submit} noValidate>
          <div className="field"><label htmlFor="promotion-start">Desde *</label><input id="promotion-start" type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setError('') }} aria-invalid={!!error} /></div>
          <div className="field"><label htmlFor="promotion-end">Hasta *</label><input id="promotion-end" type="date" value={endDate} onChange={(event) => { setEndDate(event.target.value); setError('') }} aria-invalid={!!error} /></div>
          <label className="checkbox-field field--wide"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /><span>Mostrar vigencia en los carteles</span></label>
          {error && <span className="field-error field--wide" role="alert">{error}</span>}
          <div className="form-actions field--wide">
            <button className="button button--primary" type="submit">Guardar vigencia</button>
            {validity && <button className="button button--ghost" type="button" onClick={() => setEditing(false)}>Cancelar</button>}
            {validity && <button className="button button--danger" type="button" onClick={remove}>Eliminar vigencia</button>}
          </div>
        </form>
      )}
    </section>
  )
}
