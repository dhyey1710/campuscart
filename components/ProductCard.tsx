'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ProductCardProps = {
  id?: number
  title: string
  price: string
  image: string
  category: string
  condition: string
  index?: number
}

const conditionColors: Record<string, string> = {
  'New': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Like New': 'bg-sky-50 text-sky-700 border-sky-100',
  'Good': 'bg-amber-50 text-amber-700 border-amber-100',
  'Fair': 'bg-rose-50 text-rose-700 border-rose-100',
}

export default function ProductCard({ id, title, price, image, category, condition, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const conditionStyle = conditionColors[condition] || 'bg-slate-50 text-slate-600 border-slate-100'
  const displayPrice = price.startsWith('₹') || price.startsWith('$') ? price : `₹${price}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/30 transition-shadow duration-300 flex flex-col cursor-pointer"
    >
      <Link href={`/item/${id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
          )}
          <img
            src={image}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Condition badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${conditionStyle}`}>
              {condition}
            </span>
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(w => !w) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur flex items-center justify-center shadow-sm border border-white/50 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
          >
            <span
              className={`material-symbols-outlined text-lg transition-colors ${wishlisted ? 'text-rose-500' : 'text-slate-400'}`}
              style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{category}</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{displayPrice}</span>
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
              View Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
