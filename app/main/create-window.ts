import { join } from "node:path";
import { BrowserWindow } from "electron";
import { bindWindowEvent } from "./mixins/window-event";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../target/renderer");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

const url = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export function createIndexWindow() {
  const page = "index.html";
  const win = new BrowserWindow({
    title: "ELectron Index windows",
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
    win.loadURL(url + page);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(process.env.DIST!, page));
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

export function createSecordWindow() {
  const page = "secord.html";
  const win = new BrowserWindow({
    title: "ELectron Secord windows",
    width: 500,
    height: 300,
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
    win.loadURL(url + page);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(process.env.DIST!, page));
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
