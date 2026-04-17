<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import {Login} from "@/services"

const formState = ref({
  username: 'admin',
  password: '123456'
})

const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()
const { setToken,setRefreshToken,setUserInfo} = userStore

const handleLogin = async () => {
  loading.value = true
  const res=await Login(formState.value)
  setToken(res.data.accessToken)
  setRefreshToken(res.data.refreshToken)
  setUserInfo(res.data.user)
  setTimeout(() => {
    loading.value = false
    router.push('/dashboard')
  }, 500)
}
</script>

<template>
  <div class="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <a-card class="w-96 shadow-xl rounded-lg">
      <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">AntD Vue3 Admin</h1>
      
      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleLogin"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" size="large" placeholder="请输入用户名" />
        </a-form-item>
        
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password" size="large" placeholder="请输入密码" />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" html-type="submit" block size="large" :loading="loading">
            登 录
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="text-center text-gray-500 text-sm mt-4">
        演示账号: admin / 123456
      </div>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
</style>