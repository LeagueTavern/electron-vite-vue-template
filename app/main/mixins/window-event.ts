import { BrowserWindow } from "electron";
import { WebContentIPC } from "./webcontent-ipc";

export function bindWindowEvent(win: BrowserWindow) {
  const ipc = new WebContentIPC(win);

  ipc.on("event:window", ({ type }) => {
    win[type]();
  });

  win.on("minimize", () => ipc.send("event:window", { type: "minimize" }));
  win.on("maximize", () => ipc.send("event:window", { type: "maximize" }));
  win.on("unmaximize", () => ipc.send("event:window", { type: "unmaximize" }));
  win.on("focus", () => ipc.send("event:window", { type: "focus" }));
  win.on("blur", () => ipc.send("event:window", { type: "blur" }));
}
