"use client";
import Image from "next/image";
import AddEntryForm from '@/components/AddEntryForm';
import ToastProvider, { useToast } from '@/components/ToastProvider';
import React from 'react';

function AddEntryFormWithToast() {
  const { showToast } = useToast();
  return <AddEntryForm onFeedback={showToast} />;
}

export default function HomeClient({ data }: { data: any[] }) {
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
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">(latest 5)</span>
            </h2>
            {data && data.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(data[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {data.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "" + " hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"}>
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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