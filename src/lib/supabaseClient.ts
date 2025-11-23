import { createClient } from '@supabase/supabase-js';

// FIX: Read the Supabase credentials from Vite's environment variables.
// This is the standard way to use your .env file in a Vite project.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if the variables were loaded correctly.
if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Make sure VITE_SUPABASE_URL is set in your .env file.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key is missing. Make sure VITE_SUPABASE_PUBLISHABLE_KEY is set in your .env file.");
}

// Initialize the Supabase client with the credentials from your .env file.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
