// Temporary Mock Supabase Client for Local Testing
// This allows you to see the app without setting up Supabase yet
// Replace this entire file when you're ready to deploy with real Supabase

console.log('⚠️ Using mock Supabase client for local testing');

// Mock Supabase client
export const supabase = {
  auth: {
    async getSession() {
      const user = localStorage.getItem('temp_user');
      return user ? { data: { session: { user: JSON.parse(user) } }, error: null } : { data: { session: null }, error: null };
    },
    async signUp({ email, password, options }) {
      const user = {
        id: 'temp-' + Date.now(),
        email: email,
        user_metadata: options?.data || {}
      };
      localStorage.setItem('temp_user', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    async signInWithPassword({ email, password }) {
      const user = {
        id: 'temp-user-1',
        email: email
      };
      localStorage.setItem('temp_user', JSON.stringify(user));
      return { data: { user, session: { user } }, error: null };
    },
    async signOut() {
      localStorage.removeItem('temp_user');
      return { error: null };
    },
    onAuthStateChange(callback) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from(table) {
    return {
      select(columns) { return this; },
      insert(data) {
        return { select: () => ({ single: async () => ({ data: data[0], error: null }) }) };
      },
      update(data) {
        return { eq: () => ({ select: () => ({ single: async () => ({ data, error: null }) }) }) };
      },
      delete() { return { eq: () => ({ eq: async () => ({ data: null, error: null }) }) }; },
      eq(column, value) { return { single: async () => ({ data: null, error: null }), order: () => this }; },
      order(column, options) { return this; },
      async single() { return { data: null, error: null }; }
    };
  },
  async rpc(functionName, params) {
    // Mock posts
    if (functionName === 'get_posts_with_stats') {
      const mockPosts = [
        {
          id: '1',
          user_id: 'temp-user-1',
          username: 'Sarah',
          method_id: 'pills',
          brand_id: 'yasmin',
          category: 'tips',
          title: 'Don\'t take with grapefruit!',
          content: 'I learned the hard way that grapefruit juice can interfere with absorption. Always check your breakfast!',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          upvote_count: 24,
          comment_count: 5,
          user_verified: true
        },
        {
          id: '2',
          user_id: 'temp-user-2',
          username: 'Jessica',
          method_id: 'pills',
          brand_id: 'yaz',
          category: 'tips',
          title: 'Set multiple alarms!',
          content: 'I set 3 alarms - 10 minutes before, at pill time, and 10 minutes after. Haven\'t missed one since!',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          upvote_count: 18,
          comment_count: 3,
          user_verified: true
        },
        {
          id: '3',
          user_id: 'temp-user-3',
          username: 'Emma',
          method_id: 'iud',
          brand_id: 'mirena',
          category: 'side-effects',
          title: 'First month was rough, but it got better',
          content: 'Had cramping and spotting for about 3 weeks after insertion. After that, it\'s been smooth sailing for 2 years now!',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          upvote_count: 32,
          comment_count: 12,
          user_verified: true
        }
      ];
      return { data: mockPosts, error: null };
    }
    return { data: [], error: null };
  }
};
