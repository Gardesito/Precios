import { useEffect, useState, type FormEvent } from 'react'
import { branches } from '../data/branches'
import type { Product, ProductStatus } from '../types/product'

type FormValues = { name: string; price: string; status: ProductStatus; stock: string; stockText: string; branchId: string }
type FormErrors = Partial<Record<keyof FormValues, string>>

const emptyForm: FormValues = { name: '', price: '', status: 'oferta', stock: '', stockText: '', branchId: 'centro' }

type Props = {
  editingProduct: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}

export function ProductForm({ editingProduct, onSave, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setValues(editingProduct ? {
      name: editingProduct.name,
      price: String(editingProduct.price),
      status: editingProduct.status,
      stock: editingProduct.stock === null ? '' : String(editingProduct.stock),
      stockText: editingProduct.stockText,
      branchId: editingProduct.branchId,
    } : emptyForm)
    setErrors({})
  }, [editingProduct])

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next: FormErrors = {}
    const name = values.name.trim()
    if (!name) next.name = 'Ingresá el nombre del producto.'
    else if (name.length < 2) next.name = 'El nombre debe tener al menos 2 caracteres.'
    else if (name.length > 100) next.name = 'El nombre no puede superar los 100 caracteres.'
    if (!values.price.trim()) next.price = 'Ingresá un precio.'
    else if (!/^\d+(?:[.,]\d+)?$/.test(values.price.trim())) next.price = 'Usá solo números y un separador decimal.'
    else if (Number(values.price.replace(',', '.')) <= 0) next.price = 'El precio debe ser mayor que cero.'
    if (values.stock && !/^\d+$/.test(values.stock)) next.stock = 'El stock debe ser un número entero, sin signos.'
    if (!branches.some((branch) => branch.id === values.branchId)) next.branchId = 'Seleccioná una sucursal.'
    return next
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSave({
      id: editingProduct?.id ?? crypto.randomUUID(),
      name: values.name.trim(),
      price: Number(values.price.replace(',', '.')),
      status: values.status,
      stock: values.stock === '' ? null : Number(values.stock),
      stockText: values.stockText.trim(),
      branchId: values.branchId,
    })
    setValues(emptyForm)
    setErrors({})
  }

  return (
    <form className="product-form" onSubmit={submit} noValidate>
      <div className="field field--wide">
        <label htmlFor="product-name">Nombre del producto *</label>
        <input id="product-name" value={values.name} onChange={(e) => update('name', e.target.value)} maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Ej.: Yerba mate 1 kg" />
        {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="product-price">Precio *</label>
        <div className="input-prefix"><span>$</span><input id="product-price" inputMode="decimal" value={values.price} onChange={(e) => update('price', e.target.value)} aria-invalid={!!errors.price} aria-describedby={errors.price ? 'price-error' : undefined} placeholder="0,00" /></div>
        {errors.price && <span className="field-error" id="price-error">{errors.price}</span>}
      </div>
      <div className="field">
        <label htmlFor="product-status">Estado</label>
        <select id="product-status" value={values.status} onChange={(e) => update('status', e.target.value)}>
          <option value="oferta">Oferta</option><option value="normal">Precio normal</option><option value="sin_stock">Sin stock</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="product-stock">Stock disponible</label>
        <input id="product-stock" inputMode="numeric" value={values.stock} onChange={(e) => update('stock', e.target.value)} aria-invalid={!!errors.stock} aria-describedby={errors.stock ? 'stock-error' : undefined} placeholder="Opcional" />
        {errors.stock && <span className="field-error" id="stock-error">{errors.stock}</span>}
      </div>
      <div className="field">
        <label htmlFor="product-branch">Sucursal *</label>
        <select id="product-branch" value={values.branchId} onChange={(e) => update('branchId', e.target.value)}>
          {branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}
        </select>
      </div>
      <div className="field field--wide">
        <label htmlFor="stock-text">Texto de stock</label>
        <input id="stock-text" value={values.stockText} onChange={(e) => update('stockText', e.target.value)} maxLength={60} placeholder="Ej.: HASTA AGOTAR STOCK" />
      </div>
      <div className="form-actions field--wide">
        <button className="button button--primary" type="submit">{editingProduct ? 'Guardar cambios' : 'Agregar producto'}</button>
        {editingProduct && <button className="button button--ghost" type="button" onClick={onCancel}>Cancelar edición</button>}
      </div>
    </form>
  )
}
