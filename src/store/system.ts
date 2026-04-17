import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 系统状态模块
 * 包含主题、布局、菜单等系统配置
 */
export const useSystemStore = defineStore(
  "system",
  () => {
    // 侧边栏折叠状态
    const collapsed = ref<boolean>(false);
    // 主题模式 light | dark
    const theme = ref<string>("light");
    // 全局loading状态
    const loading = ref<boolean>(false);
    // 全局刷新key
    const refreshkey=ref<number>(0)
    // 全屏状态
    const fullscreen = ref<boolean>(false);
    /**
     * 开始loading 计数+1
     */
    const startLoading = () => {
      loading.value = true;
    };

    /**
     * 强制关闭loading
     */
    const closeLoading = () => {
      loading.value = false;
    };

    /**
     * 切换侧边栏
     */
    const setCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    /**
     * 设置主题
     */
    const setTheme = (newTheme: string) => {
      theme.value = newTheme;
    };

    

    const setRefreshKey = () => {
      refreshkey.value = refreshkey.value + 1;
    }

    const setFullscreen=(key:boolean)=>{
      fullscreen.value=key
    }

    return {
      loading,
      collapsed,
      fullscreen,
      refreshkey,
      setCollapsed,
      setTheme,
      startLoading,
      closeLoading,
      setRefreshKey,
      setFullscreen
    };
  },
  {
    // 持久化配置
    persist: {
      key: "system",
      storage: localStorage
    }
  }
);
