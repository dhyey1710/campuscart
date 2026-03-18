'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Message = {
  id: number
  content: string
  senderId: number
  receiverId: number
  createdAt: string
  sender: { id: number; name: string; avatar?: string }
}

type ChatModalProps = {
  isOpen: boolean
  onClose: () => void
  currentUserId: number
  currentUserName: string
  sellerId: number
  sellerName: string
  itemId: number
  itemTitle: string
  itemImage?: string
}

export default function ChatModal({
  isOpen, onClose,
  currentUserId, currentUserName,
  sellerId, sellerName,
  itemId, itemTitle, itemImage,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (messages.length > 0) scrollToBottom()
  }, [messages])

  // Load existing messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${currentUserId}/${sellerId}/${itemId}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setMessages([])
    }
  }, [currentUserId, sellerId, itemId])

  useEffect(() => {
    if (!isOpen) return
    setIsLoading(true)
    fetchMessages().finally(() => setIsLoading(false))
  }, [isOpen, fetchMessages])

  // Supabase Realtime subscription for new messages
  useEffect(() => {
    if (!isOpen) return

    const channel = supabase
      .channel(`chat-${currentUserId}-${sellerId}-${itemId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `item_id=eq.${itemId}`,
        },
        () => {
          // Refetch messages when a new one is inserted
          fetchMessages()
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
      setIsConnected(false)
    }
  }, [isOpen, currentUserId, sellerId, itemId, fetchMessages])

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return
    setSending(true)

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: sellerId,
          itemId,
          content: input.trim(),
        }),
      })

      if (res.ok) {
        const newMsg = await res.json()
        setMessages(prev => [...prev, newMsg])
        setInput('')
      }
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }, [input, sending, currentUserId, sellerId, itemId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full sm:max-w-md h-[85vh] sm:h-[600px] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shrink-0">
              {/* Drag handle on mobile */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full sm:hidden" />

              {/* Item thumbnail */}
              {itemImage && (
                <img src={itemImage} alt={itemTitle} className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{sellerName}</h3>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-500 truncate">re: {itemTitle}</p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {isLoading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                      <div className={`h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 ${i % 2 === 0 ? 'w-40' : 'w-52'}`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">chat_bubble</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Start the conversation</p>
                    <p className="text-sm text-slate-500 mt-1">Ask about the item or suggest a meetup spot.</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isOwn = msg.senderId === currentUserId
                    const showAvatar = !isOwn && (i === 0 || messages[i - 1].senderId !== msg.senderId)

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwn && (
                          <div className={`w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0 ${!showAvatar ? 'invisible' : ''}`}>
                            {sellerName[0].toUpperCase()}
                          </div>
                        )}

                        <div className={`max-w-[72%] group`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                          }`}>
                            {msg.content}
                          </div>
                          <div className={`text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none px-4 py-3 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all max-h-32 overflow-y-auto"
                    style={{ minHeight: '46px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                    }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shrink-0 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </motion.button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
