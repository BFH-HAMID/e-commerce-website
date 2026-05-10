'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/lib/format'
import type { Order, OrderStatus } from '@/lib/types'
import { WHATSAPP_NUMBER } from '@/lib/types'

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
}

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    setMounted(true)
    // Load order from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('shopbd-orders') || '[]')
    const foundOrder = savedOrders.find((o: Order) => o._id === id)
    setOrder(foundOrder || null)
  }, [id])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t find an order with ID: {id}
          </p>
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  const status = statusConfig[order.orderStatus]
  const StatusIcon = status.icon
  const currentStepIndex = statusSteps.indexOf(order.orderStatus)

  // WhatsApp support
  const whatsappMessage = `Hi! I have a question about my order ${order._id}`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link href="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Order {order._id}</h1>
                <Badge variant="outline" className={status.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Need Help?
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            {order.orderStatus !== 'cancelled' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                    <div 
                      className="absolute top-5 left-5 h-0.5 bg-primary transition-all"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                    
                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {statusSteps.map((step, index) => {
                        const stepStatus = statusConfig[step]
                        const StepIcon = stepStatus.icon
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex

                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                                isCompleted 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary text-muted-foreground'
                              } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                            >
                              <StepIcon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs mt-2 ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {stepStatus.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.district}
                      {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.paymentStatus === 'pending' ? 'Payment on delivery' : order.paymentStatus}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={order.shippingCost === 0 ? 'text-green-500' : ''}>
                      {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Discount {order.couponCode && `(${order.couponCode})`}
                      </span>
                      <span className="text-green-500">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-1">Order Notes</p>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  </>
                )}

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-1">Tracking Number</p>
                      <code className="text-sm bg-secondary px-2 py-1 rounded">
                        {order.trackingNumber}
                      </code>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
