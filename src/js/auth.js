// Authentication Module - Supabase Integration
import { supabase } from './supabase-client.js';

let currentUser = null;

// Check if user is authenticated
export async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error checking auth:', error);
    return null;
  }
  
  if (session?.user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    currentUser = {
      ...session.user,
      username: profile?.username,
      avatar_url: profile?.avatar_url
    };
    
    return currentUser;
  }
  
  return null;
}

// Sign up new user - FIXED VERSION
export async function signup(email, password, username) {
  // First, check if username is taken (FIXED - no .single())
  const { data: existingUsers } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username);
  
  if (existingUsers && existingUsers.length > 0) {
    return {
      user: null,
      error: { message: 'Username already taken' }
    };
  }
  
  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username
      }
    }
  });
  
  if (error) {
    return { user: null, error };
  }
  
  if (data.user) {
    currentUser = {
      ...data.user,
      username: username
    };
  }
  
  return { user: data.user, error: null };
}

// Sign in existing user
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    return { user: null, error };
  }
  
  if (data.user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    currentUser = {
      ...data.user,
      username: profile?.username,
      avatar_url: profile?.avatar_url
    };
  }
  
  return { user: currentUser, error: null };
}

// Sign out
export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return { error };
  }
  
  currentUser = null;
  window.location.hash = 'home';
  window.location.reload();
  
  return { error: null };
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Check if authenticated
export function isAuthenticated() {
  return currentUser !== null;
}

// Update user profile
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (!error && data) {
    currentUser = {
      ...currentUser,
      ...data
    };
  }
  
  return { data, error };
}

// Reset password
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}

// Update password
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { data, error };
}