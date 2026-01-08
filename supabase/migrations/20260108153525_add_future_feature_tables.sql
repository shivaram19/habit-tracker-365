/*
  # Add Future Feature Tables to ChromaLife Schema
  
  ## Overview
  This migration adds future-proofing tables while preserving the existing schema structure.
  
  ## Existing Structure (Preserved)
  - profiles (id = auth.users.id, no separate user_id column)
  - days (user_id -> profiles.id)
  - list_items (user_id -> profiles.id, day_id -> days.id)
  
  ## New Tables Added
  
  ### 1. categories
  - Structured category system with colors and icons
  - System categories (owner_id NULL) + user custom categories
  - Replaces the simple integer category field
  - Columns: id, owner_id (FK to profiles.id), name, color, icon, is_system, display_order
  
  ### 2. tags
  - Flexible tagging system for list items
  - Columns: id, user_id (FK to profiles.id), name, color, usage_count
  - Enables multi-dimensional categorization
  
  ### 3. list_item_tags
  - Junction table for many-to-many relationship
  - Links list_items to tags
  
  ### 4. budgets
  - Budget tracking per category or overall
  - Columns: id, user_id, category_id, amount, period, start_date, end_date, is_active
  - Supports daily, weekly, monthly, yearly, or custom periods
  
  ### 5. goals
  - Financial and lifestyle goal tracking
  - Columns: id, user_id, title, description, target_amount, current_amount, target_date, status
  - Track progress toward savings or spending goals
  
  ### 6. recurring_items
  - Templates for recurring expenses
  - Columns: id, user_id, category, name, amount, frequency, next_occurrence, is_active
  - Auto-suggestion for regular expenses
  
  ### 7. shared_days
  - Day sharing for collaborative tracking
  - Columns: id, day_id, shared_by, shared_with, permission_level
  - Enables couples/families to share spending logs
  
  ## Security
  - RLS enabled on all new tables
  - Users can only access their own data
  - Shared data controlled through shared_days permissions
  
  ## Benefits for Future
  - Analytics: Track spending by category, tags, or time period
  - Budgeting: Set and monitor budget limits
  - Goals: Motivate users with progress tracking
  - Recurring: Predict and auto-fill common expenses
  - Sharing: Enable collaborative expense tracking
  - Customization: Users can create custom categories and tags
*/

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#808080',
  icon text,
  is_system boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_owner_id ON categories(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Insert default system categories (available to all users)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE is_system = true LIMIT 1) THEN
    INSERT INTO categories (id, owner_id, name, color, is_system, display_order) VALUES
      (0, NULL, 'Uncategorized', '#808080', true, 0),
      (1, NULL, 'Food & Dining', '#FF6B6B', true, 1),
      (2, NULL, 'Transportation', '#4ECDC4', true, 2),
      (3, NULL, 'Shopping', '#45B7D1', true, 3),
      (4, NULL, 'Entertainment', '#96CEB4', true, 4),
      (5, NULL, 'Health & Fitness', '#FFEAA7', true, 5),
      (6, NULL, 'Bills & Utilities', '#DFE6E9', true, 6),
      (7, NULL, 'Education', '#A29BFE', true, 7),
      (8, NULL, 'Work', '#FD79A8', true, 8),
      (9, NULL, 'Social', '#FDCB6E', true, 9),
      (10, NULL, 'Travel', '#6C5CE7', true, 10),
      (11, NULL, 'Home', '#00B894', true, 11),
      (12, NULL, 'Personal Care', '#E17055', true, 12),
      (13, NULL, 'Gifts & Donations', '#74B9FF', true, 13),
      (14, NULL, 'Savings & Investments', '#55EFC4', true, 14);
  END IF;
END $$;

-- =====================================================
-- 2. TAGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#808080',
  usage_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

-- =====================================================
-- 3. LIST_ITEM_TAGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS list_item_tags (
  list_item_id uuid NOT NULL REFERENCES list_items(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (list_item_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_list_item_tags_item ON list_item_tags(list_item_id);
CREATE INDEX IF NOT EXISTS idx_list_item_tags_tag ON list_item_tags(tag_id);

-- =====================================================
-- 4. BUDGETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id int,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  period text NOT NULL DEFAULT 'monthly' CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
  start_date date NOT NULL,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_active ON budgets(user_id, is_active, start_date);

-- =====================================================
-- 5. GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_amount numeric(10, 2) CHECK (target_amount > 0),
  current_amount numeric(10, 2) DEFAULT 0 CHECK (current_amount >= 0),
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date) WHERE status = 'active';

-- =====================================================
-- 6. RECURRING_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS recurring_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category int NOT NULL DEFAULT 0 CHECK (category >= 0),
  name text NOT NULL,
  amount numeric(10, 2) DEFAULT 0 CHECK (amount >= 0),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
  next_occurrence date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recurring_items_user_id ON recurring_items(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_items_next ON recurring_items(user_id, next_occurrence) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_recurring_items_active ON recurring_items(is_active, next_occurrence);

-- =====================================================
-- 7. SHARED_DAYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS shared_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  shared_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shared_with uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_level text DEFAULT 'view' CHECK (permission_level IN ('view', 'comment', 'edit')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(day_id, shared_with),
  CHECK (shared_by != shared_with)
);

CREATE INDEX IF NOT EXISTS idx_shared_days_day_id ON shared_days(day_id);
CREATE INDEX IF NOT EXISTS idx_shared_days_shared_with ON shared_days(shared_with);
CREATE INDEX IF NOT EXISTS idx_shared_days_shared_by ON shared_days(shared_by);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_days ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view all categories" ON categories FOR SELECT TO authenticated
  USING (owner_id IS NULL OR auth.uid() = owner_id);

CREATE POLICY "Users can insert own categories" ON categories FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own categories" ON categories FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own categories" ON categories FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

-- Tags policies
CREATE POLICY "Users can view own tags" ON tags FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON tags FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- List item tags policies
CREATE POLICY "Users can view own item tags" ON list_item_tags FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM list_items 
    WHERE list_items.id = list_item_tags.list_item_id 
    AND list_items.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own item tags" ON list_item_tags FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM list_items 
    WHERE list_items.id = list_item_tags.list_item_id 
    AND list_items.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own item tags" ON list_item_tags FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM list_items 
    WHERE list_items.id = list_item_tags.list_item_id 
    AND list_items.user_id = auth.uid()
  ));

-- Budgets policies
CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON goals FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Recurring items policies
CREATE POLICY "Users can view own recurring items" ON recurring_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recurring items" ON recurring_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring items" ON recurring_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring items" ON recurring_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Shared days policies
CREATE POLICY "Users can view own shares" ON shared_days FOR SELECT TO authenticated
  USING (auth.uid() = shared_by OR auth.uid() = shared_with);

CREATE POLICY "Users can share own days" ON shared_days FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = shared_by
    AND EXISTS (
      SELECT 1 FROM days 
      WHERE days.id = shared_days.day_id 
      AND days.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own shares" ON shared_days FOR UPDATE TO authenticated
  USING (auth.uid() = shared_by)
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete own shares" ON shared_days FOR DELETE TO authenticated
  USING (auth.uid() = shared_by);

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_budgets_updated_at 
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_items_updated_at 
  BEFORE UPDATE ON recurring_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags 
    SET usage_count = GREATEST(usage_count - 1, 0) 
    WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_on_item_tag_change
  AFTER INSERT OR DELETE ON list_item_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();