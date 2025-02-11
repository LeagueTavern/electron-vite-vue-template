import { App, getCurrentInstance } from 'vue'
import { Module, ModuleManager } from '@shared/module'
import { type ModuleConstructor } from '@shared/module/types'

export function createModuleManager() {
  const moduleManager = new ModuleManager()

  return {
    install(app: App) {
      app.config.globalProperties.$moduleManager = moduleManager
    },
    resolve<T extends Module>(identifier: string): T {
      return moduleManager.resolve<T>(identifier)
    },
    register(identifier: string, module: ModuleConstructor) {
      moduleManager.register(identifier, module)
    },
    setup() {
      moduleManager.setup()
    }
  }
}

export function useModule<T extends Module>(identifier: string) {
  const ctx = getCurrentInstance()!
  const properties = ctx.appContext.config.globalProperties
  const manager = properties.$moduleManager as ModuleManager

  if (!manager) {
    throw new Error('Module manager not found')
  }

  const currentModule = manager.resolve<T>(identifier)
  return currentModule
}
