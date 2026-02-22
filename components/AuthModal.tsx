'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { isOpen: boolean; onClose: () => void }

export default function AuthModal({ isOpen, onClose }: Props) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', major: '' })

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      localStorage.setItem('cc_token', data.token)
      localStorage.setItem('cc_user', JSON.stringify(data.user))
      onClose()
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full sm:hidden" />

            {/* Tab switcher */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              {(['Sign In', 'Sign Up'] as const).map((label, i) => (
                <button key={label}
                  onClick={() => { setIsLogin(i === 0); setError('') }}
                  className={`flex-1 py-4 text-sm font-bold transition-colors relative ${
                    (i === 0) === isLogin
                      ? 'text-primary'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {label}
                  {(i === 0) === isLogin && (
                    <motion.div layoutId="auth-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
              <button onClick={onClose} className="px-4 text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <motion.div key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isLogin ? 'login' : 'person_add'}
                  </span>
                </motion.div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {isLogin ? 'Welcome back' : 'Join CampusCart'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isLogin ? 'Sign in to your account' : 'Create a free student account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input type="text" placeholder="Full Name" required={!isLogin} className={inputClass}
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input type="email" placeholder="name@email.com" required className={inputClass}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Password" required className={inputClass}
                  onChange={e => setForm({ ...form, password: e.target.value })} />

                <AnimatePresence>
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input type="text" placeholder="Major (optional)" className={inputClass}
                        onChange={e => setForm({ ...form, major: e.target.value })} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 rounded-2xl border border-rose-100 dark:border-rose-800">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </motion.div>
                )}

                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="material-symbols-outlined text-lg">progress_activity</motion.span>
                  ) : isLogin ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              {!isLogin && (
                <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
                  By signing up you agree to our Terms of Service.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
