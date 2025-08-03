'use client';

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  TagIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { 
  BrandVoiceFormData, 
  BrandVoiceFormMode,
  COMMUNICATION_STYLES,
  TONE_OPTIONS,
  DEPARTMENT_OPTIONS
} from '@/types/brandVoice';

interface BrandVoiceFormProps {
  mode: BrandVoiceFormMode;
  initialData?: BrandVoiceFormData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BrandVoiceFormData) => Promise<void>;
  isLoading?: boolean;
}

const emptyFormData: BrandVoiceFormData = {
  name: '',
  jobTitle: '',
  department: '',
  email: '',
  bio: '',
  profileImage: '',
  communicationStyle: '',
  tone: '',
  personalityTraits: [],
  contentFocus: [],
  preferredTopics: [],
  expertiseAreas: [],
  doList: [],
  dontList: [],
  keyMessages: [],
  isActive: true
};

export default function BrandVoiceForm({
  mode,
  initialData,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: BrandVoiceFormProps) {
  const [formData, setFormData] = useState<BrandVoiceFormData>(initialData || emptyFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyFormData);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.communicationStyle) newErrors.communicationStyle = 'Communication style is required';
    if (!formData.tone) newErrors.tone = 'Tone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleArrayFieldChange = (field: keyof BrandVoiceFormData, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = formData[field] as string[];
    if (!currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof BrandVoiceFormData, index: number) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const ArrayInput = ({ 
    field, 
    label, 
    placeholder, 
    icon: Icon 
  }: { 
    field: keyof BrandVoiceFormData; 
    label: string; 
    placeholder: string; 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => {
    const [inputValue, setInputValue] = useState('');
    const currentArray = formData[field] as string[];

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleArrayFieldChange(field, inputValue);
        setInputValue('');
      }
    };

    return (
      <div>
        <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {currentArray.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
            >
              {item}
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Brand Voice
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Sarah Johnson"
                disabled={mode === 'view'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="sarah@company.com"
                disabled={mode === 'view'}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Senior Marketing Manager"
                disabled={mode === 'view'}
              />
              {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={mode === 'view'}
              >
                <option value="">Select Department</option>
                {DEPARTMENT_OPTIONS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Bio *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief professional bio and background..."
              disabled={mode === 'view'}
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          {/* Communication Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Communication Style *
              </label>
              <select
                value={formData.communicationStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, communicationStyle: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.communicationStyle ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={mode === 'view'}
              >
                <option value="">Select Style</option>
                {COMMUNICATION_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              {errors.communicationStyle && <p className="text-red-500 text-sm mt-1">{errors.communicationStyle}</p>}
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Tone *
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.tone ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={mode === 'view'}
              >
                <option value="">Select Tone</option>
                {TONE_OPTIONS.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
              {errors.tone && <p className="text-red-500 text-sm mt-1">{errors.tone}</p>}
            </div>
          </div>

          {/* Array Fields */}
          {mode !== 'view' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayInput
                field="personalityTraits"
                label="Personality Traits"
                placeholder="Add trait and press Enter"
                icon={TagIcon}
              />
              <ArrayInput
                field="contentFocus"
                label="Content Focus Areas"
                placeholder="Add focus area and press Enter"
                icon={LightBulbIcon}
              />
              <ArrayInput
                field="expertiseAreas"
                label="Expertise Areas"
                placeholder="Add expertise and press Enter"
                icon={SparklesIcon}
              />
              <ArrayInput
                field="keyMessages"
                label="Key Messages"
                placeholder="Add key message and press Enter"
                icon={ChatBubbleLeftRightIcon}
              />
              <ArrayInput
                field="doList"
                label="Do's"
                placeholder="Add guideline and press Enter"
                icon={TagIcon}
              />
              <ArrayInput
                field="dontList"
                label="Don'ts"
                placeholder="Add restriction and press Enter"
                icon={XMarkIcon}
              />
            </div>
          )}

          {/* Display-only arrays for view mode */}
          {mode === 'view' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['personalityTraits', 'contentFocus', 'expertiseAreas', 'keyMessages', 'doList', 'dontList'].map(field => {
                const array = formData[field as keyof BrandVoiceFormData] as string[];
                if (array.length === 0) return null;
                
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {array.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              disabled={mode === 'view'}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active (will appear in content creation options)
            </label>
          </div>

          {/* Form Actions */}
          {mode !== 'view' && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Voice' : 'Update Voice'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}