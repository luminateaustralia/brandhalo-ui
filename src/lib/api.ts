// Types based on your API
export interface Brand {
  id: string;
  name: string;
  url: string;
  status?: string; // New field: active or inactive
  dateCreated?: string; // New field: creation date
}

export interface Customer {
  id?: string; // Make id optional
  organisationName: string;
  customerId?: string; // Make customerId optional
  clerk_organisation_id?: string; // Add the Clerk organization ID field
  brands?: Brand[]; // Make brands optional
  url?: string; // Add the url field
  // Other fields removed as they're not in the sample payload
}
  
export interface CrawlConfig {
  brand: string;
  url: string;
  crawlLimit?: number;
}

export interface CrawlStatus {
  scanId: string;
  currentCount: number;
  message: string;
}

export interface CrawlResult {
  totalRecords: number;
  totalScans: number;
  crawledItems: unknown[]; // Generic crawled items
}

export interface ActiveScan {
  scanId: string;
  brandId?: string;
  websiteId?: string;
  status: string;
  currentCount?: number;
  startTime?: string;
  customerId?: string;
}

// API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get headers with authentication
const getHeaders = async () => {
  // For client components, we'll dynamically import and use the auth function
  // This is to avoid SSR issues with authentication
  if (typeof window !== 'undefined') {
    try {
      // Use dynamic import to avoid SSR issues
      const { auth } = await import('@/auth');
      const session = await auth();
      const apiKey = session?.user?.apiKey || '';
      
      return {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      };
    } catch (error) {
      console.error('Error getting auth session:', error);
    }
  }
  
  // Fallback to using environment variable if server-side or auth fails
  return {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
  };
};

// Safe fetch wrapper that handles SSR gracefully
const safeFetch = async (url: string, options?: RequestInit) => {
  // Don't attempt to fetch during SSR
  if (typeof window === 'undefined') {
    // Return appropriate empty data structure based on the endpoint
    if (url.includes('/api/customers') && !url.includes('/create')) {
      // For customer listing endpoint, return empty array
      return new Response(JSON.stringify([]), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // For other endpoints, return an empty response
    return new Response(JSON.stringify({}), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return fetch(url, options);
};

export const api = {
  // Customer endpoints
  customers: {
    create: async (data: Customer): Promise<Customer> => {
      const headers = await getHeaders();
      console.log('API URL:', `${API_URL}/api/customers/create`);
      console.log('Headers:', headers);
      console.log('Request body:', JSON.stringify(data, null, 2));
      
      try {
        const response = await safeFetch(`${API_URL}/api/customers/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText);
          const errorText = await response.text();
          let errorDetails = {};
          let errorMessage = `${response.status} ${response.statusText}`;
          
          try {
            // Try to parse as JSON in case it's a structured error
            errorDetails = JSON.parse(errorText);
            console.error('Validation Error:', errorDetails);
            
            // Extract message if available
            if (errorDetails && typeof errorDetails === 'object') {
              if ('message' in errorDetails && typeof errorDetails.message === 'string') {
                errorMessage = errorDetails.message;
              } else if ('error' in errorDetails && typeof errorDetails.error === 'string') {
                errorMessage = errorDetails.error;
              }
            }
          } catch {
            console.error('Error details (raw):', errorText);
            // Use the raw text if it's not JSON
            if (errorText) {
              errorMessage = errorText;
            }
          }
          
          // Create a custom error with status code and better details
          const error = new Error(`Failed to create customer: ${errorMessage}`);
          (error as Error & { status?: number; details?: unknown }).status = response.status;
          (error as Error & { status?: number; details?: unknown }).details = errorDetails;
          throw error;
        }
        
        return response.json();
      } catch (error) {
        console.error('Network Error:', error);
        throw error;
      }
    },
    
    getAll: async (): Promise<Customer[]> => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/customers`, { headers });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    
    getBrands: async (customerId: string) => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/customers/${customerId}/brands`, { headers });
      if (!response.ok) throw new Error('Failed to fetch brands');
      return response.json();
    },
    
    getScans: async (customerId: string) => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/customers/${customerId}/scans`, { headers });
      if (!response.ok) throw new Error('Failed to fetch scans');
      return response.json();
    },
  },

  // Scan endpoints (formerly Crawl endpoints)
  scans: {
    start: async (config: CrawlConfig) => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/crawl`, {
        method: 'POST',
        headers,
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to start scan');
      return response.json();
    },

    getStatus: async (scanId: string): Promise<CrawlStatus> => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/crawl/status/${scanId}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch scan status');
      return response.json();
    },
    
    getAllScans: async (): Promise<unknown[]> => {
      const headers = await getHeaders();
      const response = await safeFetch(`${API_URL}/api/scans`, { headers });
      
      if (!response.ok) throw new Error('Failed to fetch scans');
      
      // Get the raw data from the response
      const rawData = await response.json();
      
      // Map the API response to the format expected by the UI
      return rawData.map((scan: Record<string, unknown>) => ({
        scanId: scan.scanId,
        brand: scan.websiteId || "Unknown Brand", // Using websiteId as brand name
        url: scan.websiteId || "", // Using websiteId as URL too since that's what it appears to be
        websiteId: scan.websiteId || "", // Include the websiteId field
        status: scan.status || "Unknown", // Default status if not provided
        currentCount: scan.currentCount || 0, // Default count if not provided
        pageCount: scan.pageCount || 0, // Include the pageCount field from the API
        dateStarted: scan.dateStarted || new Date().toISOString(), // Default to current date if not provided
        customerId: scan.customerId || "", // Default to empty if not provided
        crawltimestamp: scan.crawltimestamp || scan.dateStarted || new Date().toISOString(), // Add crawltimestamp field
      }));
    },

    // New method to get active scans
    getActiveScans: async (brandId?: string): Promise<ActiveScan[]> => {
      const headers = await getHeaders();
      const url = new URL(`${API_URL}/api/scans/active`);
      
      // Add brandId as a query parameter if provided
      if (brandId) url.searchParams.append('brandId', brandId);
      
      const response = await safeFetch(url.toString(), { headers });
      
      if (!response.ok) throw new Error('Failed to fetch active scans');
      
      const activeScans = await response.json();
      return activeScans;
    }
  },

  // For backward compatibility (can be removed later)
  crawls: {
    getAllCrawls: async (): Promise<unknown[]> => {
      return api.scans.getAllScans();
    },
    start: async (config: CrawlConfig) => {
      return api.scans.start(config);
    },
    getStatus: async (scanId: string): Promise<CrawlStatus> => {
      return api.scans.getStatus(scanId);
    }
  },

  // Results endpoints
  results: {
    getPages: async (customerId: string, scanId?: string): Promise<CrawlResult> => {
      const headers = await getHeaders();
      const url = new URL(`${API_URL}/api/website/pages/${customerId}`);
      if (scanId) url.searchParams.append('scanId', scanId);
      
      const response = await safeFetch(url.toString(), { headers });
      if (!response.ok) throw new Error('Failed to fetch pages');
      return response.json();
    },
  },
};