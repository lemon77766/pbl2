import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量配置')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 数据库表名常量
export const TABLES = {
  POEMS: 'poems',
  AUTHORS: 'poem_authors',
  POEM_ANALYSIS: 'poem_analysis',
  POEM_KEYWORDS: 'poem_keywords',
  USER_FAVORITES: 'user_favorites',
  USER_NOTES: 'user_notes'
} as const

// 导出类型定义
export type Database = {
  public: {
    Tables: {
      poems: {
        Row: {
          id: string
          title: string
          author_id: string
          dynasty: string
          content: string
          translation?: string
          background?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['poems']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['poems']['Insert']>
      }
      authors: {
        Row: {
          id: string
          name: string
          biography?: string
          dynasty: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['authors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['authors']['Insert']>
      }
      poem_analysis: {
        Row: {
          id: string
          poem_id: string
          analysis_content: string
          artistic_features?: string
          line_analysis?: any
          overall_analysis?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['poem_analysis']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['poem_analysis']['Insert']>
      }
      poem_keywords: {
        Row: {
          id: string
          poem_id: string
          word: string
          explanation: string
          origin?: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['poem_keywords']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['poem_keywords']['Insert']>
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          poem_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_favorites']['Insert']>
      }
      user_notes: {
        Row: {
          id: string
          user_id: string
          poem_id: string
          note_content: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_notes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_notes']['Insert']>
      }
    }
  }
}