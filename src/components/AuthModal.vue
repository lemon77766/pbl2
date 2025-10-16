<template>
  <el-dialog
    v-model="visible"
    :title="isLogin ? '登录' : '注册'"
    width="400px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="auth-form"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
          size="large"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          size="large"
          show-password
        />
      </el-form-item>
      
      <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          size="large"
          show-password
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="isLoading"
          size="large"
        >
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
      </div>
      
      <div class="auth-switch">
        <span>{{ isLogin ? '没有账号？' : '已有账号？' }}</span>
        <el-link type="primary" @click="toggleMode">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </el-link>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

interface AuthModalProps {
  modelValue: boolean
  mode?: 'login' | 'register'
}

const props = withDefaults(defineProps<AuthModalProps>(), {
  mode: 'login'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const authStore = useAuthStore()
const formRef = ref()
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const isLogin = computed(() => props.mode === 'login')

const rules = computed(() => ({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: isLogin.value ? [] : [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const toggleMode = () => {
  const newMode = isLogin.value ? 'register' : 'login'
  emit('update:modelValue', true)
  // 这里可以通过其他方式切换模式，或者使用新的prop
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    isLoading.value = true
    
    if (isLogin.value) {
      await authStore.signIn(form.email, form.password)
      ElMessage.success('登录成功')
    } else {
      await authStore.signUp(form.email, form.password)
      ElMessage.success('注册成功，请检查邮箱验证')
    }
    
    emit('success')
    handleClose()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-form {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.auth-switch {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  
  .el-link {
    margin-left: 4px;
  }
}
</style>