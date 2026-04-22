'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { sendMessage } from '@/lib/actions/messages'
import { formatRelativeTime, cn, getInitials } from '@/lib/utils'
import { Send } from 'lucide-react'
import type { Message } from '@/types'

interface ChatBoxProps {
  conversationId: string
  initialMessages: Message[]
  otherUserName: string
  otherUserAvatar?: string | null
}

export default function ChatBox({ conversationId, initialMessages, otherUserName, otherUserAvatar }: ChatBoxProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to realtime messages
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => {
            // Avoid duplicate messages
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user?.id || '',
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticMsg])

    const result = await sendMessage(conversationId, content)
    if (!result.success) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
    }

    setSending(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        {otherUserAvatar ? (
          <img src={otherUserAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(otherUserName)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900">{otherUserName}</h3>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                isOwn
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-md"
                  : "bg-slate-100 text-slate-900 rounded-bl-md"
              )}>
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={cn(
                  "text-[10px] mt-1",
                  isOwn ? "text-white/60" : "text-slate-400"
                )}>
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
