import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/config/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // 初始化用户状态
  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    // 监听认证状态变化
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  // 用户登录
  const signIn = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } finally {
      isLoading.value = false
    }
  }

  // 用户注册
  const signUp = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return data
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const signOut = async () => {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } finally {
      isLoading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } finally {
      isLoading.value = false
    }
  }

  // 更新密码
  const updatePassword = async (newPassword: string) => {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    initAuth,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }
})