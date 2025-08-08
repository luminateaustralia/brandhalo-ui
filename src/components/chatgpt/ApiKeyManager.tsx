'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ClipboardDocumentIcon, 
  TrashIcon, 
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ApiKey {
  id: string;
  name: string;
  lastUsed: string | null;
  createdAt: string;
  isActive: boolean;
}

interface ApiKeyWithSecret extends ApiKey {
  key?: string; // Only present during creation
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  // Load API keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chatgpt/auth');
      
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      } else {
        throw new Error('Failed to load API keys');
      }
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error loading API keys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a name for the API key');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      
      const response = await fetch('/api/chatgpt/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      if (response.ok) {
        const newKey: ApiKeyWithSecret = await response.json();
        setNewlyCreatedKey(newKey.key || null);
        setNewKeyName('');
        setSuccess('API key created successfully! Make sure to copy it now - you won\'t be able to see it again.');
        await loadApiKeys(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create API key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
      console.error('Error creating API key:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/chatgpt/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId }),
      });

      if (response.ok) {
        setSuccess('API key revoked successfully');
        await loadApiKeys(); // Refresh the list
      } else {
        throw new Error('Failed to revoke API key');
      }
    } catch (err) {
      setError('Failed to revoke API key');
      console.error('Error revoking API key:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('API key copied to clipboard!');
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <KeyIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">ChatGPT Integration API Keys</h2>
          </div>
          <p className="text-sm text-gray-600">
            Create and manage API keys to connect your BrandHalo account with ChatGPT.
            These keys allow ChatGPT to access your brand information securely.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Newly created key display */}
          {newlyCreatedKey && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="space-y-3">
                <p className="font-medium text-blue-900">Your new API key:</p>
                <div className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded">
                  <code className="flex-1 text-sm font-mono text-gray-800">
                    {showKey ? newlyCreatedKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </code>
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-blue-700">
                  ⚠️ This is the only time you&apos;ll see this key. Make sure to copy and store it securely.
                </p>
              </div>
            </div>
          )}

          {/* Create new API key */}
          <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
            <label htmlFor="keyName" className="block text-sm font-medium text-gray-700">
              Create New API Key
            </label>
            <div className="flex gap-2">
              <input
                id="keyName"
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter a name for this API key (e.g., 'ChatGPT Integration')"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={isCreating}
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={createApiKey}
                disabled={isCreating || !newKeyName.trim()}
              >
                {isCreating ? (
                  'Creating...'
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create
                  </>
                )}
              </button>
            </div>
          </div>

          {/* API Keys list */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Your API Keys</h4>
            {isLoading ? (
              <p className="text-gray-500">Loading API keys...</p>
            ) : apiKeys.length === 0 ? (
              <p className="text-gray-500">No API keys created yet.</p>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{key.name}</p>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(key.createdAt)}
                        {key.lastUsed && ` • Last used: ${formatDate(key.lastUsed)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        key.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {key.isActive ? 'Active' : 'Revoked'}
                      </span>
                      {key.isActive && (
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          onClick={() => revokeApiKey(key.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to use with ChatGPT:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copy your API key from above</li>
              <li>Go to ChatGPT and create a new GPT or use an existing one</li>
                              <li>Add a new Action with this URL: <code className={`bg-blue-100 px-1 rounded`}>{typeof window !== 'undefined' ? window.location.origin : ''}/api/chatgpt/manifest</code></li>
                              <li>Set the authentication to &quot;Bearer&quot; and paste your API key</li>
              <li>Now ChatGPT can access your BrandHalo brand information!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
