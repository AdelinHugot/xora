import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ziizmsogdyswtmsswsza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaXptc29nZHlzd3Rtc3N3c3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQwODcsImV4cCI6MjA3ODk2MDA4N30.JWP1akRe9DXhHUT_eFvZ_9JS7u523lhl_WEw_NHN38E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
