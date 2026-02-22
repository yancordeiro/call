import type { WSMessage } from '@/types/websocket'

type MessageHandler = (payload: any) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private messageHandlers: Map<string, MessageHandler[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  connect(token: string) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
    const url = `${wsUrl}/v1/ws?token=${token}`

    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      this.handleMessage(event)
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.handleReconnect(token)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
    this.reconnectAttempts = 0
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: type as any,
        payload,
        timestamp: new Date().toISOString(),
      }
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)?.push(handler)
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WSMessage = JSON.parse(event.data)
      const handlers = this.messageHandlers.get(message.type) || []
      handlers.forEach((handler) => handler(message.payload))
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(() => {
        this.connect(token)
      }, this.reconnectDelay)
    } else {
      console.error('Max reconnect attempts reached')
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

export const websocketService = new WebSocketService()
