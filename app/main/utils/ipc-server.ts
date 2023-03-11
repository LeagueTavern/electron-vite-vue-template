/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 04:09:22
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-03-11 15:45:56
 * @FilePath: /electron-vite-vue-template/app/main/utils/ipc-server.ts
 * @Description:
 */
import { ipcMain } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import type {
  IPCRendererRequest,
  IPCRendererInvoke,
  IPCMainRequest,
  IPCRendererInvokeReject,
  IPCRendererInvokeResolve,
  WindowEnumType,
} from "@shared/types";
import type { WindowContainer } from "../types";

export class IPCServer {
  private windows: WindowContainer;

  constructor(windows: WindowContainer) {
    this.windows = windows;
  }

  on<T extends keyof IPCRendererRequest>(
    key: T,
    callback: (event: IpcMainInvokeEvent, args: IPCRendererRequest[T]) => void
  ) {
    // 由于IPC发送的数据为any类型，所以还要在原来的基础上进行类型约束
    // 这个部分只接收渲染进程的数据
    // IPCRendererRequest
    ipcMain.on(key, callback);
  }

  send<T extends keyof IPCMainRequest>(
    key: T,
    data: IPCMainRequest[T],
    receiverWindow?: WindowEnumType
  ) {
    // 此方法是用于替代ipcMain.send
    // 同样要对发送的数据进行约束
    if (receiverWindow) {
      // 发送给指定的窗口
      const instance = this.windows.get(receiverWindow);
      if (instance) {
        instance.window.webContents.send(key, data);
      }
    } else {
      // 发送给所有窗口
      this.windows.forEach((instance) =>
        instance.window.webContents.send(key, data)
      );
    }
  }

  handle<T extends keyof IPCRendererInvoke>(
    key: T,
    handler: (
      event: IpcMainInvokeEvent,
      args: IPCRendererInvoke[T]["args"],
      resolve: (
        response: IPCRendererInvoke[T]["response"]
      ) => IPCRendererInvokeResolve<T>,
      reject: (err: Error) => IPCRendererInvokeReject
    ) =>
      | Promise<IPCRendererInvokeReject | IPCRendererInvokeResolve<T>>
      | IPCRendererInvokeReject
      | IPCRendererInvokeResolve<T>
  ) {
    const reject = (err: Error): IPCRendererInvokeReject => ({
      type: "error",
      err,
    });
    const resolve = (
      response: IPCRendererInvoke[T]["response"]
    ): IPCRendererInvokeResolve<T> => ({
      type: "response",
      response,
    });

    ipcMain.handle(key, (event, args) =>
      handler.call(this, event, args, resolve, reject)
    );
  }
}
