export type ProductStatus = 'oferta' | 'normal' | 'sin_stock'

export type Product = {
  id: string
  name: string
  price: number
  status: ProductStatus
  stock: number | null
  stockText: string
  branchId: string
}
