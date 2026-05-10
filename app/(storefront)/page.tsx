import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/storefront/hero'
import { CategoryNav } from '@/components/storefront/category-nav'
import { ProductGrid } from '@/components/storefront/product-grid'
import { FlashSaleTimer } from '@/components/storefront/flash-sale-timer'
import { getFeaturedProducts, getFlashSaleProducts, getNewArrivals } from '@/lib/mock-data'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const flashSaleProducts = getFlashSaleProducts()
  const newArrivals = getNewArrivals(8)

  // Get the earliest flash sale end time for the section timer
  const earliestFlashSaleEnd = flashSaleProducts.reduce((earliest, product) => {
    if (!product.flashSaleEnds) return earliest
    if (!earliest) return product.flashSaleEnds
    return new Date(product.flashSaleEnds) < new Date(earliest) ? product.flashSaleEnds : earliest
  }, null as string | null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Category Navigation */}
      <CategoryNav />

      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-accent/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Flash Sale</h2>
                </div>
                {earliestFlashSaleEnd && (
                  <FlashSaleTimer endDate={earliestFlashSaleEnd} />
                )}
              </div>
              <Button variant="outline" className="gap-2 w-fit" asChild>
                <Link href="/products?flash-sale=true">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={flashSaleProducts} showTimer />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/products?featured=true">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12">
            {/* Background pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Free Delivery on Orders Over ৳1,500
                </h3>
                <p className="text-primary-foreground/80">
                  Shop now and enjoy free shipping across Bangladesh
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 shrink-0"
                asChild
              >
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/products?sort=newest">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Free Shipping', description: 'On orders over ৳1,500', icon: '🚚' },
              { title: 'Secure Payment', description: 'Cash on Delivery available', icon: '🔒' },
              { title: 'Easy Returns', description: '7-day return policy', icon: '↩️' },
              { title: '24/7 Support', description: 'WhatsApp & phone support', icon: '💬' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
