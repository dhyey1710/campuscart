'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'

// Loading skeleton for a single card
function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col"
    >
      <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mt-2" />
        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>
    </motion.div>
  )
}

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('search')?.toLowerCase() || ''
  const categoryQuery = searchParams.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    fetch('/api/items')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery) ||
      p.category?.toLowerCase().includes(searchQuery)
    const matchCat = categoryQuery === 'All' || p.category === categoryQuery
    return matchSearch && matchCat
  })

  const heading = categoryQuery !== 'All'
    ? `${categoryQuery} Items`
    : searchQuery
      ? `Results for "${searchQuery}"`
      : 'Featured for You'

  return (
    <section id="listings">
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          key={heading}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          {heading}
          {!loading && (
            <span className="ml-2 text-sm font-semibold text-slate-400">
              ({filtered.length})
            </span>
          )}
        </motion.h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:block">Sort:</span>
          <select className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Newest</option>
            <option>Price: Low</option>
            <option>Price: High</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} delay={i * 0.05} />
            ))}
          </motion.div>
        ) : filtered.length > 0 ? (
          <motion.div
            key="results"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} index={i} {...p} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700 dark:text-slate-200">No items found</p>
              <p className="text-sm text-slate-500 mt-1">Try a different search or category.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
