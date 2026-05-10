'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'

interface WishlistState {
  items: Product[]
  
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  clearWishlist: () => void
  
  // Computed
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const items = get().items
        if (!items.find(item => item._id === product._id)) {
          set({ items: [...items, product] })
        }
      },
      
      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item._id !== productId) })
      },
      
      toggleItem: (product: Product) => {
        const items = get().items
        const exists = items.find(item => item._id === product._id)
        
        if (exists) {
          set({ items: items.filter(item => item._id !== product._id) })
        } else {
          set({ items: [...items, product] })
        }
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item._id === productId)
      },
      
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'shopbd-wishlist',
    }
  )
)
