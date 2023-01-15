import { BrowserWindow } from "electron";
import type { WindowContainer } from "./types";
import type { WindowEnumType } from "@shared/types";

export class WindowsManager {
  private windows: WindowContainer = new Map();

  createWindow(key: WindowEnumType, window: BrowserWindow) {
    this.windows.set(key, { window, id: window.webContents.id });
  }

  getMap() {
    return this.windows;
  }

  getInstance(key: WindowEnumType) {
    return this.windows.get(key);
  }

  getKey(id: number): WindowEnumType | null {
    return (
      Array.from(this.windows).find(
        ([key, { id: windowId }]) => windowId === id
      )?.[0] || null
    );
  }

  clear() {
    this.windows.clear();
  }
}
