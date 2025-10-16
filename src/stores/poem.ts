import { defineStore } from 'pinia'
import { ref } from 'vue'
import { poemApi, userApi } from '@/api/poemApi'
import type { Poem, PoemAnalysis, UserFavorite, Author, DynastyStats } from '@/api/poemApi'

export const usePoemStore = defineStore('poem', () => {
  const popularPoems = ref<Poem[]>([])
  const searchResults = ref<Poem[]>([])
  const currentPoem = ref<Poem | null>(null)
  const poemAnalysis = ref<PoemAnalysis | null>(null)
  const userFavorites = ref<UserFavorite[]>([])
  const popularAuthors = ref<Author[]>([])
  const dynastyStats = ref<DynastyStats[]>([])
  const isLoading = ref(false)
  const searchOptions = ref({
    keyword: '',
    dynasty: '',
    author: '',
    limit: 20,
    offset: 0
  })

  // 获取随机推荐诗词
  const fetchRandomPoems = async (limit: number = 6) => {
    isLoading.value = true
    try {
      popularPoems.value = await poemApi.getRandomPoems(limit)
    } catch (error) {
      console.error('获取随机诗词失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 高级搜索诗词
  const searchPoems = async (keyword: string, options: {
    dynasty?: string
    author?: string
    limit?: number
    offset?: number
  } = {}) => {
    isLoading.value = true
    try {
      searchOptions.value = { keyword, ...options }
      searchResults.value = await poemApi.searchPoems(keyword, options)
    } catch (error) {
      console.error('搜索诗词失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 快速搜索
  const quickSearch = async (keyword: string, limit: number = 10) => {
    isLoading.value = true
    try {
      searchResults.value = await poemApi.quickSearch(keyword, limit)
    } catch (error) {
      console.error('快速搜索失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取诗词详情
  const fetchPoemDetail = async (poemId: string) => {
    isLoading.value = true
    try {
      const data = await poemApi.getPoemDetail(poemId)
      currentPoem.value = data
      poemAnalysis.value = data.analysis || null
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取热门作者
  const fetchPopularAuthors = async (limit: number = 10) => {
    isLoading.value = true
    try {
      popularAuthors.value = await poemApi.getPopularAuthors(limit)
    } catch (error) {
      console.error('获取热门作者失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取朝代统计
  const fetchDynastyStats = async () => {
    isLoading.value = true
    try {
      dynastyStats.value = await poemApi.getDynastyStats()
    } catch (error) {
      console.error('获取朝代统计失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户收藏
  const fetchUserFavorites = async (userId: string) => {
    isLoading.value = true
    try {
      const favorites = await userApi.getUserFavorites(userId)
      // 转换类型以匹配 UserFavorite
      userFavorites.value = favorites.map(fav => ({
        id: fav.id,
        user_id: userId,
        poem_id: fav.id,
        created_at: fav.addedAt,
        poems: {
          id: fav.id,
          title: fav.title,
          content: fav.excerpt.replace('...', ''),
          dynasty: '',
          author_id: '',
          created_at: '',
          updated_at: '',
          poem_authors: {
            name: fav.author
          }
        }
      })) as UserFavorite[]
    } catch (error) {
      console.error('获取用户收藏失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 添加收藏
  const addFavorite = async (userId: string, poemId: string) => {
    try {
      await userApi.addFavorite(userId, poemId)
      // 重新获取收藏列表
      await fetchUserFavorites(userId)
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  }

  // 移除收藏
  const removeFavorite = async (favoriteId: string, userId: string) => {
    try {
      await userApi.removeFavorite(favoriteId)
      // 重新获取收藏列表
      await fetchUserFavorites(userId)
    } catch (error) {
      console.error('移除收藏失败:', error)
      throw error
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (userId: string, poemId: string) => {
    try {
      const existingFavorite = await userApi.getFavoriteByUserAndPoem(userId, poemId)
      
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id, userId)
        return false // 已取消收藏
      } else {
        await addFavorite(userId, poemId)
        return true // 已添加收藏
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      throw error
    }
  }

  // 检查是否已收藏
  const checkFavorite = async (userId: string, poemId: string) => {
    try {
      return await userApi.checkFavorite(userId, poemId)
    } catch (error) {
      console.error('检查收藏状态失败:', error)
      throw error
    }
  }

  // 清空搜索结果
  const clearSearchResults = () => {
    searchResults.value = []
    searchOptions.value = {
      keyword: '',
      dynasty: '',
      author: '',
      limit: 20,
      offset: 0
    }
  }

  // 清空当前诗词
  const clearCurrentPoem = () => {
    currentPoem.value = null
    poemAnalysis.value = null
  }

  return {
    // 状态
    popularPoems,
    searchResults,
    currentPoem,
    poemAnalysis,
    userFavorites,
    popularAuthors,
    dynastyStats,
    isLoading,
    searchOptions,
    
    // 方法
    fetchRandomPoems,
    searchPoems,
    quickSearch,
    fetchPoemDetail,
    fetchPopularAuthors,
    fetchDynastyStats,
    fetchUserFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkFavorite,
    clearSearchResults,
    clearCurrentPoem
  }
})