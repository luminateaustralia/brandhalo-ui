'use client';

import { useApi } from '@/contexts/ApiContext';
import { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
  const { customers, loading, error, refreshCustomers, startBrandCrawl } = useApi();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [crawlingBrands, setCrawlingBrands] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' } | null>(null);

  // Log API errors and data
  useEffect(() => {
    if (error) {
      console.error('Customers API Error:', error);
    }
    console.log('Customers data:', customers);
  }, [error, customers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCustomers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCrawlNow = async (brandId: string, brandName: string, brandUrl: string) => {
    setCrawlingBrands(prev => ({ ...prev, [brandId]: true }));
    try {
      const result = await startBrandCrawl(brandName, brandUrl);
      console.log('Crawl started:', result);
      setToast({
        visible: true,
        message: `Crawl initiated for ${brandName}`,
        type: 'success'
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast(null);
      }, 3000);
    } catch (error) {
      console.error(`Error starting crawl for ${brandName}:`, error);
      setToast({
        visible: true,
        message: `Failed to start crawl for ${brandName}`,
        type: 'error'
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast(null);
      }, 3000);
    } finally {
      setCrawlingBrands(prev => ({ ...prev, [brandId]: false }));
    }
  };

  return (
    <div className="space-y-6 relative">
      {toast && toast.visible && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md z-50 ${
          toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          {/* Title moved to layout header */}
        </div>
        <button
          onClick={handleRefresh}
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

      {loading && !isRefreshing ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Loading customers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow">
          <p className="font-medium">Error loading customers</p>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 mb-4">No customers found</p>
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brands
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.customerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.organisationName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col space-y-1">
                      {customer.brands && customer.brands.length > 0 ? (
                        customer.brands.map((brand, index) => (
                          <div key={brand.id || index} className="flex items-center">
                            <span className="font-medium">{brand.name}:</span>
                            <a 
                              href={brand.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              {brand.url}
                            </a>
                            {brand.status && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                brand.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {brand.status}
                              </span>
                            )}
                            <button
                              onClick={() => handleCrawlNow(brand.id || `${customer.id}-${index}`, brand.name, brand.url)}
                              disabled={crawlingBrands[brand.id || `${customer.id}-${index}`]}
                              className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {crawlingBrands[brand.id || `${customer.id}-${index}`] ? (
                                <>
                                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Crawling...
                                </>
                              ) : 'Crawl Now'}
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">No brands</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}