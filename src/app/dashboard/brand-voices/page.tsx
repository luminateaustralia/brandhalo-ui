'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  SpeakerWaveIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { BrandVoice, BrandVoiceFormData, BrandVoiceFormMode } from '@/types/brandVoice';
import BrandVoiceForm from '@/components/brand-voices/BrandVoiceForm';

export default function BrandVoicesPage() {
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<BrandVoiceFormMode>('create');
  const [selectedVoice, setSelectedVoice] = useState<BrandVoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchBrandVoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/brand-voices');
      if (response.ok) {
        const data = await response.json();
        setBrandVoices(data.map((item: { voiceData: BrandVoice }) => item.voiceData));
      } else {
        throw new Error('Failed to fetch brand voices');
      }
    } catch (error) {
      console.error('Error fetching brand voices:', error);
      showNotification('Failed to load brand voices', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrandVoices();
  }, [fetchBrandVoices]);

  const handleCreateVoice = () => {
    setFormMode('create');
    setSelectedVoice(null);
    setIsFormOpen(true);
  };

  const handleEditVoice = (voice: BrandVoice) => {
    setFormMode('edit');
    setSelectedVoice(voice);
    setIsFormOpen(true);
  };

  const handleViewVoice = (voice: BrandVoice) => {
    setFormMode('view');
    setSelectedVoice(voice);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: BrandVoiceFormData) => {
    try {
      setIsSubmitting(true);
      
      if (formMode === 'create') {
        const response = await fetch('/api/brand-voices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          showNotification('Brand voice created successfully!', 'success');
          await fetchBrandVoices();
        } else {
          throw new Error('Failed to create brand voice');
        }
      } else if (formMode === 'edit' && selectedVoice) {
        const response = await fetch(`/api/brand-voices/${selectedVoice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          showNotification('Brand voice updated successfully!', 'success');
          await fetchBrandVoices();
        } else {
          throw new Error('Failed to update brand voice');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification(
        formMode === 'create' ? 'Failed to create brand voice' : 'Failed to update brand voice',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVoice = async (voice: BrandVoice) => {
    if (!confirm(`Are you sure you want to delete ${voice.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/brand-voices/${voice.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotification('Brand voice deleted successfully!', 'success');
        await fetchBrandVoices();
      } else {
        throw new Error('Failed to delete brand voice');
      }
    } catch (error) {
      console.error('Error deleting brand voice:', error);
      showNotification('Failed to delete brand voice', 'error');
    }
  };

  return (
    <div className="w-full">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SpeakerWaveIcon className="w-8 h-8 mr-3 text-purple-600" />
            Brand Voices
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage employee brand voices for authentic content creation
          </p>
        </div>
        <button
          onClick={handleCreateVoice}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Employee Voice
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading brand voices...</p>
        </div>
      )}

      {/* Brand Voices Grid */}
      {!isLoading && brandVoices.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {brandVoices.map((voice) => (
            <div key={voice.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <UserIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{voice.name}</h3>
                      <p className="text-gray-600 mt-1">{voice.jobTitle}</p>
                      <p className="text-sm text-gray-500">{voice.department}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewVoice(voice)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditVoice(voice)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVoice(voice)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Bio */}
                <div>
                  <p className="text-gray-700 text-sm line-clamp-3">{voice.bio}</p>
                </div>

                {/* Communication Style & Tone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Style</h4>
                    <p className="text-sm text-gray-700">{voice.communicationStyle}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tone</h4>
                    <p className="text-sm text-gray-700">{voice.tone}</p>
                  </div>
                </div>

                {/* Personality Traits */}
                {voice.personalityTraits.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Traits</h4>
                    <div className="flex flex-wrap gap-1">
                      {voice.personalityTraits.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {trait}
                        </span>
                      ))}
                      {voice.personalityTraits.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{voice.personalityTraits.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Expertise Areas */}
                {voice.expertiseAreas.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {voice.expertiseAreas.slice(0, 2).map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                        >
                          {area}
                        </span>
                      ))}
                      {voice.expertiseAreas.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{voice.expertiseAreas.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between pt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    voice.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {voice.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {voice.email}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && brandVoices.length === 0 && (
        <div className="text-center py-12">
          <SpeakerWaveIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Brand Voices Yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first employee brand voice to start creating authentic, personalized content
          </p>
          <button
            onClick={handleCreateVoice}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Add Your First Employee Voice
          </button>
        </div>
      )}

      {/* Form Modal */}
      <BrandVoiceForm
        mode={formMode}
        initialData={selectedVoice || undefined}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}