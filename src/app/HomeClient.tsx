"use client";
import Image from "next/image";
import AddEntryForm from '@/components/AddEntryForm';
import ToastProvider, { useToast } from '@/components/ToastProvider';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function AddEntryFormWithToast() {
  const { showToast } = useToast();
  return <AddEntryForm onFeedback={showToast} />;
}

export default function HomeClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const PAGE_SIZE = 10;

  const fetchEntries = async (from: number, to: number) => {
    setLoading(true);
    const { data: newData, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);
    setLoading(false);
    if (error) return;
    if (newData.length < PAGE_SIZE + 1) setHasMore(false);
    setData((prev) => [...prev, ...newData]);
  };

  useEffect(() => {
    fetchEntries(0, PAGE_SIZE - 1);
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    fetchEntries(data.length, data.length + PAGE_SIZE - 1);
  };

  // Sorting logic
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // fallback to string comparison
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center justify-start p-4">
        {/* Header */}
        <header className="w-full max-w-4xl flex flex-col items-center mb-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/globe.svg" alt="Logo" width={48} height={48} />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Funbox Entries</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl">A beautiful, modern app to add and view your Supabase entries. Fast, accessible, and delightful to use.</p>
        </header>

        <main className="w-full max-w-4xl flex flex-col gap-8">
          <AddEntryFormWithToast />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span>Data Entries</span>
            </h2>
            {data && data.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-300"
                            onClick={() => handleSort(key)}
                            aria-sort={sortColumn === key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort(key); }}
                            role="columnheader button"
                          >
                            <span className="flex items-center gap-1">
                              {key}
                              {sortColumn === key && (
                                <span aria-label={sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending'}>
                                  {sortDirection === 'asc' ? '▲' : '▼'}
                                </span>
                              )}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {getSortedData().map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "" + " hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"}>
                          {Object.values(row).map((value, valueIndex) => {
                            let displayValue = value;
                            let isTruncated = false;
                            if (typeof value === 'string' && value.length > 60) {
                              displayValue = value.slice(0, 60) + '…';
                              isTruncated = true;
                            }
                            return (
                              <td
                                key={valueIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 max-w-xs overflow-hidden text-ellipsis"
                                title={isTruncated && typeof value === 'string' ? value : undefined}
                              >
                                {typeof value === 'object' ? JSON.stringify(value) : String(displayValue)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {hasMore && (
                  <div className="flex justify-center p-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Image src="/window.svg" alt="Empty" width={80} height={80} className="mb-4 opacity-80" />
                <p className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-1">No Data Found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The 'entries' table is empty or doesn't exist. Create some data in your Supabase dashboard or use the form above.</p>
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">Tip: Try adding your first entry!</span>
              </div>
            )}
          </section>
        </main>
      </div>
    </ToastProvider>
  );
} 