import { IpcListener, IpcEmitter } from '@electron-toolkit/typed-ipc/main'
import { Module } from '@shared/module'

import type { IpcEvents, IpcRendererEvent } from '@shared/types/ipc-interface'

export class IPCModule extends Module {
  public readonly listener = new IpcListener<IpcEvents>()
  public readonly emitter = new IpcEmitter<IpcRendererEvent>()
}
