<script setup lang="ts">
import { IPCClient } from "@shared/utils/ipc-client";
import { ref } from "vue";
const ipc = new IPCClient();
const path = ref("");

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
  <p>Secord Window</p>
  <button @click="maximize">Maximize</button>
  <button @click="unmaximize">Unmaximize</button>
  <p>{{ path }}</p>
</template>

<style lang="scss"></style>
