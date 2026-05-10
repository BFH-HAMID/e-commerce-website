'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/lib/types'
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '@/lib/types'

interface CartState {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  
  // Computed
  getSubtotal: () => number
  getShippingCost: () => number
  getDiscount: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      
      addItem: (product: Product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.product._id === product._id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product._id === product._id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: Math.min(quantity, product.stock) }] })
        }
      },
      
      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.product._id !== productId) })
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product._id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item
          ),
        })
      },
      
      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 })
      },
      
      applyCoupon: (code: string, discount: number) => {
        set({ couponCode: code, couponDiscount: discount })
      },
      
      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 })
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.isFlashSale && item.product.flashSalePrice
            ? item.product.flashSalePrice
            : item.product.price
          return total + price * item.quantity
        }, 0)
      },
      
      getShippingCost: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
      },
      
      getDiscount: () => {
        return get().couponDiscount
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getShippingCost() - get().getDiscount()
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'shopbd-cart',
    }
  )
)
