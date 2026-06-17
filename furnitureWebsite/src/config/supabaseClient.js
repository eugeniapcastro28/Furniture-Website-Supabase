import { createClient } from '@supabase/supabase-js';

// Read values straight out of our secure Vite runtime environment config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail early if keys are missing from the configuration environment setup
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration parameters. Verify your .env.local variables!");
}

// Instantiate the database client connection instance layer securely
export const supabase = createClient(supabaseUrl, supabaseAnonKey);