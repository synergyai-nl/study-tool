'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddEntryForm({ onFeedback }: { onFeedback?: (msg: string, type?: 'success' | 'error') => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHotkeyHelp, setShowHotkeyHelp] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Hotkey support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Focus form: 'n' (not in input/textarea)
      if (
        e.key === 'n' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        titleInputRef.current?.focus();
      }
      // Submit form: Ctrl+Enter or Cmd+Enter
      if (
        (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) &&
        (document.activeElement === titleInputRef.current || document.activeElement?.id === 'description')
      ) {
        e.preventDefault();
        formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
      // Show hotkey help: '?' or Shift + /
      if ((e.key === '?' && !e.shiftKey) || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowHotkeyHelp((v) => !v);
      }
      // Close hotkey help with Escape
      if (e.key === 'Escape' && showHotkeyHelp) {
        setShowHotkeyHelp(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHotkeyHelp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (onFeedback) onFeedback('', undefined); // Clear previous

    try {
      const { error } = await supabase
        .from('entries')
        .insert([
          {
            title,
            description,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        throw error;
      }

      if (onFeedback) onFeedback('Entry added successfully!', 'success');
      setTitle('');
      setDescription('');
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      if (onFeedback) onFeedback(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 relative transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
        Add New Entry
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer" title="Show hotkeys (? or Shift+/)">
          <kbd>?</kbd>
        </span>
      </h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" aria-label="Add new entry form">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
            <span className="ml-1 text-xs text-gray-400">(required)</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required="true"
            aria-label="Title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:scale-[1.02]"
            placeholder="Enter a short, descriptive title..."
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1">Max 100 characters.</p>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
            <span className="ml-1 text-xs text-gray-400">(required)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            aria-required="true"
            aria-label="Description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:scale-[1.02]"
            placeholder="Describe your entry..."
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1">Max 500 characters. Markdown supported.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Adding...
            </span>
          ) : 'Add Entry'}
        </button>
      </form>
      {showHotkeyHelp && (
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded p-4 z-50 w-72 animate-fade-in">
          <h4 className="font-bold mb-2">Hotkeys</h4>
          <ul className="text-sm space-y-1">
            <li><kbd>n</kbd>: Focus "Add New Entry" form</li>
            <li><kbd>Ctrl</kbd>+<kbd>Enter</kbd> or <kbd>Cmd</kbd>+<kbd>Enter</kbd>: Submit entry</li>
            <li><kbd>?</kbd> or <kbd>Shift</kbd>+<kbd>/</kbd>: Toggle this help</li>
            <li><kbd>Esc</kbd>: Close this help</li>
          </ul>
        </div>
      )}
    </div>
  );
} 