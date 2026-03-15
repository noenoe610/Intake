// Supabase Client - Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your actual credentials

// Your Supabase credentials
const SUPABASE_URL = 'https://zkthgjpyqcjqljlebkzt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdGhnanB5cWNqcWxqbGVia3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzkxNDIsImV4cCI6MjA4OTExNTE0Mn0.z3ulPIC3HcixfSaIyxA9svH9ap-KcoLqoYZOkCN3bm0';

// Create Supabase client using global supabase from CDN
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  if (event === 'SIGNED_IN') {
    console.log('User signed in');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

console.log('✅ Supabase client initialized');
