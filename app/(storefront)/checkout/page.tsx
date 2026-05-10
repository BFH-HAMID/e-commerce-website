'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User,
  ArrowLeft,
  Check,
  Loader2,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/format'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/types'
import type { Address, PaymentMethod } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Bangladesh districts for dropdown
const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Comilla', 'Gazipur', 'Narayanganj', 'Bogra', 'Cox\'s Bazar', 'Jessore', 'Dinajpur',
  'Brahmanbaria', 'Tangail', 'Narsingdi', 'Savar', 'Tongi'
]

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [notes, setNotes] = useState('')

  const { 
    items, 
    couponCode,
    getSubtotal, 
    getShippingCost, 
    getDiscount,
    getTotal,
    clearCart
  } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading checkout...</div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const shippingCost = getShippingCost()
  const discount = getDiscount()
  const total = getTotal()

  // Redirect if cart is empty
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
              Add some products to your cart before checking out.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^01[3-9]\d{8}$/.test(shippingAddress.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid Bangladesh phone number'
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!shippingAddress.district) {
      newErrors.district = 'District is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Create order (mock for now - will connect to MongoDB later)
    const order = {
      items: items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.isFlashSale && item.product.flashSalePrice 
          ? item.product.flashSalePrice 
          : item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      total,
      couponCode,
      notes,
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store order in localStorage for demo (will use DB later)
    const orders = JSON.parse(localStorage.getItem('shopbd-orders') || '[]')
    const newOrder = {
      ...order,
      _id: `ORD-${Date.now()}`,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    }
    orders.push(newOrder)
    localStorage.setItem('shopbd-orders', JSON.stringify(orders))

    // Clear cart and redirect
    clearCart()
    router.push(`/orders/success?orderId=${newOrder._id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        />
                      </div>
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="01XXX-XXXXXX"
                          className="pl-10"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        />
                      </div>
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Street Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="House no, Road no, Area"
                      rows={2}
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City/Area <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g., Uttara"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">
                        District <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={shippingAddress.district}
                        onValueChange={(value) => setShippingAddress({ ...shippingAddress, district: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district && <p className="text-sm text-destructive">{errors.district}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="Optional"
                        value={shippingAddress.postalCode || ''}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <div className="space-y-3">
                      <label
                        htmlFor="cod"
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            <span className="font-medium">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                        <Check className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-primary' : 'text-transparent'}`} />
                      </label>

                      <label
                        htmlFor="bkash"
                        className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30 cursor-not-allowed opacity-60"
                      >
                        <RadioGroupItem value="bkash" id="bkash" disabled />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">bKash</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">Coming Soon</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay using bKash mobile wallet
                          </p>
                        </div>
                      </label>

                      <label
                        htmlFor="nagad"
                        className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30 cursor-not-allowed opacity-60"
                      >
                        <RadioGroupItem value="nagad" id="nagad" disabled />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Nagad</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">Coming Soon</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay using Nagad mobile wallet
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for delivery..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => {
                      const price = item.product.isFlashSale && item.product.flashSalePrice
                        ? item.product.flashSalePrice
                        : item.product.price

                      return (
                        <div key={item.product._id} className="flex gap-3">
                          <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={item.product.images[0] || '/placeholder.svg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(price)} x {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium shrink-0">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
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
                        <span className="text-muted-foreground">Discount {couponCode && `(${couponCode})`}</span>
                        <span className="text-green-500">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing this order, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
