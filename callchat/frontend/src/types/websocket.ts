export interface WSMessage {
  type: 'chat' | 'friend_request' | 'friend_accept' | 'typing' | 'error'
  payload: any
  timestamp: string
}

export interface ChatMessagePayload {
  message_id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
}

export interface FriendRequestPayload {
  request_id: string
  from_user_id: string
  from_username: string
}
