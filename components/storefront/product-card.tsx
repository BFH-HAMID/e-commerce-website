'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { formatPrice, getDiscountPercentage } from '@/lib/format'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FlashSaleTimer } from './flash-sale-timer'

interface ProductCardProps {
  product: Product
  showTimer?: boolean
}

export function ProductCard({ product, showTimer = false }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  
  const inWishlist = isInWishlist(product._id)
  const effectivePrice = product.isFlashSale && product.flashSalePrice 
    ? product.flashSalePrice 
    : product.price
  const hasDiscount = product.comparePrice && product.comparePrice > effectivePrice
  const discountPercent = hasDiscount 
    ? getDiscountPercentage(product.comparePrice!, effectivePrice)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isFlashSale && (
          <Badge className="bg-accent text-accent-foreground font-semibold">
            Flash Sale
          </Badge>
        )}
        {hasDiscount && !product.isFlashSale && (
          <Badge variant="secondary" className="font-semibold">
            -{discountPercent}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="destructive" className="font-semibold">
            Low Stock
          </Badge>
        )}
      </div>

      {/* Wishlist button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-3 right-3 z-10 h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background",
          inWishlist && "text-red-500 hover:text-red-600"
        )}
        onClick={handleToggleWishlist}
      >
        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
      </Button>

      <Link href={`/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          
          {/* Name */}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.ratings.average}</span>
            <span className="text-xs text-muted-foreground">({product.ratings.count})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-primary">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          {/* Flash sale timer */}
          {showTimer && product.isFlashSale && product.flashSaleEnds && (
            <div className="mt-2">
              <FlashSaleTimer endDate={product.flashSaleEnds} compact />
            </div>
          )}
        </CardContent>
      </Link>

      {/* Add to cart button */}
      <div className="px-4 pb-4">
        <Button 
          className="w-full gap-2" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}
