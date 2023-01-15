/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-01-15 04:14:40
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-01-15 20:32:19
 * @FilePath: \electron-vite-vue\app\main\types.ts
 * @Description: 
 */
import { BrowserWindow } from "electron";
import type { WindowEnumType } from "@shared/types";

export type WindowContainer = Map<
  WindowEnumType,
  {
    id: number;
    window: BrowserWindow;
  }
>;
