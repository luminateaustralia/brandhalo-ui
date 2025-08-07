'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  HomeIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { exportPersonaToPDF, copyPersonaToClipboard } from '@/utils/personaExport';
import { Persona, PersonaFormData, PersonaFormMode } from '@/types/persona';
import PersonaForm from '@/components/personas/PersonaForm';

// Helper function to get icon for persona (for display purposes)
const getPersonaIcon = (occupation: string) => {
  const lowerOccupation = occupation.toLowerCase();
  if (lowerOccupation.includes('marketing') || lowerOccupation.includes('business')) {
    return BriefcaseIcon;
  } else if (lowerOccupation.includes('healthcare') || lowerOccupation.includes('nurse')) {
    return HeartIcon;
  } else if (lowerOccupation.includes('parent') || lowerOccupation.includes('home')) {
    return HomeIcon;
  }
  return UserGroupIcon;
};

// Helper function to get color for persona (for display purposes)
const getPersonaColor = (index: number) => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-pink-100 text-pink-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700'
  ];
  return colors[index % colors.length];
};

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<PersonaFormMode>('create');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPersonas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/personas');
      if (response.ok) {
        const data = await response.json();
        setPersonas(data.map((item: { personaData: Persona }) => item.personaData));
      } else {
        throw new Error('Failed to fetch personas');
      }
    } catch (error) {
      console.error('Error fetching personas:', error);
      showNotification('Failed to load personas', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  const handleCreatePersona = () => {
    setFormMode('create');
    setSelectedPersona(null);
    setIsFormOpen(true);
  };

  const handleEditPersona = (persona: Persona) => {
    setFormMode('edit');
    setSelectedPersona(persona);
    setIsFormOpen(true);
  };

  const handleViewPersona = (persona: Persona) => {
    setFormMode('view');
    setSelectedPersona(persona);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: PersonaFormData) => {
    try {
      setIsSubmitting(true);
      
      if (formMode === 'create') {
        const response = await fetch('/api/personas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          showNotification('Persona created successfully!', 'success');
          await fetchPersonas();
          setIsFormOpen(false);
        } else {
          throw new Error('Failed to create persona');
        }
      } else if (formMode === 'edit' && selectedPersona) {
        const response = await fetch(`/api/personas/${selectedPersona.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          showNotification('Persona updated successfully!', 'success');
          await fetchPersonas();
          setIsFormOpen(false);
        } else {
          throw new Error('Failed to update persona');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification(
        formMode === 'create' ? 'Failed to create persona' : 'Failed to update persona',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePersona = async (persona: Persona) => {
    if (!confirm(`Are you sure you want to delete the persona "${persona.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/personas/${persona.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotification('Persona deleted successfully!', 'success');
        await fetchPersonas();
      } else {
        throw new Error('Failed to delete persona');
      }
    } catch (error) {
      console.error('Error deleting persona:', error);
      showNotification('Failed to delete persona', 'error');
    }
  };

  const handleExportPDF = async (persona: Persona) => {
    try {
      await exportPersonaToPDF(persona);
      showNotification(`${persona.name}'s persona exported to PDF successfully!`, 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotification('Failed to export PDF. Please try again.', 'error');
    }
  };

  const handleCopyJSON = async (persona: Persona) => {
    try {
      await copyPersonaToClipboard(persona);
      showNotification(`${persona.name}'s persona JSON copied to clipboard!`, 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showNotification('Failed to copy to clipboard. Please try again.', 'error');
    }
  };

  return (
    <div className="w-full">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Personas</h1>
            <p className="text-gray-600 mt-1">
              Understand your target audience through detailed customer personas
            </p>
          </div>
          <button
            onClick={handleCreatePersona}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Persona</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Personas</p>
              <p className="text-2xl font-bold text-gray-900">{personas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BriefcaseIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Personas</p>
              <p className="text-2xl font-bold text-gray-900">
                {personas.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <HeartIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Goals per Persona</p>
              <p className="text-2xl font-bold text-gray-900">
                {personas.length > 0 ? Math.round(personas.reduce((acc, p) => acc + p.goals.length, 0) / personas.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && personas.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No personas</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first customer persona.</p>
          <div className="mt-6">
            <button
              onClick={handleCreatePersona}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Persona
            </button>
          </div>
        </div>
      )}

      {/* Personas Grid */}
      {!isLoading && personas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {personas.map((persona, index) => {
            const IconComponent = getPersonaIcon(persona.occupation);
            const color = getPersonaColor(index);
            
            return (
              <div key={persona.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      {persona.image ? (
                        <Image
                          src={persona.image}
                          alt={persona.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                      <p className="text-sm text-gray-600">{persona.occupation}</p>
                      <p className="text-xs text-gray-500 mt-1">{persona.location}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          Age {persona.age}
                        </span>
                        {persona.income && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">
                            {persona.income}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 mb-4">{persona.description}</p>
                  
                  {/* Goals */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Goals</h4>
                    <div className="space-y-1">
                      {persona.goals.slice(0, 3).map((goal, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{goal}</span>
                        </div>
                      ))}
                      {persona.goals.length > 3 && (
                        <p className="text-xs text-gray-500">+{persona.goals.length - 3} more goals</p>
                      )}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Pain Points</h4>
                    <div className="space-y-1">
                      {persona.painPoints.slice(0, 3).map((pain, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{pain}</span>
                        </div>
                      ))}
                      {persona.painPoints.length > 3 && (
                        <p className="text-xs text-gray-500">+{persona.painPoints.length - 3} more pain points</p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Channels */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Preferred Channels</h4>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferredChannels.slice(0, 4).map((channel, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {channel}
                        </span>
                      ))}
                      {persona.preferredChannels.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          +{persona.preferredChannels.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPersona(persona)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditPersona(persona)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit persona"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePersona(persona)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete persona"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyJSON(persona)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copy JSON"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportPDF(persona)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Export PDF"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Persona Form Modal */}
      <PersonaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        persona={selectedPersona}
        mode={formMode}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}