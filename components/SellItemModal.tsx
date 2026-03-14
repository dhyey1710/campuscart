'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { isOpen: boolean; onClose: () => void; onSuccess: () => void }

const categories = ['Tech', 'Textbooks', 'Dorm Life', 'Tickets', 'Apparel']
const conditions = ['New', 'Like New', 'Good', 'Fair']

export default function SellItemModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: '', price: '', category: 'Tech', condition: 'New', description: '',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Get user info and token from localStorage
    let sellerId = 1
    let token = ''
    try {
      const storedUser = localStorage.getItem('cc_user')
      const storedToken = localStorage.getItem('cc_token')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        sellerId = user.id
      }
      if (storedToken) token = storedToken
    } catch {}

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...formData, sellerId }),
      })
      if (res.ok) { onSuccess(); onClose() }
      else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setError('Could not connect to server.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            {/* Handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">List an Item</h2>
                <p className="text-sm text-slate-500 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                <input type="text" placeholder="e.g. MacBook Air M2 (2023)" required className={inputClass}
                  onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price</label>
                  <input type="text" placeholder="₹500" required className={inputClass}
                    onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select className={inputClass} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Condition</label>
                <div className="grid grid-cols-4 gap-2">
                  {conditions.map(c => (
                    <button type="button" key={c}
                      onClick={() => setFormData({ ...formData, condition: c })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.condition === c
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea placeholder="Describe your item, mention any defects, accessories included..." rows={3}
                  className={`${inputClass} resize-none`}
                  onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Image URL</label>
                <input type="url" placeholder="https://..." className={inputClass}
                  defaultValue={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })} />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 px-4 py-3 rounded-2xl">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="material-symbols-outlined text-lg">progress_activity</motion.span>
                    Posting…
                  </>
                ) : (
                  <><span className="material-symbols-outlined text-lg">sell</span> Post Item</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
