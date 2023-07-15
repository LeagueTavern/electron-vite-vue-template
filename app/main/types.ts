import { BrowserWindow } from "electron";
import type { WindowEnumType } from "@shared/types";

export type WindowContainer = Map<
  WindowEnumType,
  {
    id: number;
    window: BrowserWindow;
  }
>;
