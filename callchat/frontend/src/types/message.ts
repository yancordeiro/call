export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read_at?: string
}

export interface Conversation {
  friend_id: string
  friend_username: string
  last_message?: Message
  unread_count: number
}

export interface SendMessagePayload {
  recipient_id: string
  content: string
}
