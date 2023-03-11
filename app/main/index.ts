/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-03-11 20:54:17
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-03-11 22:05:09
 * @FilePath: \electron-vite-vue-template\app\main\index.ts
 * @Description:
 */
import { app, dialog } from "electron";
import { createMainWindow } from "./create-window";
import { IPCServer } from "./utils/ipc-server";
import { WindowsManager } from "./utils/windows-manager";

// 窗口名称已由窗口名称类型进行约束
// 如果要添加窗口名称，请前往 app/shared/types/window.ts 添加
const windowsManager = new WindowsManager();
const ipcMain = new IPCServer(windowsManager.getMap());

// ========================================================
// 窗口事件（渲染进程手动触发）
ipcMain.on("event:window", (event, { type }) => {
  console.log(
    `From renderer process "${windowsManager.getKey(event.sender.id)}":`,
    type
  );
});

// 打开文件
ipcMain.handle("event:open-file", async (ev, args, resolve) => {
  return resolve(await dialog.showOpenDialog(args));
});
// ========================================================

function createWindow() {
  windowsManager.createWindow("main", createMainWindow());
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
  const instance = windowsManager.getInstance("main");

  if (instance) {
    if (instance.window.isMinimized()) instance.window.restore();
    instance.window.focus();
  }
});

app.on("window-all-closed", () => {
  windowsManager.clear();
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(createWindow);
app.on("activate", () => {
  const instance = windowsManager.getInstance("main");
  if (instance) {
    instance.window.show();
    instance.window.focus();
  } else {
    createWindow();
  }
});
