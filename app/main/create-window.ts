import { join, dirname } from "node:path"
import { BrowserWindow } from "electron"
import { bindWindowEvent } from "./mixins/window-event"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = join(__dirname, "..")

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]
export const MAIN_DIST = join(process.env.APP_ROOT, "dist-electron")
export const RENDERER_DIST = join(process.env.APP_ROOT, "dist")

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? join(process.env.APP_ROOT, "public")
  : RENDERER_DIST

const url = process.env.VITE_DEV_SERVER_URL
const preload = join(__dirname, "../preload/index.mjs")

export function createIndexWindow() {
  const page = "index.html"
  const win = new BrowserWindow({
    title: "ELectron Index windows",
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // isPackaged 可能无法在生产环境中使用
  // electron-vite-vue#298
  if (url) {
    win.loadURL(url + page)
    win.webContents.openDevTools({ mode: "detach" })
  } else {
    win.loadFile(join(process.env.DIST!, page))
  }

  // 窗口创建时临时置顶
  win.on("ready-to-show", () => {
    win.show()
    win.removeMenu()
    win.restore()
    win.focus()
  })

  // 绑定窗口信息传递(IPC)事件
  bindWindowEvent(win)

  // 禁止窗口打开新窗口
  win.webContents.setWindowOpenHandler(() => {
    return { action: "deny" }
  })

  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(1)
    win.webContents.setVisualZoomLevelLimits(1, 1)
  })

  return win
}

export function createSecordWindow() {
  const page = "secord.html"
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
  })

  // isPackaged 可能无法在生产环境中使用
  // electron-vite-vue#298
  if (url) {
    win.loadURL(url + page)
    win.webContents.openDevTools({ mode: "detach" })
  } else {
    win.loadFile(join(process.env.DIST!, page))
  }

  // 窗口创建时临时置顶
  win.on("ready-to-show", () => {
    win.show()
    win.removeMenu()
    win.restore()
    win.focus()
  })

  // 绑定窗口信息传递(IPC)事件
  bindWindowEvent(win)

  // 禁止窗口打开新窗口
  win.webContents.setWindowOpenHandler(() => {
    return { action: "deny" }
  })

  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(1)
    win.webContents.setVisualZoomLevelLimits(1, 1)
  })

  return win
}
