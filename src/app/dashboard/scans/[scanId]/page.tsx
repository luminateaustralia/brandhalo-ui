'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ScanResult {
  scanId: string;
  brand: string;
  websiteId: string;
  startTime: string;
  totalPages: number;
  pages: {
    title: string;
    url: string;
    html: string;
    crawltimestamp: string;
  }[];
}

export default function ScanResultPage() {
  const params = useParams();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchScanResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/scans/${params.scanId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch scan results');
        }
        const data = await response.json();
        setScanResult(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchScanResult();
  }, [params.scanId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow">
        <p className="font-medium">Error loading scan results</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-12">
        <p className="text-gray-600">No scan results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link href="/dashboard/crawls" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                Scans
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">Scan Results</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Scan Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Scan Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Scan ID</h2>
            <p className="mt-1 text-sm text-gray-900 font-mono">{scanResult.scanId}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Brand</h2>
            <p className="mt-1 text-sm text-gray-900">{scanResult.brand}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Website</h2>
            <p className="mt-1 text-sm text-gray-900">
              <a href={scanResult.websiteId} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {scanResult.websiteId}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Total Pages</h2>
            <p className="mt-1 text-sm text-gray-900">{scanResult.totalPages}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Start Time</h2>
            <p className="mt-1 text-sm text-gray-900">{formatDate(scanResult.startTime)}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Last Updated</h2>
            <p className="mt-1 text-sm text-gray-900">
              {scanResult.pages.length > 0 ? formatDate(scanResult.pages[0].crawltimestamp) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-500">Scanned Pages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crawl Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scanResult.pages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {page.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(page.crawltimestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 