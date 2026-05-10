'use client'

import Link from 'next/link'
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Dumbbell, 
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  electronics: Smartphone,
  fashion: Shirt,
  'home-living': Home,
  beauty: Sparkles,
  sports: Dumbbell,
  books: BookOpen,
}

export function CategoryNav() {
  return (
    <section className="py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-semibold">Shop by Category</h2>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = categoryIcons[category.slug] || Smartphone
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl",
                  "bg-card border border-border/50 hover:border-primary/50",
                  "transition-all duration-200 hover:shadow-lg hover:shadow-primary/5",
                  "group"
                )}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
