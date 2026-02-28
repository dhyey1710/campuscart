'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const stats = [
  { value: '2,400+', label: 'Active Listings' },
  { value: '8,100+', label: 'Students' },
  { value: '₹0', label: 'Platform Fees' },
]

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  useEffect(() => {
    const h = () => setOffsetY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showHowItWorks ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showHowItWorks])

  return (
    <>
      <section className="mb-10 overflow-hidden rounded-3xl">
        <div
          className="relative bg-primary px-6 sm:px-10 py-16 sm:py-24 text-white overflow-hidden"
          style={{ minHeight: '360px' }}
        >
          {/* Dot grid parallax */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              transform: `translateY(${offsetY * 0.18}px)`,
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Gradient blobs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Content */}
          <motion.div
            className="relative z-10 max-w-3xl mx-auto text-center"
            style={{ transform: `translateY(${offsetY * 0.12}px)`, opacity: Math.max(0, 1 - offsetY / 500) }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Students buying &amp; selling right now
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-5"
            >
              Your Campus,{' '}
              <span className="text-white/70">Your Marketplace</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto font-medium leading-relaxed"
            >
              Verified student listings, zero fees, and safe on-campus meetups.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3.5 rounded-2xl font-bold text-base shadow-xl"
              >
                Browse Deals
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowHowItWorks(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold text-base backdrop-blur-sm transition-colors"
              >
                How it works
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative z-10 mt-12 flex justify-center gap-8 sm:gap-16"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black">{value}</div>
                <div className="text-xs text-white/60 font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowHowItWorks(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">How CampusCart Works</h2>
                </div>
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">CampusCart</strong> is the exclusive student marketplace built for{' '}
                  <strong className="text-primary">SRM Institute of Science and Technology</strong>. It's designed to make buying and selling among SRM students safe, easy, and completely free.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: 'person_add', title: 'Create Your Account', desc: 'Sign up with your SRM email to join the trusted SRM student community. Only verified SRM students can list and purchase items.' },
                    { icon: 'sell', title: 'List or Browse Items', desc: 'Selling old textbooks, gadgets, dorm furniture, or event tickets? List them in seconds. Buyers can browse by category or search for exactly what they need.' },
                    { icon: 'chat', title: 'Chat & Negotiate', desc: 'Use our built-in real-time chat to message sellers directly, negotiate prices, and ask questions — all within the platform.' },
                    { icon: 'handshake', title: 'Meet & Exchange on Campus', desc: 'Arrange safe meetups at SRM common areas — the library, canteen, or Tech Park. No shipping needed, no extra fees. Just meet, exchange, and done!' },
                  ].map(({ icon, title, desc }, i) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.1, duration: 0.4 }}
                      className="flex gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-primary">💡 Zero Fees, Always.</span> CampusCart is free for all SRM students. No listing fees, no commissions, no hidden charges. Our mission is to make campus life more affordable and sustainable.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
