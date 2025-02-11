import { AppLoader } from '@shared/renderer/modules/loader'
import { IPCRenderer } from '@shared/renderer/modules/ipc'
import { createModuleManager } from '@shared/renderer/use-module'
import type { ModuleConstructor } from '@shared/module/types'

const module = createModuleManager()
const modules: Record<string, ModuleConstructor> = {
  AppLoader,
  IPCRenderer
}

for (const [identifier, mod] of Object.entries(modules)) {
  module.register(identifier, mod)
}

export { module }
