'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Truck, Shield, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Flash Sale Live Now</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Premium Shopping
              <span className="text-primary block">Experience</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover the latest trends and premium quality products with fast delivery across Bangladesh. Shop with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 text-base" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/products?flash-sale=true">
                  View Flash Sales
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Free Delivery</p>
                  <p className="text-xs">Orders over ৳1,500</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Secure Payment</p>
                  <p className="text-xs">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">24/7 Support</p>
                  <p className="text-xs">Dedicated help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
              
              {/* Main image */}
              <div className="relative z-10 bg-gradient-to-br from-card to-secondary rounded-2xl p-8 border border-border">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                  alt="Premium headphones"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating badges */}
              <div className="absolute top-8 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg z-20">
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="text-xl font-bold text-primary">৳2,999</p>
              </div>
              <div className="absolute bottom-8 -right-4 bg-accent text-accent-foreground rounded-xl px-4 py-3 shadow-lg z-20">
                <p className="text-sm font-bold">Up to 50% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
