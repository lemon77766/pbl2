-- 插入示例作者数据
INSERT INTO poem_authors (name, biography, dynasty) VALUES
('李白', '李白（701年－762年），字太白，号青莲居士，又号"谪仙人"，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。', '唐代'),
('杜甫', '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，与李白合称"李杜"。', '唐代'),
('王维', '王维（701年－761年），字摩诘，号摩诘居士，唐代著名诗人、画家，有"诗佛"之称。', '唐代'),
('孟浩然', '孟浩然（689年－740年），唐代著名的山水田园派诗人，与王维并称"王孟"。', '唐代'),
('苏轼', '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋著名文学家、书法家、画家。', '宋代'),
('李清照', '李清照（1084年－1155年），号易安居士，宋代著名女词人，婉约派代表。', '宋代');

-- 插入示例诗词数据
INSERT INTO poems (title, author_id, dynasty, content, translation, background) VALUES
(
    '静夜思',
    (SELECT id FROM poem_authors WHERE name = '李白'),
    '唐代',
    '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
    '这首诗写于唐玄宗开元十四年（726年）九月十五日的扬州旅舍。当时李白26岁，在一个月明星稀的夜晚，诗人抬望天空一轮皓月，思乡之情油然而生。'
),
(
    '春晓',
    (SELECT id FROM poem_authors WHERE name = '孟浩然'),
    '唐代',
    '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    '春夜酣睡天亮了也不知道，醒来只听到到处有鸟儿啼叫。想起昨夜里风声紧雨声潇潇，花儿不知道被打落了多少？',
    '这首诗是唐代诗人孟浩然隐居在鹿门山时所作，意境十分优美。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。'
),
(
    '相思',
    (SELECT id FROM poem_authors WHERE name = '王维'),
    '唐代',
    '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。',
    '红豆生长在阳光明媚的南方，每逢春天不知长多少新枝。希望思念的人儿多多采摘，因为它最能寄托相思之情。',
    '这是借咏物而寄相思的诗，是眷怀友人之作。起句因物起兴，语虽单纯，却富于想象；接着以设问寄语，意味深长地寄托情思；第三句暗示珍重友谊，表面似乎嘱人相思，背面却深寓自身相思之重；最后一语双关，既切中题意，又关合情思，妙笔生花，婉曲动人。'
),
(
    '水调歌头·明月几时有',
    (SELECT id FROM poem_authors WHERE name = '苏轼'),
    '宋代',
    '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。',
    '明月从什么时候才开始出现的？我端起酒杯遥问苍天。不知道在天上的宫殿，今天晚上是何年何月。我想要乘御清风回到天上，又恐怕在美玉砌成的楼宇，受不住高耸九天的寒冷。翩翩起舞玩赏着月下清影，哪像是在人间？',
    '这首词是宋神宗熙宁九年（1076年）中秋作者在密州时所作。词前的小序交待了写词的过程："丙辰中秋，欢饮达旦，大醉。作此篇，兼怀子由。"苏轼因为与当权的变法者王安石等人政见不同，自求外放，辗转在各地为官。他曾经要求调任到离苏辙较近的地方为官，以求兄弟多多聚会。'
);

-- 插入诗词赏析数据
INSERT INTO poem_analysis (poem_id, analysis_content, artistic_features, line_analysis, overall_analysis) VALUES
(
    (SELECT id FROM poems WHERE title = '静夜思'),
    '《静夜思》是唐代诗人李白所作的一首五言古诗。此诗描写了秋日夜晚，旅居在外的诗人于屋内抬头望月而思念家乡的感受。',
    '语言朴素自然，明白如话；运用比喻和对比等修辞手法；意境清冷寂静。',
    '[
        {"text": "床前明月光", "explanation": "描写月光照射在床前的景象，营造出宁静的夜晚氛围。"},
        {"text": "疑是地上霜", "explanation": "运用比喻手法，将月光比作霜，既写出了月光的皎洁，又表达了秋夜的寒意。"},
        {"text": "举头望明月", "explanation": "动作描写，表现诗人仰望明月时的专注和思乡之情。"},
        {"text": "低头思故乡", "explanation": "直接抒发情感，点明主题，表达对故乡的深切思念。"}
    ]',
    '全诗运用比喻、衬托等手法，表达客居思乡之情，语言清新朴素而韵味含蓄无穷，历来广为传诵。'
),
(
    (SELECT id FROM poems WHERE title = '春晓'),
    '《春晓》是唐代诗人孟浩然隐居在鹿门山时所作的一首五言绝句。',
    '语言平易浅近，自然天成；构思巧妙，立意新颖；意境优美，韵味悠长。',
    '[
        {"text": "春眠不觉晓", "explanation": "写春睡的香甜，流露出诗人爱春的喜悦心情。"},
        {"text": "处处闻啼鸟", "explanation": "写悦耳的春声，交代了醒来的原因。"},
        {"text": "夜来风雨声", "explanation": "回忆昨夜的潇潇春雨。"},
        {"text": "花落知多少", "explanation": "又回到眼前，联想到春花被风吹雨打、落红遍地的景象。"}
    ]',
    '诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。'
);

-- 插入关键词数据
INSERT INTO poem_keywords (poem_id, word, explanation, origin) VALUES
(
    (SELECT id FROM poems WHERE title = '静夜思'),
    '明月光',
    '明亮的月光，象征着纯洁和思乡之情',
    '古代诗词中常用的意象'
),
(
    (SELECT id FROM poems WHERE title = '静夜思'),
    '地上霜',
    '比喻月光洁白如霜，既写实又富有诗意',
    '比喻修辞手法'
),
(
    (SELECT id FROM poems WHERE title = '春晓'),
    '春眠',
    '春天的睡眠，形容春睡的香甜',
    '自然意象'
),
(
    (SELECT id FROM poems WHERE title = '春晓'),
    '啼鸟',
    '啼叫的鸟儿，表现春天的生机勃勃',
    '自然意象'
);

-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_poems(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    author_name VARCHAR,
    dynasty VARCHAR,
    content TEXT,
    translation TEXT,
    background TEXT,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        pa.name as author_name,
        p.dynasty,
        p.content,
        p.translation,
        p.background,
        ts_rank(
            to_tsvector('chinese', p.title || ' ' || p.content || ' ' || pa.name),
            plainto_tsquery('chinese', search_term)
        ) as relevance
    FROM poems p
    JOIN poem_authors pa ON p.author_id = pa.id
    WHERE 
        to_tsvector('chinese', p.title || ' ' || p.content || ' ' || pa.name) 
        @@ plainto_tsquery('chinese', search_term)
    ORDER BY relevance DESC;
END;
$$ LANGUAGE plpgsql;