-- Birth Control Community Database Setup
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bio TEXT,
  avatar_url TEXT
);

-- Methods table
CREATE TABLE methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  method_id TEXT REFERENCES methods(id) NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT,
  type TEXT,
  generation TEXT,
  active_ingredients JSONB,
  verification_questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User verifications table
CREATE TABLE user_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_id TEXT REFERENCES brands(id) NOT NULL,
  method_id TEXT REFERENCES methods(id) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_id TEXT REFERENCES brands(id),
  method_id TEXT REFERENCES methods(id) NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upvotes table
CREATE TABLE upvotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post tags junction table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

CREATE INDEX idx_posts_method ON posts(method_id);
CREATE INDEX idx_posts_brand ON posts(brand_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_upvotes_post ON upvotes(post_id);
CREATE INDEX idx_upvotes_user ON upvotes(user_id);
CREATE INDEX idx_user_verifications_user ON user_verifications(user_id);
CREATE INDEX idx_user_verifications_brand ON user_verifications(brand_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Posts policies
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

-- Comments policies
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

-- Upvotes policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own upvotes"
  ON upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- User verifications policies
CREATE POLICY "Users can view own verifications"
  ON user_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own verifications"
  ON user_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Methods and brands are public, read-only
ALTER TABLE methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Methods are viewable by everyone"
  ON methods FOR SELECT
  USING (true);

CREATE POLICY "Brands are viewable by everyone"
  ON brands FOR SELECT
  USING (true);

-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- Function to get posts with all stats
CREATE OR REPLACE FUNCTION get_posts_with_stats(
  filter_method TEXT DEFAULT NULL,
  filter_brand TEXT DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
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
      AND (uv.brand_id = p.brand_id OR p.brand_id IS NULL)
    ) AS user_verified
  FROM posts p
  LEFT JOIN profiles prof ON p.user_id = prof.id
  LEFT JOIN upvotes u ON p.id = u.post_id
  LEFT JOIN comments c ON p.id = c.post_id
  WHERE 
    (filter_method IS NULL OR p.method_id = filter_method)
    AND (filter_brand IS NULL OR p.brand_id = filter_brand)
    AND (filter_category IS NULL OR p.category = filter_category)
  GROUP BY p.id, prof.username, p.user_id, p.brand_id, p.method_id, p.category, p.title, p.content, p.created_at
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup (creates profile automatically)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. SEED DATA
-- ============================================================================

-- Insert methods
INSERT INTO methods (id, name, icon, description) VALUES
  ('pills', 'Birth Control Pills', '💊', 'Oral contraceptives taken daily'),
  ('iud', 'IUD', '🔧', 'Long-term intrauterine device'),
  ('implant', 'Implant', '💉', 'Arm implant lasting 3-5 years'),
  ('patch', 'Patch', '🩹', 'Weekly contraceptive patch'),
  ('ring', 'Vaginal Ring', '⭕', 'Monthly contraceptive ring');

-- Insert pill brands with verification questions
INSERT INTO brands (id, method_id, name, manufacturer, type, generation, active_ingredients, verification_questions) VALUES
  ('yasmin', 'pills', 'Yasmin', 'Bayer', 'combined', 'fourth', 
   '["Drospirenone", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "What color are the active pills in Yasmin?", "options": ["Yellow", "White", "Pink", "Blue"], "correct": "Yellow"},
     {"question": "How many active pills are in one pack?", "options": ["21", "24", "28", "30"], "correct": "21"},
     {"question": "What is printed on each active pill?", "options": ["DO", "YZ", "28", "BAYER"], "correct": "DO"}
   ]'::jsonb),
  
  ('yaz', 'pills', 'Yaz', 'Bayer', 'combined', 'fourth', 
   '["Drospirenone", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "What color are the active pills in Yaz?", "options": ["Light pink", "Yellow", "White", "Blue"], "correct": "Light pink"},
     {"question": "How many active pills are in one pack?", "options": ["21", "24", "28", "30"], "correct": "24"},
     {"question": "How many placebo pills are in the pack?", "options": ["4", "7", "0", "2"], "correct": "4"}
   ]'::jsonb),
  
  ('lo-loestrin-fe', 'pills', 'Lo Loestrin Fe', 'Allergan', 'combined', 'fourth', 
   '["Norethindrone Acetate", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "What two colors are the active pills?", "options": ["Blue and white", "Pink and yellow", "White and green", "Blue and yellow"], "correct": "Blue and white"},
     {"question": "How many blue pills are in the pack?", "options": ["24", "26", "21", "28"], "correct": "26"},
     {"question": "What do the brown pills contain?", "options": ["Iron (ferrous fumarate)", "Placebo", "Estrogen only", "Progestin only"], "correct": "Iron (ferrous fumarate)"}
   ]'::jsonb),
  
  ('ortho-tri-cyclen', 'pills', 'Ortho Tri-Cyclen', 'Janssen', 'combined', 'third', 
   '["Norgestimate", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "How many different colors of active pills are there?", "options": ["1", "2", "3", "4"], "correct": "3"},
     {"question": "What are the three colors of active pills?", "options": ["White, light blue, dark blue", "Pink, yellow, white", "Green, blue, purple", "Red, white, blue"], "correct": "White, light blue, dark blue"},
     {"question": "What is special about this pill pack design?", "options": ["Triphasic - hormone levels change", "All pills same dose", "No placebo week", "Only 21 pills"], "correct": "Triphasic - hormone levels change"}
   ]'::jsonb),
  
  ('microgestin', 'pills', 'Microgestin Fe', 'Lupin', 'combined', 'first', 
   '["Norethindrone Acetate", "Ethinyl Estradiol"]'::jsonb,
   '[
     {"question": "What color are the active pills?", "options": ["White", "Brown", "Green", "Pink"], "correct": "Brown"},
     {"question": "What color are the placebo/iron pills?", "options": ["Brown", "White", "Green", "Blue"], "correct": "White"},
     {"question": "How many days do you take active pills?", "options": ["21", "24", "26", "28"], "correct": "21"}
   ]'::jsonb);

-- Add some example IUD brands
INSERT INTO brands (id, method_id, name, manufacturer, type, generation, verification_questions) VALUES
  ('mirena', 'iud', 'Mirena', 'Bayer', 'hormonal', NULL,
   '[
     {"question": "How long does Mirena last?", "options": ["3 years", "5 years", "7 years", "10 years"], "correct": "7 years"},
     {"question": "What hormone does Mirena release?", "options": ["Estrogen", "Progesterone", "Levonorgestrel", "Testosterone"], "correct": "Levonorgestrel"},
     {"question": "What is the T-frame made of?", "options": ["Copper", "Plastic", "Metal", "Silicon"], "correct": "Plastic"}
   ]'::jsonb),
  
  ('paragard', 'iud', 'Paragard', 'CooperSurgical', 'copper', NULL,
   '[
     {"question": "How long can Paragard stay in place?", "options": ["5 years", "7 years", "10 years", "12 years"], "correct": "10 years"},
     {"question": "Does Paragard contain hormones?", "options": ["Yes", "No"], "correct": "No"},
     {"question": "What material provides the contraceptive effect?", "options": ["Plastic", "Copper", "Silver", "Gold"], "correct": "Copper"}
   ]'::jsonb);

-- ============================================================================
-- DONE! Your database is ready.
-- ============================================================================
