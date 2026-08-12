import { getBranchName } from '../data/branches'
import type { Product } from '../types/product'
import { formatPrice } from '../utils/currency'
import { getPromotionText } from '../utils/productPromotion'

type Props = { products: Product[]; editingId?: string; onEdit: (product: Product) => void; onDelete: (id: string) => void }

export function ProductList({ products, editingId, onEdit, onDelete }: Props) {
  if (!products.length) return <div className="empty-list"><strong>Todavía no hay productos.</strong><span>Agregá uno con el formulario o cargá los ejemplos.</span></div>
  return <ul className="product-list">{products.map((product) => (
    <li key={product.id} className={editingId === product.id ? 'is-editing' : ''}>
      <div className="product-list__main"><strong>{product.name}</strong><span>{getBranchName(product.branchId)} · {product.status === 'sin_stock' ? 'Sin stock' : `$ ${formatPrice(product.price)}`}</span><span>Promoción: {getPromotionText(product.promotionType, product.promotionText) || 'Sin promoción especial'}</span></div>
      <div className="product-list__actions"><button type="button" onClick={() => onEdit(product)}>Editar</button><button className="danger-link" type="button" onClick={() => onDelete(product.id)}>Eliminar</button></div>
    </li>
  ))}</ul>
}
