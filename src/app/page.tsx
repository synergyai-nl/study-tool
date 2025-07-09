import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

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

    return <HomeClient data={data || []} />;
  } catch (error: any) {
    // Fallback error UI (can be improved)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4">
        <header className="w-full max-w-4xl flex flex-col items-center mb-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Funbox Entries</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl">A beautiful, modern app to add and view your Supabase entries. Fast, accessible, and delightful to use.</p>
        </header>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <p className="font-bold">Error:</p>
          <p>{error.message}</p>
        </div>
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
