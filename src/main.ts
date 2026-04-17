import { createApp } from "vue";
import Antd from "ant-design-vue";
import router from "./router";
import pinia from "./store";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import "./styles/index.scss";

const app = createApp(App);

app.use(Antd);
app.use(pinia);
app.use(router);

app.mount("#app");
