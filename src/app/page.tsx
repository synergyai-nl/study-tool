import Image from "next/image";
import { supabase } from '@/lib/supabase';
import AddEntryForm from '@/components/AddEntryForm';

export default async function Home() {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .limit(5);

    if (error) {
      throw error;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Supabase Data Display</h1>
        
        <div className="w-full max-w-4xl">
          <AddEntryForm />
          
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Data Entries:</h2>
          
          {data && data.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <p className="font-bold">No Data Found</p>
              <p className="text-sm">The 'entries' table is empty or doesn't exist. Create some data in your Supabase dashboard or use the form above.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Supabase Integration</h1>
        
        {error.message.includes('Missing Supabase environment variables') ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-md">
            <p className="font-bold">Configuration Required</p>
            <p className="text-sm">Please set up your Supabase environment variables:</p>
            <ul className="text-sm mt-2 list-disc list-inside">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
            <p className="font-bold">Error:</p>
            <p>{error.message}</p>
          </div>
        )}
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm max-w-md">
          <p className="font-semibold mb-2">Steps to set up:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Create a .env.local file in your project root</li>
            <li>Add your Supabase URL and anon key</li>
            <li>Create an 'entries' table in your Supabase dashboard</li>
            <li>Add some sample data to the table</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </div>
    );
  }
}
