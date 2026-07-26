import { useMemo, useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { PrintButton } from './components/PrintButton'
import { PrintablePage } from './components/PrintablePage'
import { ProductForm } from './components/ProductForm'
import { ProductList } from './components/ProductList'
import { branches } from './data/branches'
import { mockProducts } from './data/mockProducts'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Product } from './types/product'
import { paginate } from './utils/pagination'

const isProductArray = (value: unknown): value is Product[] => Array.isArray(value) && value.every((item) => {
  if (!item || typeof item !== 'object') return false
  const product = item as Record<string, unknown>
  return typeof product.id === 'string' && typeof product.name === 'string' && typeof product.price === 'number' && product.price > 0 && ['oferta', 'normal', 'sin_stock'].includes(String(product.status)) && (product.stock === null || (typeof product.stock === 'number' && product.stock >= 0)) && typeof product.stockText === 'string' && branches.some((branch) => branch.id === product.branchId)
})

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('don-atilio-products', mockProducts, isProductArray)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedBranch, setSelectedBranch] = useState('centro')
  const visibleProducts = useMemo(() => products.filter((product) => product.branchId === selectedBranch), [products, selectedBranch])
  const pages = useMemo(() => paginate(visibleProducts), [visibleProducts])

  const saveProduct = (product: Product) => {
    setProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [...current, product])
    setEditingProduct(null)
  }

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id))
    if (editingProduct?.id === id) setEditingProduct(null)
  }

  const loadDemo = () => {
    const copies = mockProducts.map((product) => ({ ...product, id: crypto.randomUUID() }))
    setProducts((current) => [...current, ...copies])
  }

  const clearAll = () => {
    if (products.length && window.confirm('¿Eliminar todos los productos? Esta acción no se puede deshacer.')) {
      setProducts([])
      setEditingProduct(null)
    }
  }

  return (
    <>
      <AppHeader />
      <main className="app-layout">
        <aside className="admin-panel no-print">
          <section className="panel-card">
            <div className="section-heading"><div><span className="eyebrow">GESTIÓN</span><h2>Productos</h2></div><span className="count-badge">{products.length}</span></div>
            <ProductForm editingProduct={editingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} />
          </section>
          <section className="panel-card product-section">
            <div className="list-toolbar"><h3>Productos cargados</h3><div><button type="button" onClick={loadDemo}>Cargar demostración</button><button className="danger-link" type="button" onClick={clearAll} disabled={!products.length}>Eliminar todos</button></div></div>
            <ProductList products={products} editingId={editingProduct?.id} onEdit={setEditingProduct} onDelete={deleteProduct} />
          </section>
        </aside>
        <section className="preview-panel">
          <div className="preview-toolbar no-print">
            <div><span className="eyebrow">RESULTADO</span><h2>Vista previa</h2><p>{visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'} · {pages.length} {pages.length === 1 ? 'página' : 'páginas'}</p></div>
            <div className="preview-actions"><label htmlFor="preview-branch">Sucursal</label><select id="preview-branch" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>{branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}</select><PrintButton /></div>
          </div>
          <div className="pages-container">
            {pages.length ? pages.map((page, index) => <PrintablePage products={page} pageNumber={index + 1} key={index} />) : <div className="empty-preview no-print"><strong>No hay carteles para esta sucursal.</strong><span>Agregá un producto o elegí otra sucursal.</span></div>}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
