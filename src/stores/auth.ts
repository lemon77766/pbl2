import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 使用本地生成的用户ID，无需登录
  const userId = ref<string>(generateUserId())

  // 生成唯一的用户ID
  function generateUserId(): string {
    // 从localStorage获取或生成新的用户ID
    const storedId = localStorage.getItem('poem_app_user_id')
    if (storedId) {
      return storedId
    }
    
    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('poem_app_user_id', newId)
    return newId
  }

  // 获取当前用户ID
  const getUserId = () => userId.value

  return {
    userId,
    getUserId
  }
})