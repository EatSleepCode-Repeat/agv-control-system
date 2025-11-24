import { Vehicle, Order, Location } from '@/types';

export type WSMessageType = 
  | 'VEHICLE_UPDATE'
  | 'ORDER_UPDATE'
  | 'LOCATION_UPDATE'
  | 'ROUTE_OPTIMIZED'
  | 'ALERT'
  | 'HEARTBEAT'
  | 'CONNECT'
  | 'DISCONNECT';

export interface WSMessage<T = any> {
  type: WSMessageType;
  data: T;
  timestamp: number;
  id?: string;
}

export interface VehicleUpdateData {
  vehicleId: number;
  x: number;
  y: number;
  status: Vehicle['status'];
  battery: number;
}

export interface OrderUpdateData {
  orderId: number;
  status: Order['status'];
  vehicleId?: number;
  progress?: number; // 0-100
}

export interface RouteOptimizedData {
  orderId: number;
  vehicleId: number;
  distance: number;
  estimatedTime: number;
  waypoints: Array<{ x: number; y: number; name: string }>;
}

export interface AlertData {
  severity: 'info' | 'warning' | 'error';
  message: string;
  vehicleId?: number;
  orderId?: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<WSMessageType, ((data: any) => void)[]> = new Map();
  private messageQueue: WSMessage[] = [];
  private isConnecting = false;

  constructor(url: string) {
    this.url = url;
    this.setupHandlers();
  }

  private setupHandlers() {
    const types: WSMessageType[] = [
      'VEHICLE_UPDATE',
      'ORDER_UPDATE',
      'LOCATION_UPDATE',
      'ROUTE_OPTIMIZED',
      'ALERT',
      'HEARTBEAT',
    ];
    
    types.forEach(type => {
      this.messageHandlers.set(type, []);
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        reject(new Error('Already connecting'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect().catch(console.error), this.reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  private handleMessage(data: string) {
    try {
      const message: WSMessage = JSON.parse(data);
      const handlers = this.messageHandlers.get(message.type) || [];
      handlers.forEach(handler => handler(message.data));
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  on(type: WSMessageType, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  off(type: WSMessageType, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  send(message: WSMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'HEARTBEAT',
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
      });
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}