import { useState } from 'react'
import type { Product } from '../types/product'
import type { PromotionValidity } from '../types/promotion'
import { formatPrice } from '../utils/currency'
import { canShowPromotionValidity, formatPromotionValidity } from '../utils/promotionValidity'
import { getPromotionSize, getPromotionText } from '../utils/productPromotion'

const LOGO_URL = 'https://res.cloudinary.com/dtmziqubb/image/upload/v1785439910/DonAtilio_Color_FondoBlanco2-removebg-preview_2_ir9jya.png'

export function PriceCard({ product, promotionValidity }: { product: Product; promotionValidity?: PromotionValidity }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const nameLength = product.name.trim().length
  const nameSize = nameLength <= 22 ? 'short' : nameLength <= 42 ? 'medium' : nameLength <= 58 ? 'long' : 'extra-long'
  const formattedPrice = formatPrice(product.price)
  const priceSize = formattedPrice.length >= 10 ? 'long' : formattedPrice.length >= 8 ? 'medium' : 'standard'
  const footerLabel = product.status === 'oferta' ? 'OFERTA' : product.status === 'sin_stock' ? 'SIN STOCK' : ''
  const stockLabel = product.stockText.trim() || (product.status === 'oferta' ? 'HASTA AGOTAR STOCK' : '')
  const showPromotionValidity = product.status === 'oferta' && canShowPromotionValidity(promotionValidity)
  const promotionText = product.status === 'sin_stock' ? '' : getPromotionText(product.promotionType, product.promotionText)

  return (
    <article className={`price-card price-card--${product.status}`}>
      <header className="price-card__top">
        <div className="price-card__logo-wrap">
          {!logoFailed ? <img className="price-card__logo" src={LOGO_URL} alt="Don Atilio" onError={() => setLogoFailed(true)} /> : <span className="price-card__logo-fallback">Don Atilio</span>}
        </div>
        <div className={`price-card__price price-card__price--${priceSize}`}><span className="price-card__price-value">${formattedPrice}</span></div>
      </header>
      <div className={`price-card__name-wrap${showPromotionValidity ? ' price-card__name-wrap--with-validity' : ''}${promotionText ? ' price-card__name-wrap--with-promotion' : ''}`}>
        {promotionText && <p className={`product-promotion product-promotion--${getPromotionSize(promotionText)}`}>{promotionText}</p>}
        <h3 className={`price-card__name price-card__name--${nameSize}`}>{product.name}</h3>
        {showPromotionValidity && <p className="promotion-validity">{formatPromotionValidity(promotionValidity)}</p>}
      </div>
      <footer className="price-card__footer">
        <span className="price-card__stock">{stockLabel}</span>
        {footerLabel && <strong className="price-card__status">{footerLabel}</strong>}
      </footer>
    </article>
  )
}
