'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

const categories = [
  { name: 'All', icon: 'grid_view' },
  { name: 'Textbooks', icon: 'menu_book' },
  { name: 'Tech', icon: 'laptop_mac' },
  { name: 'Dorm Life', icon: 'chair' },
  { name: 'Tickets', icon: 'confirmation_number' },
  { name: 'Apparel', icon: 'checkroom' },
]

export default function CategoryChips() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') || 'All'

  const handleClick = (name: string) => {
    const params = new URLSearchParams(searchParams)
    if (name === 'All') params.delete('category')
    else params.set('category', name)
    router.replace(`/?${params.toString()}`)
  }

  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-0.5">
        Browse by Category
      </h2>
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat, i) => {
          const isActive = active === cat.name
          return (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(cat.name)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold shrink-0 transition-colors duration-200 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:text-primary dark:hover:text-primary'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-primary'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {cat.icon}
              </span>
              {cat.name}
              {isActive && (
                <motion.span
                  layoutId="active-category-dot"
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
