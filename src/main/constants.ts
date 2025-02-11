import path from 'node:path'
import process from 'node:process'
import { ElectronModule } from './modules/electron'
import { MainWindow } from './modules/main-window'
import { IPCModule } from './modules/ipc'
import { HttpServer } from './modules/http-server'
import { SocketServer } from './modules/socket-server'
import { ProtocolServer } from './modules/protocol-server'
import { FolderWatcher } from './modules/folder-watcher'
import { CachePool } from './modules/cache-pool'
import type { ModuleConstructor } from '@shared/module/types'

export const PLUGIN_DIR = path.join(process.cwd(), 'plugins')
export const PLUGIN_EXTENSION = '.dcext'

export const APP_ID = 'com.mitay.danmacat'
export const APP_MODULES: Record<string, ModuleConstructor> = {
  ElectronModule,
  IPCModule,
  MainWindow,
  FolderWatcher,
  CachePool,
  HttpServer,
  SocketServer,
  ProtocolServer
}
