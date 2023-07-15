import { BrowserWindow } from "electron";
import type { IPCRendererRequest, IPCMainRequest } from "@shared/types";

type IPCRendererRequestMap<
  T = IPCRendererRequest,
  Keys = keyof IPCRendererRequest
> = Keys extends infer K extends keyof T
  ? { callback: (args: T[K]) => void; key: Keys }
  : never;

// 对于IPCServer来说,该IPC类只负责指定窗口
export class WebContentIPC {
  private win: BrowserWindow;
  private fn = new Set<IPCRendererRequestMap>();

  constructor(win: BrowserWindow) {
    this.win = win;
    this.win.webContents.on("ipc-message", (_, channelKey, args) =>
      this.fn.forEach(({ key, callback }) => {
        if (channelKey === key) callback.call(undefined, args);
      })
    );
  }

  on<T extends keyof IPCRendererRequest>(
    key: T,
    callback: (args: IPCRendererRequest[T]) => void
  ) {
    this.fn.add({
      key,
      callback,
    });
  }

  send<T extends keyof IPCMainRequest>(key: T, data: IPCMainRequest[T]) {
    // IPCMainRequest
    this.win.webContents.send(key, data);
  }
}
