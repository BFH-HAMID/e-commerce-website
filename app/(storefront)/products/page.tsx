'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/storefront/product-grid'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import Fuse from 'fuse.js'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  
  // URL params
  const categoryParam = searchParams.get('category')
  const subcategoryParam = searchParams.get('subcategory')
  const flashSaleParam = searchParams.get('flash-sale')
  const featuredParam = searchParams.get('featured')
  const searchParam = searchParams.get('search')
  
  // Filter state
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  )
  const [showFlashSale, setShowFlashSale] = useState(flashSaleParam === 'true')
  const [showFeatured, setShowFeatured] = useState(featuredParam === 'true')
  const [searchQuery, setSearchQuery] = useState(searchParam || '')
  const [minRating, setMinRating] = useState(0)

  // Initialize Fuse for search
  const fuse = useMemo(() => {
    return new Fuse(MOCK_PRODUCTS, {
      keys: ['name', 'description', 'category', 'tags'],
      threshold: 0.4,
    })
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS]

    // Search filter
    if (searchQuery.trim()) {
      const results = fuse.search(searchQuery)
      products = results.map(r => r.item)
    }

    // Category filter
    if (selectedCategories.length > 0) {
      products = products.filter(p => 
        selectedCategories.some(cat => 
          p.category.toLowerCase() === cat.toLowerCase()
        )
      )
    }

    // Subcategory filter
    if (subcategoryParam) {
      products = products.filter(p => 
        p.subcategory?.toLowerCase() === subcategoryParam.toLowerCase()
      )
    }

    // Flash sale filter
    if (showFlashSale) {
      products = products.filter(p => p.isFlashSale)
    }

    // Featured filter
    if (showFeatured) {
      products = products.filter(p => p.isFeatured)
    }

    // Price range filter
    products = products.filter(p => {
      const price = p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Rating filter
    if (minRating > 0) {
      products = products.filter(p => p.ratings.average >= minRating)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-asc':
        products.sort((a, b) => {
          const priceA = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price
          const priceB = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price
          return priceA - priceB
        })
        break
      case 'price-desc':
        products.sort((a, b) => {
          const priceA = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price
          const priceB = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price
          return priceB - priceA
        })
        break
      case 'popular':
        products.sort((a, b) => b.ratings.count - a.ratings.count)
        break
      case 'rating':
        products.sort((a, b) => b.ratings.average - a.ratings.average)
        break
    }

    return products
  }, [searchQuery, selectedCategories, subcategoryParam, showFlashSale, showFeatured, priceRange, minRating, sortBy, fuse])

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([])
    setShowFlashSale(false)
    setShowFeatured(false)
    setPriceRange([0, 100000])
    setMinRating(0)
    setSearchQuery('')
  }

  // Check if any filters are active
  const hasActiveFilters = selectedCategories.length > 0 || showFlashSale || showFeatured || 
    priceRange[0] > 0 || priceRange[1] < 100000 || minRating > 0 || searchQuery.trim()

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium">Search</Label>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium">Categories</Label>
        <div className="space-y-2 mt-2">
          {CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center gap-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.slug])
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== category.slug))
                  }
                }}
              />
              <label htmlFor={category.slug} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="mt-4 px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={500}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2 mt-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => {
                  setMinRating(checked ? rating : 0)
                }}
              />
              <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                {rating}+ Stars
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <Label className="text-sm font-medium">Special</Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="flash-sale"
              checked={showFlashSale}
              onCheckedChange={(checked) => setShowFlashSale(!!checked)}
            />
            <label htmlFor="flash-sale" className="text-sm cursor-pointer">
              Flash Sale Only
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={showFeatured}
              onCheckedChange={(checked) => setShowFeatured(!!checked)}
            />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              Featured Only
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  // Page title
  const getPageTitle = () => {
    if (flashSaleParam === 'true') return 'Flash Sale'
    if (featuredParam === 'true') return 'Featured Products'
    if (categoryParam) {
      const cat = CATEGORIES.find(c => c.slug === categoryParam)
      return cat?.name || 'Products'
    }
    return 'All Products'
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <p className="text-muted-foreground mt-2">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedCategories.length + (showFlashSale ? 1 : 0) + (showFeatured ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active filter badges */}
                <div className="hidden md:flex flex-wrap gap-2">
                  {selectedCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      {CATEGORIES.find(c => c.slug === cat)?.name}
                      <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {showFlashSale && (
                    <Badge variant="secondary" className="gap-1">
                      Flash Sale
                      <button onClick={() => setShowFlashSale(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
