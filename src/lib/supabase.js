import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Initializing with URL:', SUPABASE_URL?.substring(0, 30) + '...');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] Missing configuration:', {
    hasURL: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY
  });
  throw new Error('Supabase URL and ANON_KEY must be defined in .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('[Supabase] Client created successfully');
