'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import confetti from 'canvas-confetti'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00d4ff', '#ffa500', '#22c55e'],
    })
  }, [])

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We&apos;ll send you a confirmation via SMS.
            </p>
          </div>

          {/* Order ID */}
          {orderId && (
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-semibold">{orderId}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyOrderId}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-card border border-border rounded-lg p-4 text-left space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              What happens next?
            </h3>
            <ol className="text-sm text-muted-foreground space-y-2 ml-7 list-decimal">
              <li>You&apos;ll receive an SMS confirmation shortly</li>
              <li>We&apos;ll prepare and ship your order within 24-48 hours</li>
              <li>Pay in cash when your order arrives</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button className="w-full gap-2" asChild>
              <Link href="/orders">
                Track Your Order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          {/* Support */}
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{' '}
            <a href="tel:+8801700000000" className="text-primary hover:underline">
              +880 1700-000-000
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
