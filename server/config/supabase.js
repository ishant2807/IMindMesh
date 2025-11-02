import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Backend Supabase credentials missing!');
  console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('   Get service_role key from: Supabase Dashboard → Settings → API');
  throw new Error('Supabase service configuration is required for backend');
}

// Server-side client with service role key for privileged operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
