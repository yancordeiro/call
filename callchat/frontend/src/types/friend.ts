export interface Friend {
  id: string
  username: string
  email: string
}

export interface FriendRequest {
  id: string
  user_id: string
  friend_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  created_at: string
  friend: Friend
}

export interface SendFriendRequestPayload {
  friend_id: string
}
