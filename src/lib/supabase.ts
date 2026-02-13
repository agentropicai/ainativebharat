import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Founder {
  id: string;
  name: string;
  company: string | null;
  city: string | null;
  agents: { name: string; description: string }[];
  mentor_id: string | null;
  generation: number;
  verified: boolean;
  created_at: string;
}
