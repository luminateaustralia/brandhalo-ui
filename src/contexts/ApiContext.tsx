'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Customer, CrawlStatus, CrawlConfig } from '@/lib/api';

interface ApiContextType {
  customers: Customer[];
  loading: boolean;
  error: Error | null;
  refreshCustomers: () => Promise<void>;
  startBrandCrawl: (brand: string, url: string) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshCustomers = async () => {
    // Skip fetch during SSR to avoid Next.js headers errors
    if (typeof window === 'undefined') {
      console.warn('ApiContext: Skipping fetch during SSR');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch customers'));
    } finally {
      setLoading(false);
    }
  };

  const startBrandCrawl = async (brand: string, url: string) => {
    try {
      return await api.scans.start({ brand, url });
    } catch (err) {
      console.error('Error starting brand crawl:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Only fetch data client-side
    if (typeof window !== 'undefined') {
      refreshCustomers();
    } else {
      // For SSR, immediately set loading to false
      setLoading(false);
    }
  }, []);

  return (
    <ApiContext.Provider value={{ 
      customers, 
      loading, 
      error, 
      refreshCustomers,
      startBrandCrawl
    }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}