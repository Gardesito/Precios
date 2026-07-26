import type { Product } from '../types/product'
import { PriceCard } from './PriceCard'

export function PrintablePage({ products, pageNumber }: { products: Product[]; pageNumber: number }) {
  return (
    <section className="print-page" aria-label={`Página ${pageNumber}`}>
      <span className="page-number no-print">Página {pageNumber}</span>
      {[0, 1, 2].map((slot) => <div className="print-slot" key={slot}>{products[slot] && <PriceCard product={products[slot]} />}</div>)}
    </section>
  )
}
