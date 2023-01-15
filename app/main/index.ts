/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-14 17:09:02
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 20:47:47
 * @FilePath: \electron-vite-vue\app\main\index.ts
 * @Description:
 */
import { app } from "electron";
import { createMainWindow } from "./create-window";
import { IPCServer } from "./utils/ipc-server";
import { WindowsManager } from "./windows-manager";

// 窗口名称已由窗口名称类型进行约束
// 如果要添加窗口名称，请前往 app/shared/types/window.ts 添加
const windows = new WindowsManager();
const ipc = new IPCServer(windows.getMap());

// IPC demo
ipc.on("event:window", (event, { type }) => {
  console.log(
    `From renderer process "${windows.getKey(event.sender.id)}":`,
    type
  );
});

function createWindow() {
  windows.createWindow("main", createMainWindow());
}

// 高版本Windows任务栏中正确显示图标
if (process.platform === "win32") {
  app.setAppUserModelId(app.getName());
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.on("second-instance", () => {
  const instance = windows.getInstance("main");

  if (instance) {
    if (instance.window.isMinimized()) instance.window.restore();
    instance.window.focus();
  }
});

app.on("window-all-closed", () => {
  windows.clear();
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(createWindow);
app.on("activate", () => {
  const instance = windows.getInstance("main");
  if (instance) {
    instance.window.show();
    instance.window.focus();
  } else {
    createWindow();
  }
});
