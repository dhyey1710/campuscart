'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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
  const trustRef = useRef<HTMLElement>(null)

  const { scrollYProgress: trustScroll } = useScroll({
    target: trustRef,
    offset: ['start end', 'end start'],
  })
  const trustY = useTransform(trustScroll, [0, 1], ['30px', '-30px'])

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
        ref={trustRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <motion.div style={{ y: trustY }} className="will-change-transform">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-black text-slate-900 dark:text-white"
            >
              Built for Student Safety
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-500 text-sm mt-1"
            >
              Every feature designed to keep campus transactions secure.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {trustItems.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
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
        </motion.div>
      </motion.section>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
