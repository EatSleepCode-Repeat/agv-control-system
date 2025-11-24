import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketManager, WSMessage, WSMessageType } from '@/lib/webSocket';

export interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const managerRef = useRef<WebSocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize WebSocket manager
  useEffect(() => {
    managerRef.current = new WebSocketManager(options.url);
    
    if (options.autoConnect !== false) {
      managerRef.current.connect()
        .then(() => {
          setIsConnected(true);
          options.onConnect?.();
        })
        .catch((err) => {
          setError(err);
          options.onError?.(err);
        });
    }

    return () => {
      managerRef.current?.disconnect();
      managerRef.current = null;
    };
  }, [options.url, options.autoConnect, options.onConnect, options.onDisconnect, options.onError]);

  const connect = useCallback(async () => {
    if (!managerRef.current) return;
    try {
      await managerRef.current.connect();
      setIsConnected(true);
      setError(null);
      options.onConnect?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    }
  }, [options]);

  const disconnect = useCallback(() => {
    if (!managerRef.current) return;
    managerRef.current.disconnect();
    setIsConnected(false);
    options.onDisconnect?.();
  }, [options]);

  const send = useCallback((message: WSMessage) => {
    if (!managerRef.current) return;
    managerRef.current.send(message);
  }, []);

  const on = useCallback((type: WSMessageType, handler: (data: any) => void) => {
    if (!managerRef.current) return;
    managerRef.current.on(type, handler);

    return () => {
      if (managerRef.current) {
        managerRef.current.off(type, handler);
      }
    };
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    send,
    on,
  };
}