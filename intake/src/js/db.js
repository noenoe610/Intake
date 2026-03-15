// Database Module - Supabase Integration
import { supabase } from './supabase-client.js';

// Get all methods
export async function getMethods() {
  const { data, error } = await supabase
    .from('methods')
    .select('*')
    .order('name');
  
  return { data, error };
}

// Get all brands for a method
export async function getBrands(methodId = null) {
  let query = supabase
    .from('brands')
    .select('*');
  
  if (methodId) {
    query = query.eq('method_id', methodId);
  }
  
  const { data, error } = await query.order('name');
  return { data, error };
}

// Get a specific brand with verification questions
export async function getBrand(brandId) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .single();
  
  return { data, error };
}

// Get posts with stats using the database function
export async function getPosts(filters = {}) {
  const { method, brand, category, limit = 20, offset = 0 } = filters;
  
  const { data, error } = await supabase
    .rpc('get_posts_with_stats', {
      filter_method: method || null,
      filter_brand: brand || null,
      filter_category: category || null,
      limit_count: limit,
      offset_count: offset
    });
  
  return { data, error };
}

// Get a single post by ID
export async function getPost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, avatar_url),
      upvotes (count),
      comments (count)
    `)
    .eq('id', postId)
    .single();
  
  return { data, error };
}

// Create a new post
export async function createPost(postData) {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();
  
  return { data, error };
}

// Update a post
export async function updatePost(postId, updates) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();
  
  return { data, error };
}

// Delete a post
export async function deletePost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  return { data, error };
}

// Get comments for a post
export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  return { data, error };
}

// Add a comment
export async function addComment(postId, content, userId) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: userId,
      content: content
    }])
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .single();
  
  return { data, error };
}

// Check if user has upvoted a post
export async function hasUpvoted(postId, userId) {
  const { data, error } = await supabase
    .from('upvotes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  return { hasUpvoted: !!data, error };
}

// Upvote a post
export async function upvotePost(postId, userId) {
  const { data, error } = await supabase
    .from('upvotes')
    .insert([{
      post_id: postId,
      user_id: userId
    }])
    .select()
    .single();
  
  return { data, error };
}

// Remove upvote
export async function removeUpvote(postId, userId) {
  const { data, error } = await supabase
    .from('upvotes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  
  return { data, error };
}

// Get user's verified methods
export async function getVerifiedMethods(userId) {
  const { data, error } = await supabase
    .from('user_verifications')
    .select(`
      *,
      brands:brand_id (id, name, manufacturer),
      methods:method_id (id, name, icon)
    `)
    .eq('user_id', userId);
  
  return { data, error };
}

// Check if user is verified for a brand
export async function isVerifiedForBrand(userId, brandId) {
  const { data, error } = await supabase
    .from('user_verifications')
    .select('id')
    .eq('user_id', userId)
    .eq('brand_id', brandId)
    .single();
  
  return { isVerified: !!data, error };
}

// Verify user for a method (after they answer questions correctly)
export async function verifyUserMethod(userId, brandId, methodId) {
  const { data, error } = await supabase
    .from('user_verifications')
    .insert([{
      user_id: userId,
      brand_id: brandId,
      method_id: methodId
    }])
    .select()
    .single();
  
  return { data, error };
}

// Get user's posts
export async function getUserPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      upvotes (count),
      comments (count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

// Search posts
export async function searchPosts(searchQuery) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username),
      upvotes (count),
      comments (count)
    `)
    .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    .order('created_at', { ascending: false })
    .limit(20);
  
  return { data, error };
}
