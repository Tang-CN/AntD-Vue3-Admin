import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 创建pinia实例
const pinia = createPinia();
// 注册持久化插件
pinia.use(piniaPluginPersistedstate);

export default pinia;

export * from "./system";
export * from "./user";
