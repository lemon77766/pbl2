-- 创建诗词作者表
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    biography TEXT,
    dynasty VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id UUID NOT NULL REFERENCES poem_authors(id) ON DELETE CASCADE,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    background TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗词赏析表
CREATE TABLE IF NOT EXISTS poem_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    analysis_content TEXT NOT NULL,
    artistic_features TEXT,
    line_analysis JSONB,
    overall_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建关键词表
CREATE TABLE IF NOT EXISTS poem_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    explanation TEXT NOT NULL,
    origin VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, poem_id)
);

-- 创建用户笔记表
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    note_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_dynasty ON authors(dynasty);
CREATE INDEX IF NOT EXISTS idx_poem_analysis_poem_id ON poem_analysis(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_keywords_poem_id ON poem_keywords(poem_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_poem_id ON user_favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_poem_id ON user_notes(poem_id);

-- 启用行级安全策略
ALTER TABLE poem_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- 创建诗词全文搜索索引
CREATE INDEX IF NOT EXISTS idx_poems_content_search ON poems USING gin(to_tsvector('chinese', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_authors_search ON authors USING gin(to_tsvector('chinese', name || ' ' || biography));

-- 创建行级安全策略
-- 诗词相关表允许公开读取
CREATE POLICY "允许公开读取诗词" ON poems FOR SELECT USING (true);
CREATE POLICY "允许公开读取作者" ON authors FOR SELECT USING (true);
CREATE POLICY "允许公开读取赏析" ON poem_analysis FOR SELECT USING (true);
CREATE POLICY "允许公开读取关键词" ON poem_keywords FOR SELECT USING (true);

-- 用户相关表只允许用户访问自己的数据
CREATE POLICY "用户只能访问自己的收藏" ON user_favorites 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "用户只能访问自己的笔记" ON user_notes 
    FOR ALL USING (auth.uid() = user_id);

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poem_analysis_updated_at BEFORE UPDATE ON poem_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();