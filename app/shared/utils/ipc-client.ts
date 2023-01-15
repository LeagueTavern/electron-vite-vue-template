/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 18:49:10
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 18:53:56
 * @FilePath: \electron-vite-vue\app\shared\utils\ipc-client.ts
 * @Description:
 */
import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";
import type { IPCMainRequest, IPCRendererRequest } from "@shared/types";

export class IPCClient {
  constructor() {}

  on<T extends keyof IPCMainRequest>(
    key: T,
    callback: (event: IpcRendererEvent, args: IPCMainRequest[T]) => void
  ) {
    // 由于IPC发送的数据为any类型，所以还要在原来的基础上进行类型约束
    // 这个部分只接收主进程的数据
    // IPCRendererRequest
    ipcRenderer.on(key, callback);
  }

  send<T extends keyof IPCRendererRequest>(
    key: T,
    data: IPCRendererRequest[T]
  ) {
    ipcRenderer.send(key, data);
  }
}
