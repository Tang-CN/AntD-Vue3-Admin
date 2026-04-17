import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 用户状态模块
 * 包含用户信息、token、登录状态等
 */
export const useUserStore = defineStore(
  "user",
  () => {
    // 用户token
    const token = ref<string>("");

    // 刷新token
    const refreshToken = ref<string>("");
    // 用户信息
    const userInfo = ref<Record<string, any>>({});
    // 登录状态
    const isLoggedIn = ref<boolean>(false);

    /**
     * 设置token
     */
    const setToken = (newToken: string) => {
      token.value = newToken;
      isLoggedIn.value = !!newToken;
    };

    /**
     * 设置用户信息
     */
    const setUserInfo = (info: Record<string, any>) => {
      userInfo.value = info;
    };

    const setRefreshToken = (newToken: string) => {
      refreshToken.value = newToken;
    }

    /**
     * 退出登录 清空数据
     */
    const logout = () => {
      token.value = "";
      userInfo.value = {};
      isLoggedIn.value = false;
      refreshToken.value = "";
    };

    return {
      token,
      userInfo,
      isLoggedIn,
      setToken,
      setRefreshToken,
      setUserInfo,
      logout
    };
  },
  {
    // 持久化配置
    persist: {
      key: "user",
      storage: localStorage
    }
  }
);
