import type { Product } from '../types/product'

export const mockProducts: Product[] = [
  {
    id: 'demo-1',
    name: 'PAN BIMBO HAMBURGUESA ARTESANO ORIGINAL X240G',
    price: 1699.19,
    status: 'oferta',
    stock: 30,
    stockText: 'HASTA AGOTAR STOCK',
    branchId: 'centro',
  },
  {
    id: 'demo-2',
    name: 'PAN BIMBO ARTESANO INTEGRAL CON MASA MADRE X500G',
    price: 4313.33,
    status: 'oferta',
    stock: 25,
    stockText: '',
    branchId: 'centro',
  },
  {
    id: 'demo-3',
    name: 'PAN BIMBO HAMBURGUESA ARTESANO PAPA X240G',
    price: 2393.18,
    status: 'oferta',
    stock: null,
    stockText: '',
    branchId: 'centro',
  },
]
