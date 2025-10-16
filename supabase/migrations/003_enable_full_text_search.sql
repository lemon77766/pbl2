-- 启用中文全文搜索支持
-- 首先需要安装中文分词扩展（如果尚未安装）
-- CREATE EXTENSION IF NOT EXISTS zhparser;

-- 创建中文分词配置
-- CREATE TEXT SEARCH CONFIGURATION chinese (PARSER = zhparser);
-- ALTER TEXT SEARCH CONFIGURATION chinese ADD MAPPING FOR n,v,a,i,e,l WITH simple;

-- 创建诗词全文搜索函数（优化版）
CREATE OR REPLACE FUNCTION search_poems_advanced(
    search_term TEXT,
    dynasty_filter TEXT DEFAULT NULL,
    author_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    author_name VARCHAR,
    dynasty VARCHAR,
    content TEXT,
    translation TEXT,
    background TEXT,
    relevance REAL,
    match_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH search_results AS (
        -- 标题匹配（最高优先级）
        SELECT 
            p.id,
            p.title,
            pa.name as author_name,
            p.dynasty,
            p.content,
            p.translation,
            p.background,
            1.0 as relevance,
            'title' as match_type
        FROM poems p
        JOIN poem_authors pa ON p.author_id = pa.id
        WHERE p.title ILIKE '%' || search_term || '%'
        
        UNION ALL
        
        -- 作者匹配（中等优先级）
        SELECT 
            p.id,
            p.title,
            pa.name as author_name,
            p.dynasty,
            p.content,
            p.translation,
            p.background,
            0.8 as relevance,
            'author' as match_type
        FROM poems p
        JOIN poem_authors pa ON p.author_id = pa.id
        WHERE pa.name ILIKE '%' || search_term || '%'
        
        UNION ALL
        
        -- 内容匹配（较低优先级）
        SELECT 
            p.id,
            p.title,
            pa.name as author_name,
            p.dynasty,
            p.content,
            p.translation,
            p.background,
            0.6 as relevance,
            'content' as match_type
        FROM poems p
        JOIN poem_authors pa ON p.author_id = pa.id
        WHERE p.content ILIKE '%' || search_term || '%'
    )
    SELECT 
        sr.id,
        sr.title,
        sr.author_name,
        sr.dynasty,
        sr.content,
        sr.translation,
        sr.background,
        sr.relevance,
        sr.match_type
    FROM search_results sr
    WHERE 
        (dynasty_filter IS NULL OR sr.dynasty = dynasty_filter)
        AND (author_filter IS NULL OR sr.author_name ILIKE '%' || author_filter || '%')
    ORDER BY 
        relevance DESC,
        CASE match_type 
            WHEN 'title' THEN 1
            WHEN 'author' THEN 2
            WHEN 'content' THEN 3
            ELSE 4
        END,
        sr.title
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 创建获取热门作者的函数
CREATE OR REPLACE FUNCTION get_popular_authors(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    author_id UUID,
    author_name VARCHAR,
    dynasty VARCHAR,
    poem_count BIGINT,
    total_poems BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.id as author_id,
        pa.name as author_name,
        pa.dynasty,
        COUNT(p.id) as poem_count,
        (SELECT COUNT(*) FROM poems) as total_poems
    FROM poem_authors pa
    LEFT JOIN poems p ON pa.id = p.author_id
    GROUP BY pa.id, pa.name, pa.dynasty
    ORDER BY poem_count DESC, pa.name
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 创建获取朝代统计的函数
CREATE OR REPLACE FUNCTION get_dynasty_stats()
RETURNS TABLE (
    dynasty VARCHAR,
    poem_count BIGINT,
    author_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.dynasty,
        COUNT(p.id) as poem_count,
        COUNT(DISTINCT p.author_id) as author_count
    FROM poems p
    GROUP BY p.dynasty
    ORDER BY poem_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 创建获取随机推荐诗词的函数
CREATE OR REPLACE FUNCTION get_random_poems(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    author_name VARCHAR,
    dynasty VARCHAR,
    content TEXT,
    excerpt TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        pa.name as author_name,
        p.dynasty,
        p.content,
        SUBSTRING(p.content FROM 1 FOR 50) || '...' as excerpt
    FROM poems p
    JOIN poem_authors pa ON p.author_id = pa.id
    ORDER BY RANDOM()
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 创建索引以优化搜索性能
CREATE INDEX IF NOT EXISTS idx_poems_title_lower ON poems(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_poems_content_lower ON poems(LOWER(content));
CREATE INDEX IF NOT EXISTS idx_poem_authors_name_lower ON poem_authors(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_lower ON poems(LOWER(dynasty));

-- 创建复合索引以提高联合查询性能
CREATE INDEX IF NOT EXISTS idx_poems_author_dynasty ON poems(author_id, dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_author ON poems(dynasty, author_id);

-- 注释：这些函数和索引将显著提高搜索性能
COMMENT ON FUNCTION search_poems_advanced IS '高级诗词搜索函数，支持朝代和作者过滤';
COMMENT ON FUNCTION get_popular_authors IS '获取热门作者统计';
COMMENT ON FUNCTION get_dynasty_stats IS '获取朝代统计信息';
COMMENT ON FUNCTION get_random_poems IS '获取随机推荐诗词';