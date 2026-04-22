'use server'

import { createClient } from '@/lib/supabase/server'
import type { ConversationWithDetails, Message } from '@/types'

export async function getConversations(): Promise<ConversationWithDetails[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get conversations where user is a participant
  const { data: participantData } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  if (!participantData || participantData.length === 0) return []

  const conversationIds = participantData.map(p => p.conversation_id)

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_participants(user_id, profiles(*)),
      messages(*)
    `)
    .in('id', conversationIds)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  // Sort messages within each conversation and keep only the last few
  const conversations = (data || []).map(conv => ({
    ...conv,
    messages: (conv.messages || [])
      .sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 1), // Keep only last message for preview
  }))

  return conversations as ConversationWithDetails[]
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    })

  if (error) return { success: false, error: error.message }

  // Update conversation timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return { success: true }
}

export async function getOrCreateConversation(
  listingId: string,
  otherUserId: string
): Promise<{ conversationId: string | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { conversationId: null, error: 'Unauthorized' }

  // Check if conversation exists between these users for this listing
  const { data: myConvs } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  if (myConvs && myConvs.length > 0) {
    const myConvIds = myConvs.map(c => c.conversation_id)

    const { data: sharedConvs } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', otherUserId)
      .in('conversation_id', myConvIds)

    if (sharedConvs && sharedConvs.length > 0) {
      // Check if any of these are for this listing
      for (const sc of sharedConvs) {
        const { data: conv } = await supabase
          .from('conversations')
          .select('id')
          .eq('id', sc.conversation_id)
          .eq('listing_id', listingId)
          .single()

        if (conv) return { conversationId: conv.id }
      }
    }
  }

  // Create new conversation
  const { data: newConv, error: convError } = await supabase
    .from('conversations')
    .insert({ listing_id: listingId })
    .select()
    .single()

  if (convError) return { conversationId: null, error: convError.message }

  // Add participants
  await supabase.from('conversation_participants').insert([
    { conversation_id: newConv.id, user_id: user.id },
    { conversation_id: newConv.id, user_id: otherUserId },
  ])

  return { conversationId: newConv.id }
}
