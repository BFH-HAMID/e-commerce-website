'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CartSheet } from './cart-sheet'
import { SearchDialog } from './search-dialog'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
            : 'bg-background border-b border-border/50'
        )}
      >
        {/* Top bar */}
        <div className="hidden md:block bg-primary/10 text-primary text-sm py-1.5">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p>Free delivery on orders over 1,500 BDT</p>
            <div className="flex items-center gap-4">
              <Link href="/orders" className="hover:underline">Track Order</Link>
              <span>|</span>
              <span>Support: +880 1700-000-000</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/nexobazar-logo.png" alt="NexoBazar" className="h-8 w-auto" />
              <span className="font-bold text-xl hidden sm:block">NexoBazar</span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Search products...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search - mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">Create Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account Settings</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <CartSheet>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Button>
              </CartSheet>
            </div>
          </div>
        </div>

        {/* Category navigation - desktop */}
        <nav className="hidden md:block border-t border-border/50">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1 py-2">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  {category.subcategories ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-sm">
                          {category.name}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/products?category=${category.slug}`}>
                            All {category.name}
                          </Link>
                        </DropdownMenuItem>
                        {category.subcategories.map((sub) => (
                          <DropdownMenuItem key={sub.slug} asChild>
                            <Link href={`/products?category=${category.slug}&subcategory=${sub.slug}`}>
                              {sub.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="sm" asChild className="text-sm">
                      <Link href={`/products?category=${category.slug}`}>
                        {category.name}
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
              <li>
                <Button variant="ghost" size="sm" asChild className="text-accent text-sm font-semibold">
                  <Link href="/products?flash-sale=true">
                    Flash Sale
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img src="/nexobazar-logo.png" alt="NexoBazar" className="h-8 w-auto" />
                <span className="font-bold text-xl">NexoBazar</span>
              </Link>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="block px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                              className="block px-4 py-1.5 text-sm text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/products?flash-sale=true"
                    className="block px-4 py-2 rounded-lg text-accent font-semibold hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Flash Sale
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-border space-y-2">
              <Button className="w-full" asChild>
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
