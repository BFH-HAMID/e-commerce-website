'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { getProductBySlug, MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice, getDiscountPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { FlashSaleTimer } from '@/components/storefront/flash-sale-timer'
import { ProductGrid } from '@/components/storefront/product-grid'
import { WhatsAppButton } from '@/components/storefront/whatsapp-button'
import { WHATSAPP_NUMBER, FREE_DELIVERY_THRESHOLD } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  if (!product) {
    notFound()
  }

  const inWishlist = isInWishlist(product._id)
  const effectivePrice = product.isFlashSale && product.flashSalePrice 
    ? product.flashSalePrice 
    : product.price
  const hasDiscount = product.comparePrice && product.comparePrice > effectivePrice
  const discountPercent = hasDiscount 
    ? getDiscountPercentage(product.comparePrice!, effectivePrice)
    : 0

  // Related products (same category, excluding current)
  const relatedProducts = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    window.location.href = '/checkout'
  }

  // WhatsApp message
  const whatsappMessage = `Hi! I'm interested in "${product.name}" (${formatPrice(effectivePrice)}). Can you tell me more about it?`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-card rounded-xl overflow-hidden border border-border">
              <Image
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isFlashSale && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Flash Sale
                </Badge>
              )}
              {hasDiscount && !product.isFlashSale && (
                <Badge className="absolute top-4 left-4" variant="secondary">
                  -{discountPercent}% OFF
                </Badge>
              )}
              
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-colors",
                      selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & SKU */}
            <div className="flex items-center justify-between">
              <Link 
                href={`/products?category=${product.category.toLowerCase()}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category}
              </Link>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.ratings.average)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.ratings.average}</span>
              <span className="text-sm text-muted-foreground">({product.ratings.count} reviews)</span>
            </div>

            {/* Flash Sale Timer */}
            {product.isFlashSale && product.flashSaleEnds && (
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <FlashSaleTimer endDate={product.flashSaleEnds} />
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{formatPrice(effectivePrice)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.comparePrice!)}
                    </span>
                    <Badge variant="secondary" className="text-sm">
                      Save {formatPrice(product.comparePrice! - effectivePrice)}
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {effectivePrice >= FREE_DELIVERY_THRESHOLD 
                  ? 'Free delivery on this item!' 
                  : `Add ${formatPrice(FREE_DELIVERY_THRESHOLD - effectivePrice)} more for free delivery`
                }
              </p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">
                    {product.stock < 10 
                      ? `Only ${product.stock} left in stock - order soon!`
                      : 'In Stock'
                    }
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(inWishlist && "text-red-500 border-red-500/50")}
                onClick={() => toggleItem(product)}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </Button>
            </div>

            {/* WhatsApp & Share */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Over ৳1,500</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">1 Year</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Reviews ({product.ratings.count})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Key Features</h3>
              <ul className="space-y-2">
                {product.tags.map((tag, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="capitalize">{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              {product.subcategory && (
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Subcategory</span>
                  <span className="font-medium">{product.subcategory}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Reviews coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  )
}
