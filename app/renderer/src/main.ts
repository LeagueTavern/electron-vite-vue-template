/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-14 17:09:02
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 19:43:45
 * @FilePath: \electron-vite-vue\app\renderer\src\main.ts
 * @Description: 
 */
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
