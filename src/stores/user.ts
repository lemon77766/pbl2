import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户状态管理（无需登录版本）
export const useUserStore = defineStore('user', () => {
  // 本地存储的收藏列表
  const favorites = ref<Set<string>>(new Set())
  
  // 从本地存储加载收藏
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('poem_favorites')
      if (stored) {
        favorites.value = new Set(JSON.parse(stored))
      }
    } catch (error) {
      console.error('加载收藏失败:', error)
    }
  }
  
  // 保存收藏到本地存储
  const saveFavorites = () => {
    try {
      localStorage.setItem('poem_favorites', JSON.stringify([...favorites.value]))
    } catch (error) {
      console.error('保存收藏失败:', error)
    }
  }
  
  // 添加收藏
  const addFavorite = (poemId: string) => {
    favorites.value.add(poemId)
    saveFavorites()
  }
  
  // 移除收藏
  const removeFavorite = (poemId: string) => {
    favorites.value.delete(poemId)
    saveFavorites()
  }
  
  // 切换收藏状态
  const toggleFavorite = (poemId: string) => {
    if (favorites.value.has(poemId)) {
      removeFavorite(poemId)
    } else {
      addFavorite(poemId)
    }
  }
  
  // 检查是否已收藏
  const isFavorite = (poemId: string) => {
    return favorites.value.has(poemId)
  }
  
  // 获取收藏列表
  const getFavorites = () => {
    return [...favorites.value]
  }
  
  // 获取收藏数量
  const getFavoriteCount = () => {
    return favorites.value.size
  }
  
  // 清空收藏
  const clearFavorites = () => {
    favorites.value.clear()
    saveFavorites()
  }
  
  // 初始化时加载收藏
  loadFavorites()
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getFavoriteCount,
    clearFavorites
  }
})