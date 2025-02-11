import Nanobus from 'nanobus'
import { Logger, type LoggerType } from '@shared/logger'

export type ExtractBusEvents<T> = T extends Nanobus<infer U> ? U : never
export type BusInstance = InstanceType<typeof Nanobus>

export abstract class Module<
  T extends ExtractBusEvents<BusInstance> = ExtractBusEvents<BusInstance>
> extends Nanobus<T> {
  private _isInitialized = false
  private _moduleId: string

  constructor(moduleId: string) {
    super(`bus:${moduleId}`)
    this._moduleId = moduleId
  }

  onInit?(): void
  onDestroy?(): void

  init() {
    if (this._isInitialized) {
      throw new Error(`${this.constructor.name} is already initialized`)
    }
    this._isInitialized = true
    this.onInit && this.onInit()
  }

  destroy() {
    this.onDestroy && this.onDestroy()
    this.removeAllListeners()
  }

  log(type: LoggerType, ...args: string[]) {
    Logger.log(type, `<${this._moduleId}>`, ...args)
  }
}
