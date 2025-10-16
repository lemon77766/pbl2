import { defineStore } from 'pinia'
import { ref } from 'vue'
import { poemApi, userApi } from '@/api/poemApi'
import type { Poem, PoemAnalysis, UserFavorite } from '@/api/poemApi'

export const usePoemStore = defineStore('poem', () => {
  const popularPoems = ref<Poem[]>([])
  const searchResults = ref<Poem[]>([])
  const currentPoem = ref<Poem | null>(null)
  const poemAnalysis = ref<PoemAnalysis | null>(null)
  const userFavorites = ref<UserFavorite[]>([])
  const isLoading = ref(false)

  // 获取热门诗词
  const fetchPopularPoems = async (limit: number = 6) => {
    isLoading.value = true
    try {
      popularPoems.value = await poemApi.getPopularPoems(limit)
    } catch (error) {
      console.error('获取热门诗词失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 搜索诗词
  const searchPoems = async (keyword: string, limit: number = 10) => {
    isLoading.value = true
    try {
      searchResults.value = await poemApi.searchPoems(keyword, limit)
    } catch (error) {
      console.error('搜索诗词失败:', error)
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
      poemAnalysis.value = data.analysis
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户收藏
  const fetchUserFavorites = async (userId: string) => {
    isLoading.value = true
    try {
      userFavorites.value = await userApi.getUserFavorites(userId)
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
  }

  return {
    popularPoems,
    searchResults,
    currentPoem,
    poemAnalysis,
    userFavorites,
    isLoading,
    fetchPopularPoems,
    searchPoems,
    fetchPoemDetail,
    fetchUserFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    clearSearchResults
  }
})