import { useEffect, useRef } from 'react';

export function useCrawlUpdates() {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    eventSourceRef.current = new EventSource(`${API_URL}/stream`);
    
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return eventSourceRef.current;
}