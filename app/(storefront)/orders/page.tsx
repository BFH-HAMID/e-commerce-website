'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Search,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice, formatDate } from '@/lib/format'
import type { Order, OrderStatus } from '@/lib/types'

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
}

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setMounted(true)
    // Load orders from localStorage (mock data)
    const savedOrders = JSON.parse(localStorage.getItem('shopbd-orders') || '[]')
    setOrders(savedOrders)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading orders...</div>
      </div>
    )
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || order.orderStatus === activeTab
    return matchesSearch && matchesTab
  })

  if (orders.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
            <p className="text-muted-foreground mb-8">
              When you place an order, it will appear here.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Start Shopping</Link>
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
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">{orders.length} total orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.orderStatus]
                  const StatusIcon = status.icon

                  return (
                    <Card key={order._id}>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <code className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                              {order._id}
                            </code>
                            <Badge variant="outline" className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Items preview */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              {order.items.slice(0, 3).map((item, i) => (
                                <div key={i} className="relative w-14 h-14 bg-secondary rounded-lg overflow-hidden">
                                  <Image
                                    src={item.image || '/placeholder.svg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                            </p>
                          </div>

                          {/* Total & Action */}
                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                            <p className="font-semibold text-lg text-primary">
                              {formatPrice(order.total)}
                            </p>
                            <Button variant="outline" size="sm" className="gap-1" asChild>
                              <Link href={`/orders/${order._id}`}>
                                View Details
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
