import { supabase } from '@/config/supabase'

export type AuthUser = {
  id: string
  email: string | null
}

export const authApi = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session || null
  },

  async getUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    const user = data.user
    if (!user) return null
    return { id: user.id, email: user.email ?? null }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null
      callback(user)
    })
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    })
    if (error) throw error
    return data
  },

  async sendMagicLink(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth` }
    })
    if (error) throw error
    return data
  }
}