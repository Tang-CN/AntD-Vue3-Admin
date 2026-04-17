<script setup lang="ts">
</script>

<template>
  <div class="p-6 bg-white rounded-md h-full">
    <h2 class="text-2xl font-bold mb-6">控制台</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <a-card class="shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">今日访问</p>
            <p class="text-2xl font-bold mt-2 text-blue-500">1,234</p>
          </div>
          <div class="text-4xl text-blue-500">👥</div>
        </div>
      </a-card>
      
      <a-card class="shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">新增用户</p>
            <p class="text-2xl font-bold mt-2 text-green-500">86</p>
          </div>
          <div class="text-4xl text-green-500">➕</div>
        </div>
      </a-card>
      
      <a-card class="shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">系统消息</p>
            <p class="text-2xl font-bold mt-2 text-orange-500">12</p>
          </div>
          <div class="text-4xl text-orange-500">📧</div>
        </div>
      </a-card>
    </div>

    <a-card class="shadow-sm">
      <template #title>系统信息</template>
      <ul class="space-y-2 text-gray-600">
        <li>✅ Vue 3 Composition API</li>
        <li>✅ TypeScript 类型支持</li>
        <li>✅ Ant Design Vue UI组件库</li>
        <li>✅ TailwindCSS 原子样式</li>
        <li>✅ Vue Router 路由系统</li>
        <li>✅ Pinia 状态管理</li>
        <li>✅ Axios 请求封装</li>
        <li>✅ SCSS 预处理器</li>
        <li>✅ TSX 语法支持</li>
      </ul>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
</style>