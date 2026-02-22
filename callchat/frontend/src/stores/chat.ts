import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message, Conversation } from '@/types/message'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const messages = ref<Map<string, Message[]>>(new Map())
  const activeConversationId = ref<string | null>(null)

  function addMessage(message: Message) {
    const conversationId = message.sender_id === useAuthStore().user?.id
      ? message.recipient_id
      : message.sender_id

    if (!messages.value.has(conversationId)) {
      messages.value.set(conversationId, [])
    }

    messages.value.get(conversationId)?.push(message)
  }

  function getMessages(friendId: string): Message[] {
    return messages.value.get(friendId) || []
  }

  function setActiveConversation(friendId: string) {
    activeConversationId.value = friendId
  }

  function clearMessages() {
    messages.value.clear()
    conversations.value = []
    activeConversationId.value = null
  }

  return {
    conversations,
    messages,
    activeConversationId,
    addMessage,
    getMessages,
    setActiveConversation,
    clearMessages,
  }
})

// Import circular fix
import { useAuthStore } from './auth'
