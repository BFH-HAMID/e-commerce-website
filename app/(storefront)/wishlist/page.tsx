'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice, getDiscountPercentage } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading wishlist...</div>
      </div>
    )
  }

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addToCart(product)
    removeItem(product._id)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love by clicking the heart icon on products.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/products">
                Browse Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground mt-2">{items.length} saved items</p>
            </div>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const effectivePrice = product.isFlashSale && product.flashSalePrice 
              ? product.flashSalePrice 
              : product.price
            const hasDiscount = product.comparePrice && product.comparePrice > effectivePrice
            const discountPercent = hasDiscount 
              ? getDiscountPercentage(product.comparePrice!, effectivePrice)
              : 0

            return (
              <Card key={product._id} className="group overflow-hidden">
                {/* Image */}
                <div className="relative aspect-square bg-secondary overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isFlashSale && (
                      <Badge className="bg-accent text-accent-foreground">Flash Sale</Badge>
                    )}
                    {hasDiscount && !product.isFlashSale && (
                      <Badge variant="secondary">-{discountPercent}%</Badge>
                    )}
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-9 w-9 bg-background/80 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-background"
                    onClick={() => removeItem(product._id)}
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>

                  {/* Out of stock overlay */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="font-semibold text-muted-foreground">Out of Stock</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{formatPrice(effectivePrice)}</span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.comparePrice!)}
                      </span>
                    )}
                  </div>

                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Move to Cart
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
