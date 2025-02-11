import { app } from 'electron'
import { ModuleManager } from '@shared/module'
import { APP_MODULES } from './constants'
import { ProtocolServer } from './modules/protocol-server'

const moduleManager = new ModuleManager()

function init() {
  ProtocolServer.registerProtocol()

  for (const [identifier, module] of Object.entries(APP_MODULES)) {
    moduleManager.register(identifier, module)
  }

  app.whenReady().then(() => {
    moduleManager.setup()
  })
}

init()
