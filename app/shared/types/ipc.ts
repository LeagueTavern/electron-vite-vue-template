import type { OpenDialogReturnValue, OpenDialogOptions } from "electron"

// 主进程 => 渲染进程
// 此处为渲染进程接收到来自主进程的数据
export interface IPCMainRequest {
  "event:window": {
    type: "minimize" | "maximize" | "unmaximize" | "blur" | "focus"
  }
  "event:test": {
    ptest: "1"
  }
}

// 渲染进程 => 主进程
// 此处为主进程接收到来自渲染进程的数据
export interface IPCRendererRequest {
  "event:window": {
    type: "minimize" | "maximize" | "unmaximize" | "close" | "focus"
  }
  "event:test": {
    ptest: "1"
  }
}

export interface IPCRendererInvoke {
  "event:open-file": {
    args: OpenDialogOptions
    response: OpenDialogReturnValue
  }
}

// 以下无需修改

export interface IPCRendererInvokeReject {
  type: "error"
  err: Error
}
export interface IPCRendererInvokeResolve<T extends keyof IPCRendererInvoke> {
  type: "response"
  response: IPCRendererInvoke[T]["response"]
}
