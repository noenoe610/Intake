# Database Schema for Birth Control Community

## Overview
This document outlines the PostgreSQL database schema for the Birth Control Community platform using Supabase.

## Tables

### 1. users (handled by Supabase Auth)
Supabase provides built-in authentication with a `auth.users` table.
We'll extend it with a custom `profiles` table.

### 2. profiles
Stores additional user profile information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bio TEXT,
  avatar_url TEXT
);
```

### 3. methods
Birth control methods (pills, IUD, implant, etc.)

```sql
CREATE TABLE methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. brands
Specific brands/products for each method

```sql
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  method_id TEXT REFERENCES methods(id) NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT,
  type TEXT, -- e.g., "combined", "progestin-only"
  generation TEXT, -- e.g., "third", "fourth"
  active_ingredients JSONB,
  verification_questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. user_verifications
Tracks which methods/brands users are verified for

```sql
CREATE TABLE user_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  brand_id TEXT REFERENCES brands(id) NOT NULL,
  method_id TEXT REFERENCES methods(id) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);
```

### 6. posts
User-generated posts (tips, experiences, discussions)

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  brand_id TEXT REFERENCES brands(id),
  method_id TEXT REFERENCES methods(id) NOT NULL,
  category TEXT NOT NULL, -- 'tips', 'side-effects', 'discussion'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. comments
Comments on posts

```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. upvotes
Track upvotes on posts

```sql
CREATE TABLE upvotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

### 9. tags
Tags for posts (optional, for better categorization)

```sql
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. post_tags
Many-to-many relationship between posts and tags

```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

## Indexes

```sql
-- Improve query performance
CREATE INDEX idx_posts_method ON posts(method_id);
CREATE INDEX idx_posts_brand ON posts(brand_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_upvotes_post ON upvotes(post_id);
CREATE INDEX idx_user_verifications_user ON user_verifications(user_id);
```

## Row Level Security (RLS)

Enable RLS for all tables to ensure users can only access/modify their own data appropriately.

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Posts: Everyone can read, only authenticated users can create, only authors can update/delete
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Comments: Everyone can read, only authenticated can create, only authors can update/delete
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Upvotes: Everyone can read, authenticated can create, users can only delete their own
CREATE POLICY "Upvotes are viewable by everyone"
  ON upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own upvotes"
  ON upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- User verifications: Users can only see and create their own
CREATE POLICY "Users can view own verifications"
  ON user_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own verifications"
  ON user_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Functions

### Get post with counts (upvotes, comments, author info)

```sql
CREATE OR REPLACE FUNCTION get_posts_with_stats()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  brand_id TEXT,
  method_id TEXT,
  category TEXT,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  upvote_count BIGINT,
  comment_count BIGINT,
  user_verified BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    prof.username,
    p.brand_id,
    p.method_id,
    p.category,
    p.title,
    p.content,
    p.created_at,
    COUNT(DISTINCT u.id) AS upvote_count,
    COUNT(DISTINCT c.id) AS comment_count,
    EXISTS(
      SELECT 1 FROM user_verifications uv 
      WHERE uv.user_id = p.user_id 
      AND uv.brand_id = p.brand_id
    ) AS user_verified
  FROM posts p
  LEFT JOIN profiles prof ON p.user_id = prof.id
  LEFT JOIN upvotes u ON p.id = u.post_id
  LEFT JOIN comments c ON p.id = c.post_id
  GROUP BY p.id, prof.username, p.user_id, p.brand_id, p.method_id, p.category, p.title, p.content, p.created_at
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## Seed Data

Insert initial methods and brands from JSON files.

```sql
-- Insert methods
INSERT INTO methods (id, name, icon, description) VALUES
  ('pills', 'Birth Control Pills', '💊', 'Oral contraceptives taken daily'),
  ('iud', 'IUD', '🔧', 'Long-term intrauterine device'),
  ('implant', 'Implant', '💉', 'Arm implant lasting 3-5 years'),
  ('patch', 'Patch', '🩹', 'Weekly contraceptive patch'),
  ('ring', 'Vaginal Ring', '⭕', 'Monthly contraceptive ring');

-- Insert brands (example for pills)
INSERT INTO brands (id, method_id, name, manufacturer, type, generation, active_ingredients, verification_questions) VALUES
  ('yasmin', 'pills', 'Yasmin', 'Bayer', 'combined', 'fourth', 
   '["Drospirenone", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "What color are the active pills in Yasmin?", "options": ["Yellow", "White", "Pink", "Blue"], "correct": "Yellow"},
     {"question": "How many active pills are in one pack?", "options": ["21", "24", "28", "30"], "correct": "21"},
     {"question": "What is printed on each active pill?", "options": ["DO", "YZ", "28", "BAYER"], "correct": "DO"}
   ]'::jsonb);
```

## Notes

- Use Supabase's built-in auth for user management
- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- JSONB is used for flexible data like verification questions
- RLS ensures data security at the database level
- Indexes improve query performance for common access patterns
