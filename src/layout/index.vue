<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import { useSystemStore, useUserStore } from '@/store'
const systemStore = useSystemStore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { setCollapsed, setFullscreen } = systemStore
const menuList = [
  {
    key: '/dashboard',
    title: '首页',
    icon: HomeOutlined
  },
  {
    key: '/system',
    title: '系统管理',
    icon: SettingOutlined,
    children: [
      { key: '/system/user', title: '用户管理' },
      { key: '/system/role', title: '角色管理' }
    ]
  }
]

const selectedKeys = computed(() => [route.path])
const openKeys = computed(() => {
  const path = route.path
  const paths = path.split('/').filter(Boolean)
  if (paths.length <= 1) return []
  return paths.slice(0, -1).map((_, i) => '/' + paths.slice(0, i + 1).join('/'))
})

const handleMenuClick = ({ key }: { key: string }) => {
  if (route.path !== key) {
    router.push(key)
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    setFullscreen(true)
  } else {
    document.exitFullscreen()
    setFullscreen(false)
  }
}

const refreshPage = () => {
  systemStore.setRefreshKey()
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  setFullscreen(!!document.fullscreenElement)
})
</script>

<template>
  <a-layout class="admin-layout h-full w-full overflow-hidden">
    <!-- 左侧侧边栏 -->
    <a-layout-sider
      v-model:collapsed="systemStore.collapsed"
      theme="dark"
      width="240"
      collapsible
      :trigger="null"
      class="sider-container"
    >
      <!-- Logo区域 -->
      <div class="layout-logo h-14 flex items-center justify-center transition-all duration-300">
        <img src="/favicon.svg" alt="logo" class="w-8 h-8" />
        <span
          v-if="!systemStore.collapsed"
          class="ml-3 text-white text-lg font-bold tracking-wider"
        >
          AntD Admin
        </span>
      </div>

      <!-- 菜单导航 -->
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        @click="handleMenuClick"
        class="sider-menu border-none"
      >
        <template v-for="item in menuList" :key="item.key">
          <!-- 子菜单 -->
          <a-sub-menu v-if="item.children && item.children.length" :key="item.key">
            <template #title>
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <a-menu-item v-for="child in item.children" :key="child.key">
              {{ child.title }}
            </a-menu-item>
          </a-sub-menu>
          <template v-else>
            <!-- 一级菜单 -->
            <a-menu-item :key="item.key">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧主体区域 -->
    <a-layout class="main-container">
      <!-- 顶部导航栏 -->
      <a-layout-header
        class="layout-header bg-white flex items-center justify-between px-5 shadow-sm"
      >
        <!-- 左侧折叠按钮 -->
        <div class="header-left flex items-center">
          <div
            class="collapse-btn flex items-center justify-center w-9 h-9 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            @click="setCollapsed"
          >
            <menu-unfold-outlined v-if="systemStore.collapsed" class="text-lg text-gray-600" />
            <menu-fold-outlined v-else class="text-lg text-gray-600" />
          </div>

          <!-- 面包屑 -->
          <a-breadcrumb class="ml-4">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>{{ route.meta.title }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <!-- 右侧操作栏 -->
        <div class="header-right flex items-center gap-5">
          <div
            class="flex items-center justify-center w-9 h-9 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            @click="refreshPage"
            title="刷新"
          >
            <ReloadOutlined class="text-base text-gray-600" />
          </div>

          <div
            class="flex items-center justify-center w-9 h-9 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            @click="toggleFullscreen"
            title="全屏"
          >
            <fullscreen-outlined v-if="!systemStore.fullscreen" class="text-base text-gray-600" />
            <fullscreen-exit-outlined v-else class="text-base text-gray-600" />
          </div>

          <!-- 用户信息 -->
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <div
              class="flex items-center gap-3 cursor-pointer h-9 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <a-avatar size="small">
                <UserOutlined class="text-base text-gray-600"></UserOutlined>
              </a-avatar>
              <div class="flex text-gray-700">{{ userStore.userInfo?.username || '管理员' }}</div>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined class="mr-2" />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 页面内容区域 -->
      <a-layout-content class="layout-content p-4 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="scss">
.admin-layout {
  .sider-container {
    position: relative;
    z-index: 100;
    height: 100vh;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);

    .layout-logo {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin: 0 16px;

      img {
        filter: brightness(0) invert(1);
      }
    }

    .sider-menu {
      height: calc(100vh - 56px);
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
      }
    }
  }

  .main-container {
    height: 100vh;
    overflow: hidden;

    .layout-header {
      height: 56px !important;
      line-height: 56px;
      padding: 0 20px !important;
      position: sticky;
      top: 0;
      z-index: 99;

      .header-left {
        .collapse-btn {
          font-size: 18px;
        }
      }
    }

    .layout-content {
      height: calc(100vh - 56px);
      background-color: #f0f2f5;
    }
  }
}

// 页面过渡动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease-out;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
