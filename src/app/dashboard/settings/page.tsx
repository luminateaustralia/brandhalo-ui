'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:8080';

interface Brand {
  id: string;
  name: string;
  // Add other brand properties as needed
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export default function SettingsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // TODO: Replace with actual customer ID from auth context
        const customerId = 'your-customer-id';
        const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/brands`, {
          method: 'GET',
          headers: defaultHeaders,
          credentials: 'include', // Include cookies if needed
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to fetch brands: ${response.status}`);
        }
        
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleAddBrand = async () => {
    try {
      // TODO: Replace with actual customer ID from auth context
      const customerId = 'your-customer-id';
      const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/brands`, {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({ name: newBrandName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to add brand: ${response.status}`);
      }
      
      const newBrand = await response.json();
      setBrands([...brands, newBrand]);
      setIsAddModalOpen(false);
      setNewBrandName('');
    } catch (err) {
      console.error('Error adding brand:', err);
      setError(err instanceof Error ? err.message : 'Failed to add brand');
    }
  };

  const handleEditBrand = async () => {
    if (!selectedBrand) return;

    try {
      // TODO: Replace with actual customer ID from auth context
      const customerId = 'your-customer-id';
      const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({ name: newBrandName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update brand: ${response.status}`);
      }
      
      const updatedBrand = await response.json();
      setBrands(brands.map(brand => 
        brand.id === updatedBrand.id ? updatedBrand : brand
      ));
      setIsEditModalOpen(false);
      setSelectedBrand(null);
      setNewBrandName('');
    } catch (err) {
      console.error('Error updating brand:', err);
      setError(err instanceof Error ? err.message : 'Failed to update brand');
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      // TODO: Replace with actual customer ID from auth context
      const customerId = 'your-customer-id';
      const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/brands/${brandId}`, {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include', // Include cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete brand: ${response.status}`);
      }
      
      setBrands(brands.filter(brand => brand.id !== brandId));
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete brand');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Brand
        </button>
      </div>

      {/* Brands List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Brands</h2>
          <div className="space-y-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{brand.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBrand(brand);
                      setNewBrandName(brand.name);
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Brand Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {isEditModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Brand</h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Brand Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedBrand(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 