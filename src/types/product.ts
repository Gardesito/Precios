export type ProductStatus = 'oferta' | 'normal' | 'sin_stock'

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
}
