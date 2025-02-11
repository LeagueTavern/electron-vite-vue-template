import { IpcListener, IpcEmitter } from '@electron-toolkit/typed-ipc/renderer'
import { Module } from '@shared/module'

import type { IpcEvents, IpcRendererEvent } from '@shared/types/ipc-interface'

export class IPCRenderer extends Module {
  public readonly listener = new IpcListener<IpcRendererEvent>()
  public readonly emitter = new IpcEmitter<IpcEvents>()
}
