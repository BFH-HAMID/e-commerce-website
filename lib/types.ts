// Product Types
export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subcategory?: string
  stock: number
  sku: string
  tags: string[]
  ratings: {
    average: number
    count: number
  }
  isFlashSale: boolean
  flashSalePrice?: number
  flashSaleEnds?: string
  isFeatured: boolean
  createdAt: string
}

// Cart Types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  couponCode?: string
}

// Order Types
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Address {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode?: string
  isDefault?: boolean
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  couponCode?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// User Types
export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  addresses: Address[]
  wishlist: string[]
  createdAt: string
}

// Coupon Types
export interface Coupon {
  _id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue?: number
  maxUses?: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
}

// Category for navigation
export interface Category {
  name: string
  slug: string
  icon?: string
  subcategories?: { name: string; slug: string }[]
}

// Constants
export const CATEGORIES: Category[] = [
  { name: 'Electronics', slug: 'electronics', subcategories: [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Accessories', slug: 'accessories' },
  ]},
  { name: 'Fashion', slug: 'fashion', subcategories: [
    { name: 'Men', slug: 'men' },
    { name: 'Women', slug: 'women' },
    { name: 'Kids', slug: 'kids' },
  ]},
  { name: 'Home & Living', slug: 'home-living', subcategories: [
    { name: 'Furniture', slug: 'furniture' },
    { name: 'Decor', slug: 'decor' },
    { name: 'Kitchen', slug: 'kitchen' },
  ]},
  { name: 'Beauty', slug: 'beauty', subcategories: [
    { name: 'Skincare', slug: 'skincare' },
    { name: 'Makeup', slug: 'makeup' },
    { name: 'Fragrances', slug: 'fragrances' },
  ]},
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' },
]

export const FREE_DELIVERY_THRESHOLD = 1500 // BDT
export const STANDARD_DELIVERY_FEE = 60 // BDT
export const WHATSAPP_NUMBER = '+8801700000000' // Replace with actual number
