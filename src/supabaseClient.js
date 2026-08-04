import { createClient } from "@supabase/supabase-js";

const supabaseEnv = import.meta.env || {};
const supabaseUrl = supabaseEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = supabaseEnv.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "visual-drill-auth",
    },
  })
  : null;
