'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Clock, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/format'
import Fuse from 'fuse.js'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('shopbd-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(MOCK_PRODUCTS, {
      keys: ['name', 'description', 'category', 'tags'],
      threshold: 0.4,
      includeScore: true,
    })
  }, [])

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 8).map(result => result.item)
  }, [query, fuse])

  // Save search to recent
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('shopbd-recent-searches', JSON.stringify(updated))
  }

  // Handle result click
  const handleResultClick = () => {
    handleSearch(query)
    onOpenChange(false)
    setQuery('')
  }

  // Popular searches (static for now)
  const popularSearches = ['Smartphone', 'Laptop', 'Headphones', 'Watch', 'Shoes']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[60vh]">
          {query.trim() ? (
            // Search results
            <div className="p-4">
              {results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    {results.length} results for &quot;{query}&quot;
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="relative w-14 h-14 bg-muted rounded-md overflow-hidden shrink-0">
                        <Image
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPrice(product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No products found for &quot;{query}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          ) : (
            // Recent & popular searches
            <div className="p-4 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="px-3 py-1.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> to search</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
