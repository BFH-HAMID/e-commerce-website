import type { Product } from './types'

// Mock products for development
export const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'Premium Wireless Headphones Pro',
    slug: 'premium-wireless-headphones-pro',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 40-hour battery life, and ultra-comfortable ear cushions. Perfect for music lovers and professionals alike.',
    price: 8999,
    comparePrice: 12999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    category: 'Electronics',
    subcategory: 'Accessories',
    stock: 25,
    sku: 'WH-PRO-001',
    tags: ['headphones', 'wireless', 'audio', 'premium'],
    ratings: { average: 4.8, count: 234 },
    isFlashSale: true,
    flashSalePrice: 6999,
    flashSaleEnds: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Smart Watch Series X',
    slug: 'smart-watch-series-x',
    description: 'Stay connected and track your fitness with our latest smartwatch. Features include heart rate monitoring, GPS, water resistance, and a stunning AMOLED display.',
    price: 15999,
    comparePrice: 19999,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80',
    ],
    category: 'Electronics',
    subcategory: 'Accessories',
    stock: 50,
    sku: 'SW-SX-001',
    tags: ['smartwatch', 'fitness', 'wearable'],
    ratings: { average: 4.6, count: 189 },
    isFlashSale: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Ultra-Slim Laptop 15 Pro',
    slug: 'ultra-slim-laptop-15-pro',
    description: 'Powerful performance meets elegant design. Featuring the latest processor, 16GB RAM, 512GB SSD, and a beautiful 15.6" 4K display for professionals and creators.',
    price: 89999,
    comparePrice: 99999,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
    ],
    category: 'Electronics',
    subcategory: 'Laptops',
    stock: 15,
    sku: 'LP-15P-001',
    tags: ['laptop', 'professional', 'productivity'],
    ratings: { average: 4.9, count: 87 },
    isFlashSale: true,
    flashSalePrice: 79999,
    flashSaleEnds: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Premium Leather Backpack',
    slug: 'premium-leather-backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment, multiple pockets, and elegant brass hardware. Perfect for work or travel.',
    price: 4599,
    comparePrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80',
    ],
    category: 'Fashion',
    subcategory: 'Men',
    stock: 30,
    sku: 'BP-LTH-001',
    tags: ['backpack', 'leather', 'travel', 'work'],
    ratings: { average: 4.7, count: 156 },
    isFlashSale: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Minimalist Running Shoes',
    slug: 'minimalist-running-shoes',
    description: 'Lightweight and breathable running shoes with responsive cushioning and excellent grip. Designed for both casual runners and athletes.',
    price: 3499,
    comparePrice: 4499,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',
    ],
    category: 'Sports',
    stock: 100,
    sku: 'SH-RUN-001',
    tags: ['shoes', 'running', 'sports', 'fitness'],
    ratings: { average: 4.5, count: 312 },
    isFlashSale: true,
    flashSalePrice: 2799,
    flashSaleEnds: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Elegant Silk Scarf',
    slug: 'elegant-silk-scarf',
    description: 'Luxurious 100% pure silk scarf with beautiful hand-painted floral design. A perfect accessory for any occasion.',
    price: 2299,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    ],
    category: 'Fashion',
    subcategory: 'Women',
    stock: 45,
    sku: 'SC-SLK-001',
    tags: ['scarf', 'silk', 'accessories', 'women'],
    ratings: { average: 4.8, count: 89 },
    isFlashSale: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '7',
    name: 'Professional Camera Lens 50mm',
    slug: 'professional-camera-lens-50mm',
    description: 'Sharp, fast 50mm f/1.4 lens perfect for portraits and low-light photography. Compatible with major camera brands.',
    price: 35999,
    comparePrice: 42999,
    images: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80',
    ],
    category: 'Electronics',
    subcategory: 'Accessories',
    stock: 8,
    sku: 'CL-50F-001',
    tags: ['camera', 'lens', 'photography', 'professional'],
    ratings: { average: 4.9, count: 67 },
    isFlashSale: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '8',
    name: 'Modern Desk Lamp LED',
    slug: 'modern-desk-lamp-led',
    description: 'Sleek LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Perfect for your workspace.',
    price: 1999,
    comparePrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    ],
    category: 'Home & Living',
    subcategory: 'Decor',
    stock: 60,
    sku: 'LP-DSK-001',
    tags: ['lamp', 'desk', 'LED', 'office'],
    ratings: { average: 4.4, count: 203 },
    isFlashSale: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '9',
    name: 'Ceramic Coffee Mug Set',
    slug: 'ceramic-coffee-mug-set',
    description: 'Set of 4 handcrafted ceramic mugs in earthy tones. Microwave and dishwasher safe. Perfect for your morning coffee.',
    price: 1299,
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
    ],
    category: 'Home & Living',
    subcategory: 'Kitchen',
    stock: 80,
    sku: 'MG-CRM-001',
    tags: ['mug', 'ceramic', 'kitchen', 'coffee'],
    ratings: { average: 4.6, count: 145 },
    isFlashSale: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '10',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'True wireless earbuds with active noise cancellation, 30-hour total battery life, and premium sound quality.',
    price: 5499,
    comparePrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    ],
    category: 'Electronics',
    subcategory: 'Accessories',
    stock: 40,
    sku: 'EB-PRO-001',
    tags: ['earbuds', 'wireless', 'audio', 'ANC'],
    ratings: { average: 4.7, count: 278 },
    isFlashSale: true,
    flashSalePrice: 4299,
    flashSaleEnds: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '11',
    name: 'Organic Skincare Set',
    slug: 'organic-skincare-set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Made with 100% organic ingredients.',
    price: 3999,
    comparePrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    ],
    category: 'Beauty',
    subcategory: 'Skincare',
    stock: 35,
    sku: 'SK-ORG-001',
    tags: ['skincare', 'organic', 'beauty', 'natural'],
    ratings: { average: 4.8, count: 167 },
    isFlashSale: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '12',
    name: 'Classic Leather Wallet',
    slug: 'classic-leather-wallet',
    description: 'Slim bifold wallet crafted from genuine leather with RFID blocking technology. Multiple card slots and bill compartment.',
    price: 1899,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    ],
    category: 'Fashion',
    subcategory: 'Men',
    stock: 55,
    sku: 'WL-LTH-001',
    tags: ['wallet', 'leather', 'RFID', 'men'],
    ratings: { average: 4.5, count: 198 },
    isFlashSale: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
]

// Get featured products
export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter(p => p.isFeatured)
}

// Get flash sale products
export function getFlashSaleProducts(): Product[] {
  return MOCK_PRODUCTS.filter(p => p.isFlashSale)
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.slug === slug)
}

// Get new arrivals (sorted by creation date)
export function getNewArrivals(limit = 8): Product[] {
  return [...MOCK_PRODUCTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}
