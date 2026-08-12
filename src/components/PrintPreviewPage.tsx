import { useEffect, useRef, useState } from 'react'
import type { Product } from '../types/product'
import type { PromotionValidity } from '../types/promotion'
import { PrintablePage } from './PrintablePage'

const A4_WIDTH_PX = 210 * 96 / 25.4
const A4_HEIGHT_PX = 297 * 96 / 25.4

export function PrintPreviewPage({ products, pageNumber, promotionValidity }: { products: Product[]; pageNumber: number; promotionValidity?: PromotionValidity }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const resize = () => setScale(Math.min(1, viewport.clientWidth / A4_WIDTH_PX))
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    resize()
    return () => observer.disconnect()
  }, [])
  return <div className="print-preview-viewport" ref={viewportRef} style={{ height: `${A4_HEIGHT_PX * scale}px` }}><div className="print-preview-scaler" style={{ transform: `scale(${scale})` }}><PrintablePage products={products} pageNumber={pageNumber} promotionValidity={promotionValidity} /></div></div>
}
