'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SellItemModal from './SellItemModal'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cc_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) params.set('search', term)
    else params.delete('search')
    router.replace(`/?${params.toString()}`)
  }

  const handleSellClick = () => {
    if (user) {
      setIsSellOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_user')
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm shadow-black/5 border-b border-slate-200/60 dark:border-slate-800/60'
            : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-3 sm:gap-4">
          <motion.a href="/" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Campus<span className="text-primary">Cart</span>
            </span>
          </motion.a>

          <div className="flex-1 max-w-xl relative">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border transition-all duration-200 ${
              searchFocused
                ? 'bg-white dark:bg-slate-900 border-primary/40 ring-4 ring-primary/10 shadow-lg shadow-primary/5'
                : 'bg-slate-100/80 dark:bg-slate-800/80 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}>
              <span className={`material-symbols-outlined text-lg shrink-0 transition-colors ${searchFocused ? 'text-primary' : 'text-slate-400'}`}>search</span>
              <input
                type="text"
                placeholder="Search items, categories…"
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none min-w-0"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('search') || ''}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <AnimatePresence>
                {searchParams.get('search') && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSearch('')} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                  <span className="material-symbols-outlined text-base">logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={() => setIsAuthOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-lg">person</span>
                <span>Sign In</span>
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={handleSellClick}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:block">Sell Item</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
      <SellItemModal isOpen={isSellOpen} onClose={() => setIsSellOpen(false)} onSuccess={() => window.location.reload()} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
