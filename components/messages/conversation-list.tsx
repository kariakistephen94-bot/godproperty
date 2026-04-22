'use client'

import { cn, getInitials, formatRelativeTime } from '@/lib/utils'
import type { ConversationWithDetails } from '@/types'

interface ConversationListProps {
  conversations: ConversationWithDetails[]
  activeId?: string
  currentUserId: string
  onSelect: (id: string) => void
}

export default function ConversationList({ conversations, activeId, currentUserId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-4xl mb-3">📭</p>
        <h3 className="font-semibold text-slate-900 mb-1">No messages yet</h3>
        <p className="text-sm text-slate-500">Start a conversation by contacting a property owner.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map((conv) => {
        const otherParticipant = conv.conversation_participants?.find(
          p => p.user_id !== currentUserId
        )
        const otherUser = otherParticipant?.profiles
        const lastMessage = conv.messages?.[0]

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors",
              activeId === conv.id && "bg-rose-50 hover:bg-rose-50 border-r-2 border-rose-500"
            )}
          >
            {/* Avatar */}
            {otherUser?.avatar_url ? (
              <img src={otherUser.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {getInitials(otherUser?.full_name || 'U')}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-slate-900 truncate text-sm">
                  {otherUser?.full_name || 'User'}
                </h4>
                {lastMessage && (
                  <span className="text-xs text-slate-400 shrink-0">
                    {formatRelativeTime(lastMessage.created_at)}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  {lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                  {lastMessage.content}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
