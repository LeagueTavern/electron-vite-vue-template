/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 19:45:49
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 20:04:19
 * @FilePath: \electron-vite-vue\app\main\mixins\window-event.ts
 * @Description:
 */
import { BrowserWindow } from "electron";
import { WebContentIPC } from "./webcontent-ipc";

export function bindWindowEvent(win: BrowserWindow) {
  const ipc = new WebContentIPC(win);

  ipc.on("event:window", ({ type }) => {
    win[type]();
  });

  win.on("minimize", () => ipc.send("event:window", { type: "minimize" }));
  win.on("maximize", () => ipc.send("event:window", { type: "maximize" }));
  win.on("unmaximize", () => ipc.send("event:window", { type: "unmaximize" }));
  win.on("focus", () => ipc.send("event:window", { type: "focus" }));
  win.on("blur", () => ipc.send("event:window", { type: "blur" }));
}
