<template>
  <div class="auth-page">
    <h1>账号登录 / 注册</h1>
    <div class="tabs">
      <button :class="{active: mode==='login'}" @click="mode='login'">登录</button>
      <button :class="{active: mode==='signup'}" @click="mode='signup'">注册</button>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <label>
        邮箱
        <input v-model="email" type="email" required placeholder="you@example.com" />
      </label>
      <label>
        密码
        <input v-model="password" type="password" required minlength="6" placeholder="至少6位密码" />
      </label>

      <button type="submit" :disabled="auth.loading">
        {{ mode === 'login' ? '登录' : '注册' }}
      </button>

      <div v-if="mode==='login'" class="aux">
        <button type="button" class="link" @click="resetPwd" :disabled="auth.loading">忘记密码？发送重置邮件</button>
        <button type="button" class="link" @click="sendLink" :disabled="auth.loading">收取邮箱登录链接</button>
      </div>

      <p v-if="auth.errorMsg" class="error">{{ auth.errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>

    <div v-if="auth.user" class="status">
      <p>已登录：{{ auth.user.email || auth.user.id }}</p>
      <button @click="logout" :disabled="auth.loading">退出登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/authApi'

const auth = useAuthStore()
const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const successMsg = ref('')

onMounted(() => {
  auth.initAuth()
})

const handleSubmit = async () => {
  successMsg.value = ''
  const emailNorm = email.value.trim().toLowerCase()
  const passwordNorm = password.value.trim()
  if (!emailNorm || !passwordNorm) {
    auth.errorMsg = '请填写完整的邮箱与密码'
    return
  }
  try {
    if (mode.value === 'login') {
      await auth.signIn(emailNorm, passwordNorm)
      successMsg.value = '登录成功'
    } else {
      await auth.signUp(emailNorm, passwordNorm)
      successMsg.value = '注册成功，请查收确认邮件后再登录（如启用邮件确认）'
    }
  } catch {
    // 错误已在 store 中处理
  }
}

const logout = async () => {
  successMsg.value = ''
  try {
    await auth.signOut()
    successMsg.value = '已退出登录'
  } catch {
    // 错误已在 store 中处理
  }
}

const resetPwd = async () => {
  successMsg.value = ''
  try {
    const emailNorm = email.value.trim().toLowerCase()
    if (!emailNorm) {
      auth.errorMsg = '请先填写注册邮箱'
      return
    }
    await authApi.resetPassword(emailNorm)
    successMsg.value = '重置邮件已发送，请查收邮箱并按提示重设密码'
  } catch (e: any) {
    auth.errorMsg = e?.message || '发送密码重置邮件失败'
  }
}

const sendLink = async () => {
  successMsg.value = ''
  try {
    const emailNorm = email.value.trim().toLowerCase()
    if (!emailNorm) {
      auth.errorMsg = '请先填写注册邮箱'
      return
    }
    await authApi.sendMagicLink(emailNorm)
    successMsg.value = '登录链接已发送，请在邮箱点击链接完成登录'
  } catch (e: any) {
    auth.errorMsg = e?.message || '发送登录链接失败'
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
}
h1 {
  margin: 0 0 16px;
  font-size: 20px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tabs button {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  background: #F9F4E6; /* 柔和米色，接近全局背景 */
  border-radius: 8px;
  cursor: pointer;
}
.tabs button.active {
  background: #EADFC7; /* 与导航激活态一致 */
  color: var(--text-color);
  border-color: #D3C5A3;
}
.auth-form {
  display: grid;
  gap: 12px;
}
.aux {
  display: flex;
  justify-content: flex-end;
}
.link {
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}
.link:hover { color: var(--secondary-color); }
label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}
input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
button[type="submit"] {
  padding: 10px 12px;
  border: 1px solid #E8DEC5;
  background: #F9F4E6; /* 与背景相近的米色 */
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
}
button[type="submit"]:hover {
  background: #F6EBD2;
  border-color: #E8DEC5;
}
.error { color: #ef4444; }
.success { color: #10b981; }
.status {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.status button {
  padding: 10px 12px;
  border: 1px solid #E8DEC5;
  background: #F9F4E6;
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
}
.status button:hover {
  background: #F6EBD2;
}
</style>