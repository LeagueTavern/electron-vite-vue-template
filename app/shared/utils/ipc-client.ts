import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";
import type {
  IPCMainRequest,
  IPCRendererRequest,
  IPCRendererInvoke,
  IPCRendererInvokeReject,
  IPCRendererInvokeResolve,
} from "@shared/types";

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

  invoke<T extends keyof IPCRendererInvoke>(
    key: T,
    args: IPCRendererInvoke[T]["args"]
  ) {
    // invoke
    return new Promise<IPCRendererInvoke[T]["response"]>((resolve, reject) => {
      ipcRenderer
        .invoke(key, args)
        .then((result: IPCRendererInvokeReject | IPCRendererInvokeResolve<T>) =>
          result.type === "response"
            ? resolve(result.response)
            : reject(result.err)
        );
    });
  }
}
