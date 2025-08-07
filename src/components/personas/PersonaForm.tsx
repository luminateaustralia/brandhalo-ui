'use client';

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { 
  Persona, 
  PersonaFormData, 
  PersonaFormMode,
  OCCUPATION_OPTIONS,
  INCOME_RANGES,
  CHANNEL_OPTIONS,
  BUYING_BEHAVIOR_OPTIONS
} from '@/types/persona';

interface PersonaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonaFormData) => Promise<void>;
  persona: Persona | null;
  mode: PersonaFormMode;
  isSubmitting: boolean;
}

export default function PersonaForm({
  isOpen,
  onClose,
  onSubmit,
  persona,
  mode,
  isSubmitting
}: PersonaFormProps) {
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    age: 25,
    occupation: '',
    location: '',
    income: '',
    image: '',
    description: '',
    goals: [''],
    painPoints: [''],
    preferredChannels: [''],
    buyingBehavior: '',
    isActive: true
  });

  useEffect(() => {
    if (persona && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: persona.name,
        age: persona.age,
        occupation: persona.occupation,
        location: persona.location,
        income: persona.income,
        image: persona.image,
        description: persona.description,
        goals: persona.goals.length > 0 ? persona.goals : [''],
        painPoints: persona.painPoints.length > 0 ? persona.painPoints : [''],
        preferredChannels: persona.preferredChannels.length > 0 ? persona.preferredChannels : [''],
        buyingBehavior: persona.buyingBehavior,
        isActive: persona.isActive
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        age: 25,
        occupation: '',
        location: '',
        income: '',
        image: '',
        description: '',
        goals: [''],
        painPoints: [''],
        preferredChannels: [''],
        buyingBehavior: '',
        isActive: true
      });
    }
  }, [persona, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    const cleanedData = {
      ...formData,
      goals: formData.goals.filter(goal => goal.trim() !== ''),
      painPoints: formData.painPoints.filter(point => point.trim() !== ''),
      preferredChannels: formData.preferredChannels.filter(channel => channel.trim() !== '')
    };

    await onSubmit(cleanedData);
  };

  const addListItem = (field: 'goals' | 'painPoints' | 'preferredChannels') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'goals' | 'painPoints' | 'preferredChannels', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (field: 'goals' | 'painPoints' | 'preferredChannels', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Create New Persona' : mode === 'edit' ? 'Edit Persona' : 'View Persona';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isReadOnly}
                  placeholder="e.g., Sarah Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isReadOnly}
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation *
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Select occupation</option>
                  {OCCUPATION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                  placeholder="e.g., Sydney, Australia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Range
                </label>
                <select
                  value={formData.income}
                  onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                >
                  <option value="">Select income range</option>
                  {INCOME_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isReadOnly}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReadOnly}
                placeholder="Brief description of this persona..."
              />
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals
              </label>
              <div className="space-y-2">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateListItem('goals', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isReadOnly}
                      placeholder="Enter a goal..."
                    />
                    {!isReadOnly && formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('goals', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => addListItem('goals')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Goal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Points
              </label>
              <div className="space-y-2">
                {formData.painPoints.map((painPoint, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={painPoint}
                      onChange={(e) => updateListItem('painPoints', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isReadOnly}
                      placeholder="Enter a pain point..."
                    />
                    {!isReadOnly && formData.painPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('painPoints', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => addListItem('painPoints')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Pain Point</span>
                  </button>
                )}
              </div>
            </div>

            {/* Preferred Channels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Channels
              </label>
              <div className="space-y-2">
                {formData.preferredChannels.map((channel, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={channel}
                      onChange={(e) => updateListItem('preferredChannels', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isReadOnly}
                    >
                      <option value="">Select a channel</option>
                      {CHANNEL_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {!isReadOnly && formData.preferredChannels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('preferredChannels', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => addListItem('preferredChannels')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Channel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Buying Behavior */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buying Behavior
              </label>
              <select
                value={formData.buyingBehavior}
                onChange={(e) => setFormData(prev => ({ ...prev, buyingBehavior: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isReadOnly}
              >
                <option value="">Select buying behavior</option>
                {BUYING_BEHAVIOR_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isReadOnly}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active persona
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Persona' : 'Update Persona'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
