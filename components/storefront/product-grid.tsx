import { ProductCard } from './product-card'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  showTimer?: boolean
}

export function ProductGrid({ products, showTimer = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} showTimer={showTimer} />
      ))}
    </div>
  )
}
