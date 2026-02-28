'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import CategoryChips from '@/components/CategoryChips'
import ProductGrid from '@/components/ProductGrid'
import { Suspense } from 'react'

const trustItems = [
  { icon: 'verified', title: 'Verified Students', desc: 'Only active .edu email holders can list items on our platform.' },
  { icon: 'location_on', title: 'Campus Meetups', desc: 'Safe exchange zones in university common areas, always.' },
  { icon: 'shield_moon', title: 'Safe Payments', desc: 'Built-in student protection policies on every transaction.' },
]

export default function Home() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <Suspense><HeroSection /></Suspense>
      <Suspense><CategoryChips /></Suspense>
      <Suspense><ProductGrid /></Suspense>

      {/* Trust & Safety */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Built for Student Safety</h2>
          <p className="text-slate-500 text-sm mt-1">Every feature designed to keep campus transactions secure.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {trustItems.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {icon}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Back to top */}
      <motion.button
        animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 16 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-6 z-40 w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors pointer-events-auto"
        style={{ pointerEvents: showTop ? 'auto' : 'none' }}
      >
        <span className="material-symbols-outlined text-lg">arrow_upward</span>
      </motion.button>
    </>
  )
}
