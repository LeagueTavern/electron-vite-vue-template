<!--
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-14 17:09:02
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 20:38:15
 * @FilePath: \electron-vite-vue\app\renderer\src\App.vue
 * @Description: 
-->
<script setup lang="ts">
import { IPCClient } from "@shared/utils/ipc-client";
const ipc = new IPCClient();

ipc.on("event:window", (event, { type }) => {
  console.log("From main process:", type);
});

const maximize = () => {
  ipc.send("event:window", { type: "maximize" });
};

const unmaximize = () => {
  ipc.send("event:window", { type: "unmaximize" });
};
</script>

<template>
  <button @click="maximize">Maximize</button>
  <button @click="unmaximize">Unmaximize</button>
</template>

<style lang="scss"></style>
