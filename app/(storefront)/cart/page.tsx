'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag,
  X,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/format'
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '@/lib/types'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    applyCoupon,
    removeCoupon,
    couponCode,
    getSubtotal, 
    getShippingCost, 
    getDiscount,
    getTotal 
  } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const discount = getDiscount()
  const total = getTotal()
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal

  // Apply coupon (mock validation)
  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')
    
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    // Mock coupon validation
    const validCoupons: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
      'SAVE10': { type: 'percentage', value: 10 },
      'FLAT200': { type: 'fixed', value: 200 },
      'WELCOME': { type: 'percentage', value: 15 },
    }

    const coupon = validCoupons[couponInput.toUpperCase()]
    if (coupon) {
      const discountAmount = coupon.type === 'percentage' 
        ? (subtotal * coupon.value) / 100 
        : coupon.value
      applyCoupon(couponInput.toUpperCase(), discountAmount)
      setCouponSuccess(`Coupon applied! You saved ${formatPrice(discountAmount)}`)
      setCouponInput('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/products">
                Start Shopping
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
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">{items.length} items in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free delivery notice */}
            {remainingForFreeDelivery > 0 && (
              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm">
                  Add <span className="font-semibold text-primary">{formatPrice(remainingForFreeDelivery)}</span> more for free delivery!
                </p>
              </div>
            )}

            {/* Items */}
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {items.map((item) => {
                  const price = item.product.isFlashSale && item.product.flashSalePrice
                    ? item.product.flashSalePrice
                    : item.product.price

                  return (
                    <div key={item.product._id} className="flex gap-4 p-4">
                      {/* Image */}
                      <Link href={`/products/${item.product.slug}`} className="shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-lg overflow-hidden">
                          <Image
                            src={item.product.images[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link 
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">{item.product.category}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold">{formatPrice(price)}</span>
                          {item.product.comparePrice && item.product.comparePrice > price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.product.comparePrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-semibold text-primary">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Clear cart */}
            <div className="flex justify-between items-center">
              <Button variant="ghost" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={clearCart}>
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4" />
                    Have a coupon?
                  </div>
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div>
                        <p className="font-medium text-primary">{couponCode}</p>
                        <p className="text-sm text-muted-foreground">-{formatPrice(discount)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={removeCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleApplyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                  {couponSuccess && <p className="text-sm text-green-500">{couponSuccess}</p>}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-500' : ''}>
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-green-500">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full gap-2" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Payment info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>Cash on Delivery available</p>
                  <p className="mt-1">
                    <span className="text-muted-foreground/50">bKash & Nagad coming soon</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
