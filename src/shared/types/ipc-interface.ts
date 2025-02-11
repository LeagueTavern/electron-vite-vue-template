// 主进程事件
// on("ping", (arg1: string) => {})
export type IpcListenerEvents = {
  ping: [string]
}

// 渲染进程invoke
// invoke("aaa", "bbb").then((result:number) => {})
export type IpcInvokeEvents = {
  aaa: (bbb: string) => number
}

// 渲染进程事件
// send("bbb", 123)
export type IpcRendererEvent = {
  bbb: [number]
}

export type IpcEvents = IpcListenerEvents | IpcInvokeEvents
