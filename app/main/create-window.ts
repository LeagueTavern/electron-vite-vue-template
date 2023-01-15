/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 00:46:47
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 20:42:07
 * @FilePath: \electron-vite-vue\app\main\create-window.ts
 * @Description:
 */
import { join } from "node:path";
import { BrowserWindow } from "electron";
import { bindWindowEvent } from "./mixins/window-event";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../target/renderer");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const preload = join(__dirname, "../preload/index.js");

export function createMainWindow() {
  const win = new BrowserWindow({
    title: "ELectron demo",
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // isPackaged 可能无法在生产环境中使用
  // electron-vite-vue#298
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(indexHtml);
  }

  // 窗口创建时临时置顶
  win.on("ready-to-show", () => {
    win.show();
    win.removeMenu();
    win.restore();
    win.focus();
  });

  // 绑定窗口信息传递(IPC)事件
  bindWindowEvent(win);

  // 禁止窗口打开新窗口
  win.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(1);
    win.webContents.setVisualZoomLevelLimits(1, 1);
  });

  return win;
}
