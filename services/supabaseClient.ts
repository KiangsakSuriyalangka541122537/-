import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION: Updated for Project "BookPhone/Calenda-La/Table-Kik/House"
// ------------------------------------------------------------------

const PROJECT_URL = 'https://xlxlyzqzwwqeoqoqinpl.supabase.co';
const PROJECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZXl4c2lxeHV6aW15Zndvamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDE4OTQsImV4cCI6MjA4NTMxNzg5NH0.NVpRclwEWDkYLo_WwgYSGcTHrIAyh1JCCreIiMT5z6Y';

// Use environment variables if available, otherwise fallback to the hardcoded values provided.
export const SUPABASE_URL = process.env.SUPABASE_URL || PROJECT_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || PROJECT_ANON_KEY;

// Create Supabase client configured for the specific schema "House-Management"
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'House-Management' 
  }
});