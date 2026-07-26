import type { Product } from '../types/product'
import { formatPrice } from '../utils/currency'

export function PriceCard({ product }: { product: Product }) {
  const longName = product.name.length > 55
  return (
    <article className={`price-card price-card--${product.status}`}>
      <div className="price-card__top">
        <img className="brand-logo" src="/logo-don-atilio.svg" alt="Logo de Don Atilio" />
        {product.status === 'oferta' && <div className="status-ribbon">OFERTA</div>}
        {product.status === 'sin_stock' && <div className="status-ribbon status-ribbon--empty">SIN STOCK</div>}
      </div>
      <div className="price-card__content">
        <h3 className={longName ? 'is-long' : ''}>{product.name}</h3>
        <div className="price"><span className="price__symbol">$</span><span>{formatPrice(product.price)}</span></div>
      </div>
      <footer className="price-card__footer">
        <span>{product.stockText}</span>
        {product.stock !== null && <strong>{product.stock} UNIDADES DISPONIBLES</strong>}
      </footer>
    </article>
  )
}
