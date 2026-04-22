'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ConversationList from '@/components/messages/conversation-list'
import ChatBox from '@/components/messages/chat-box'
import { getMessages, getOrCreateConversation } from '@/lib/actions/messages'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import type { ConversationWithDetails, Message } from '@/types'

interface MessagesClientProps {
  conversations: ConversationWithDetails[]
  currentUserId: string
}

export default function MessagesClient({ conversations, currentUserId }: MessagesClientProps) {
  const searchParams = useSearchParams()
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [activeMessages, setActiveMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // Handle redirect from listing contact button
  useEffect(() => {
    const listingId = searchParams.get('listing')
    const toUserId = searchParams.get('to')

    if (listingId && toUserId) {
      const initConversation = async () => {
        setLoading(true)
        const result = await getOrCreateConversation(listingId, toUserId)
        if (result.conversationId) {
          setActiveConversationId(result.conversationId)
          const msgs = await getMessages(result.conversationId)
          setActiveMessages(msgs)
        }
        setLoading(false)
      }
      initConversation()
    }
  }, [searchParams])

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id)
    setLoading(true)
    const msgs = await getMessages(id)
    setActiveMessages(msgs)
    setLoading(false)
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId)
  const otherParticipant = activeConversation?.conversation_participants?.find(
    p => p.user_id !== currentUserId
  )

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Sidebar — Conversations */}
      <div className={`w-full sm:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${activeConversationId ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Messages
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId || undefined}
            currentUserId={currentUserId}
            onSelect={handleSelectConversation}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden sm:flex' : 'flex'}`}>
        {activeConversationId ? (
          <>
            {/* Mobile Back Button */}
            <div className="sm:hidden p-2 border-b border-slate-100">
              <button
                onClick={() => setActiveConversationId(null)}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-rose-500 rounded-full" />
              </div>
            ) : (
              <ChatBox
                conversationId={activeConversationId}
                initialMessages={activeMessages}
                otherUserName={otherParticipant?.profiles?.full_name || 'User'}
                otherUserAvatar={otherParticipant?.profiles?.avatar_url}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Your Messages</h3>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
