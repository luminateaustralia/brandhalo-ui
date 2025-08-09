'use client';

export const runtime = 'edge';

import React, { useEffect, useMemo, useState } from 'react';

export default function AdminChatGPTSchemaPage() {
  const [schema, setSchema] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const schemaUrl = '/api/chatgpt/manifest';

  useEffect(() => {
    let isMounted = true;
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const res = await fetch(schemaUrl);
        if (!res.ok) throw new Error(`Failed to load schema: ${res.status}`);
        const data = await res.json();
        if (isMounted) setSchema(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSchema();
    return () => {
      isMounted = false;
    };
  }, [schemaUrl]);

  const jsonText = useMemo(() => (schema ? JSON.stringify(schema, null, 2) : ''), [schema]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openai-actions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">ChatGPT CustomGPT Schema</h1>
          <p className="text-sm text-gray-500 mt-1">Live OpenAPI served from {schemaUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!schema}
            className="px-3 py-2 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!schema}
            className="px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Download JSON
          </button>
          <a
            href={schemaUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Open Raw
          </a>
        </div>
      </div>

      {loading && (
        <div className="text-gray-500">Loading…</div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {schema && (
        <pre className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto text-xs leading-5">
{jsonText}
        </pre>
      )}
    </div>
  );
}


