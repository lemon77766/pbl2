import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type AuthUser } from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref<boolean>(false)
  const errorMsg = ref<string | null>(null)

  const initAuth = async () => {
    loading.value = true
    try {
      const current = await authApi.getUser()
      user.value = current
      // 监听会话变化
      authApi.onAuthStateChange((u) => {
        user.value = u
      })
    } catch (err: any) {
      console.error('初始化鉴权失败:', err)
      errorMsg.value = err?.message || '鉴权初始化失败'
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    errorMsg.value = null
    try {
      await authApi.signUp(email, password)
      // Supabase 邮件确认后才能登录（如果项目启用了 email confirm）
    } catch (err: any) {
      errorMsg.value = err?.message || '注册失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    errorMsg.value = null
    try {
      await authApi.signIn(email, password)
      const current = await authApi.getUser()
      user.value = current
    } catch (err: any) {
      errorMsg.value = err?.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    errorMsg.value = null
    try {
      await authApi.signOut()
      user.value = null
    } catch (err: any) {
      errorMsg.value = err?.message || '退出失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserId = () => user.value?.id || ''

  return {
    user,
    loading,
    errorMsg,
    initAuth,
    signUp,
    signIn,
    signOut,
    getUserId
  }
})