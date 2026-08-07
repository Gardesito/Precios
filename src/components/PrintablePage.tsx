import type { Product } from '../types/product'
import type { PromotionValidity } from '../types/promotion'
import { PriceCard } from './PriceCard'

export function PrintablePage({ products, pageNumber, promotionValidity }: { products: Product[]; pageNumber: number; promotionValidity?: PromotionValidity }) {
  return (
    <section className="print-page" aria-label={`Página ${pageNumber}`}>
      <span className="page-number no-print">Página {pageNumber}</span>
      {[0, 1, 2].map((slot) => <div className={`print-slot print-slot--${slot + 1}`} key={slot}>{products[slot] && <PriceCard product={products[slot]} promotionValidity={promotionValidity} />}</div>)}
    </section>
  )
}
