import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getConversations } from '@/lib/actions/messages'
import MessagesClient from './messages-client'

export const metadata = {
  title: 'Messages',
  description: 'Chat with property owners and tenants.',
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/messages')

  const conversations = await getConversations()

  return <MessagesClient conversations={conversations} currentUserId={user.id} />
}
