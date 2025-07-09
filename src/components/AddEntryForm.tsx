'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddEntryForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
    setMessage('');

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

      setMessage('Entry added successfully!');
      setTitle('');
      setDescription('');
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 relative">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        Add New Entry
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer" title="Show hotkeys (? or Shift+/)">
          <kbd>?</kbd>
        </span>
      </h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter title..."
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter description..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {loading ? 'Adding...' : 'Add Entry'}
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {message}
        </div>
      )}
      {showHotkeyHelp && (
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded p-4 z-50 w-72">
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