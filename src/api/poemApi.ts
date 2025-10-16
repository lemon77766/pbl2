import { supabase, TABLES, type Database } from '@/config/supabase'

// 诗词相关API
export const poemApi = {
  // 高级搜索诗词
  async searchPoems(keyword: string, options: {
    dynasty?: string
    author?: string
    limit?: number
    offset?: number
  } = {}) {
    try {
      const { dynasty, author, limit = 20, offset = 0 } = options
      
      // 使用存储过程进行高级搜索
      const { data, error } = await supabase.rpc('search_poems_advanced', {
        search_term: keyword,
        dynasty_filter: dynasty || null,
        author_filter: author || null,
        limit_count: limit,
        offset_count: offset
      })

      if (error) throw error

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author_name || '未知作者',
        content: item.content,
        dynasty: item.dynasty,
        translation: item.translation,
        background: item.background,
        relevance: item.relevance,
        matchType: item.match_type
      }))
    } catch (error) {
      console.error('搜索诗词失败:', error)
      throw error
    }
  },

  // 快速搜索（简单关键词匹配）
  async quickSearch(keyword: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.POEMS)
        .select(`
          id,
          title,
          content,
          dynasty,
          poem_authors!inner(name)
        `)
        .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%,poem_authors.name.ilike.%${keyword}%`)
        .limit(limit)

      if (error) throw error

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.poem_authors?.name || '未知作者',
        content: item.content,
        dynasty: item.dynasty,
        excerpt: item.content.split('\n')[0] + '...'
      }))
    } catch (error) {
      console.error('快速搜索失败:', error)
      throw error
    }
  },

  // 获取随机推荐诗词
  async getRandomPoems(limit: number = 6) {
    try {
      const { data, error } = await supabase.rpc('get_random_poems', {
        limit_count: limit
      })

      if (error) throw error

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author_name || '未知作者',
        content: item.content,
        dynasty: item.dynasty,
        excerpt: item.excerpt
      }))
    } catch (error) {
      console.error('获取随机诗词失败:', error)
      throw error
    }
  },

  // 获取热门作者
  async getPopularAuthors(limit: number = 10) {
    try {
      const { data, error } = await supabase.rpc('get_popular_authors', {
        limit_count: limit
      })

      if (error) throw error

      return data.map((item: any) => ({
        id: item.author_id,
        name: item.author_name,
        dynasty: item.dynasty,
        poemCount: item.poem_count,
        totalPoems: item.total_poems
      }))
    } catch (error) {
      console.error('获取热门作者失败:', error)
      throw error
    }
  },

  // 获取朝代统计
  async getDynastyStats() {
    try {
      const { data, error } = await supabase.rpc('get_dynasty_stats')

      if (error) throw error

      return data.map((item: any) => ({
        dynasty: item.dynasty,
        poemCount: item.poem_count,
        authorCount: item.author_count
      }))
    } catch (error) {
      console.error('获取朝代统计失败:', error)
      throw error
    }
  },

  // 获取诗词详情（增强版）
  async getPoemDetail(poemId: string) {
    try {
      const { data: poemData, error: poemError } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          poem_authors!inner(*),
          poem_analysis(*),
          poem_keywords(*)
        `)
        .eq('id', poemId)
        .single()

      if (poemError) throw poemError

      return {
        ...poemData,
        author: poemData.poem_authors,
        analysis: poemData.poem_analysis?.[0] || null,
        keywords: poemData.poem_keywords || []
      }
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      throw error
    }
  }
}

// 用户相关API
export const userApi = {
  // 获取用户收藏
  async getUserFavorites(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_FAVORITES)
        .select(`
          id,
          created_at,
          poems!inner(
            id,
            title,
            content,
            poem_authors!inner(name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((item: any) => ({
        id: item.poems.id,
        title: item.poems.title,
        author: item.poems.poem_authors?.name || '未知作者',
        excerpt: item.poems.content.split('\n')[0] + '...',
        addedAt: item.created_at
      }))
    } catch (error) {
      console.error('获取用户收藏失败:', error)
      throw error
    }
  },

  // 添加收藏
  async addFavorite(userId: string, poemId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_FAVORITES)
        .insert({
          user_id: userId,
          poem_id: poemId
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  },

  // 移除收藏
  async removeFavorite(favoriteId: string) {
    try {
      const { error } = await supabase
        .from(TABLES.USER_FAVORITES)
        .delete()
        .eq('id', favoriteId)

      if (error) throw error
    } catch (error) {
      console.error('移除收藏失败:', error)
      throw error
    }
  },

  // 检查是否已收藏
  async checkFavorite(userId: string, poemId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('poem_id', poemId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !!data
    } catch (error) {
      console.error('检查收藏状态失败:', error)
      throw error
    }
  },

  // 通过用户ID和诗词ID获取收藏记录
  async getFavoriteByUserAndPoem(userId: string, poemId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('poem_id', poemId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (error) {
      console.error('获取收藏记录失败:', error)
      throw error
    }
  }
}

// 导出类型
export type Poem = Database['public']['Tables']['poems']['Row'] & {
  poem_authors?: Database['public']['Tables']['poem_authors']['Row']
  analysis?: Database['public']['Tables']['poem_analysis']['Row']
  keywords?: Database['public']['Tables']['poem_keywords']['Row'][]
}

export type PoemAnalysis = Database['public']['Tables']['poem_analysis']['Row']

export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'] & {
  poems?: Poem
}

export type Author = Database['public']['Tables']['poem_authors']['Row'] & {
  poemCount?: number
}

export type DynastyStats = {
  dynasty: string
  poemCount: number
  authorCount: number
}