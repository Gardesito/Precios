export type ProductStatus = 'oferta' | 'normal' | 'sin_stock'

export type PromotionType =
  | 'none'
  | '2x1'
  | '3x2'
  | '4x3'
  | 'second_unit_50'
  | 'second_unit_70'
  | 'buy_2_pay_1'
  | 'buy_2_20_off'
  | 'custom'

export type Product = {
  id: string
  code?: string
  name: string
  category?: string
  previousPrice?: number | null
  price: number
  discount?: number | null
  status: ProductStatus
  stock: number | null
  stockText: string
  branchId: string
  promotionType?: PromotionType
  promotionText?: string
}
