/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 03:59:55
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 19:56:37
 * @FilePath: \electron-vite-vue\app\shared\types\ipc.ts
 * @Description:
 */

// 主进程 => 渲染进程
// 此处为渲染进程接收到来自主进程的数据
export interface IPCMainRequest {
  "event:window": {
    type: "minimize" | "maximize" | "unmaximize" | "blur" | "focus";
  };
}

// 渲染进程 => 主进程
// 此处为主进程接收到来自渲染进程的数据
export interface IPCRendererRequest {
  "event:window": {
    type: "minimize" | "maximize" | "unmaximize" | "close" | "focus";
  };
}
