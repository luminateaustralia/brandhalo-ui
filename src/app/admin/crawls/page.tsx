'use client';

export const runtime = 'edge';

import { useEffect, useState, useRef, useCallback } from 'react';
import { api, ActiveScan } from '@/lib/api';

interface Scan {
  scanId: string;
  brand: string;
  url?: string;
  websiteId?: string;
  status: string;
  currentCount?: number;
  pageCount?: number;
  dateStarted: string;
  customerId: string;
  crawltimestamp: string;
}

export default function AdminCrawlsPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [activeScansCount, setActiveScansCount] = useState<number>(0);
  const [activeScansError, setActiveScansError] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Scan; direction: 'asc' | 'desc' }>({
    key: 'crawltimestamp',
    direction: 'desc'
  });
  // Ref to store the interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sorting function
  const sortScans = (scans: Scan[]) => {
    return [...scans].sort((a, b) => {
      if (sortConfig.key === 'crawltimestamp') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.crawltimestamp).getTime() - new Date(b.crawltimestamp).getTime()
          : new Date(b.crawltimestamp).getTime() - new Date(a.crawltimestamp).getTime();
      }
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: keyof Scan) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get count of unique scans (based on scanId)
  const uniqueScansCount = scans.length > 0 ? new Set(scans.map(scan => scan.scanId)).size : 0;
  
  // Get count of completed scans
  const completedScansCount = scans.filter(scan => scan.status === 'Completed').length;
  
  // Get total pages scanned across all scans
  const totalPagesScanned = scans.reduce((total, scan) => total + (scan.pageCount || scan.currentCount || 0), 0);

  // Calculate completion percentage
  const completionPercentage = scans.length > 0 
    ? Math.round((completedScansCount / scans.length) * 100) 
    : 0;

  // Fetch active scans
  const fetchActiveScans = async () => {
    try {
      setActiveScansError(false);
      const activeScans: ActiveScan[] = await api.scans.getActiveScans();
      setActiveScansCount(activeScans.length);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching active scans:', err);
      setActiveScansError(true);
      // Don't set main error state to avoid disrupting the main UI
    }
  };

  // Fetch scan data
  const fetchScans = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setLoading(true);
      setError(null);

      // Use the API to fetch scans
      const data = await api.scans.getAllScans();
      console.log('API scan data:', data); // Log the raw data from API
      setScans((data as {
        scanId: string;
        websiteId?: string;
        status?: string;
        currentCount?: number;
        pageCount?: number;
        dateStarted?: string;
        customerId?: string;
        crawltimestamp: string;
      }[]).map((scan) => {
        console.log('Processing scan:', scan); // Debug log
        console.log('crawltimestamp:', scan.crawltimestamp); // Log the timestamp specifically
        return {
          scanId: scan.scanId,
          brand: scan.websiteId || "Unknown Brand",
          url: scan.websiteId || "",
          websiteId: scan.websiteId || "",
          status: scan.status || "Unknown",
          currentCount: scan.currentCount || 0,
          pageCount: scan.pageCount || 0,
          dateStarted: scan.dateStarted || new Date().toISOString(),
          customerId: scan.customerId || "",
          crawltimestamp: scan.crawltimestamp // Use crawltimestamp directly
        };
      }));
      
      // Also refresh active scans when manually refreshing
      fetchActiveScans();
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch scans'));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch scans on component mount
  useEffect(() => {
    fetchScans();
    
    // Set up polling for active scans
    fetchActiveScans();
    
    // Poll for active scans every 10 seconds
    intervalRef.current = setInterval(fetchActiveScans, 10000);
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchScans]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      console.log('Formatting date string:', dateString); // Log the input date string
      if (!dateString) {
        console.error('Empty date string');
        return 'No date';
      }
      const date = new Date(dateString);
      console.log('Parsed date:', date); // Log the parsed date
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    
    // If within the last minute, show "Just now"
    const diffMs = Date.now() - lastUpdated.getTime();
    if (diffMs < 60000) return 'Just now';
    
    // Otherwise show the time
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          {/* Title moved to layout header */}
        </div>
        <button
          onClick={fetchScans}
          disabled={loading || isRefreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {(loading || isRefreshing) ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : 'Refresh'}
        </button>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-4 border rounded-lg bg-blue-50 border-blue-100">
          <div className="text-sm text-blue-600 font-medium uppercase">Total Unique Scans</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold text-blue-800">
              {loading ? (
                <svg className="animate-pulse h-8 w-16 rounded bg-blue-200" />
              ) : (
                uniqueScansCount
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 border rounded-lg bg-green-50 border-green-100">
          <div className="text-sm text-green-600 font-medium uppercase">Completed Scans</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold text-green-800">
              {loading ? (
                <svg className="animate-pulse h-8 w-16 rounded bg-green-200" />
              ) : (
                completedScansCount
              )}
            </div>
          </div>
        </div>
        
        {/* New card for Active Scans */}
        <div className="flex-1 p-4 border rounded-lg bg-red-50 border-red-100">
          <div className="text-sm text-red-600 font-medium uppercase flex items-center">
            Active Scans
            <div className="relative ml-2 group">
              <div className="flex items-center">
                <span className="cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="hidden group-hover:block absolute z-10 w-60 p-2 -ml-24 mt-3 text-xs bg-gray-900 text-gray-100 rounded-md shadow-lg">
                  Real-time counter updated every 10 seconds. The pulsing dot indicates live updates are active.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold text-red-800">
              {activeScansError ? (
                <span className="text-lg text-red-600">Error</span>
              ) : (
                activeScansCount
              )}
            </div>
            <div className="ml-2 relative">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-xs text-red-600 mt-1">
              Last updated: {formatLastUpdated()}
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 border rounded-lg bg-purple-50 border-purple-100">
          <div className="text-sm text-purple-600 font-medium uppercase">Total Pages Scanned</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold text-purple-800">
              {loading ? (
                <svg className="animate-pulse h-8 w-16 rounded bg-purple-200" />
              ) : (
                totalPagesScanned
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 border rounded-lg bg-amber-50 border-amber-100">
          <div className="text-sm text-amber-600 font-medium uppercase">Completion Rate</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-semibold text-amber-800">
              {loading ? (
                <svg className="animate-pulse h-8 w-16 rounded bg-amber-200" />
              ) : (
                `${completionPercentage}%`
              )}
            </div>
          </div>
          <div className="mt-2 w-full bg-amber-200 rounded-full h-2.5">
            <div 
              className="bg-amber-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {loading && !isRefreshing ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Loading scans...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow">
          <p className="font-medium">Error loading scans</p>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={fetchScans}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      ) : scans.length === 0 ? (
        <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 mb-4">No scans found</p>
          <button 
            onClick={fetchScans} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Scans Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scans
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('scanId')}
                  >
                    Scan ID {sortConfig.key === 'scanId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('brand')}
                  >
                    Brand {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('status')}
                  >
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('pageCount')}
                  >
                    Pages {sortConfig.key === 'pageCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('crawltimestamp')}
                  >
                    Scan Date {sortConfig.key === 'crawltimestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortScans(scans).map((scan) => (
                  <tr 
                    key={scan.scanId} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {scan.scanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scan.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        scan.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : scan.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scan.pageCount || scan.currentCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(scan.crawltimestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/admin/scans/${scan.scanId}`, '_blank');
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}