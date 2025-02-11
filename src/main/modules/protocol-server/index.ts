import { session } from 'electron'
import { protocol } from 'electron'
import { Module } from '@shared/module'
import { MainWindow } from '../main-window'
import { parsePathParams } from '@main/utils/path'
import type { TypeProtocolEventInstance, TypeProtocolHandler } from './types'

export class ProtocolServer extends Module {
  static PROXY_PROTOCOL_NAME = 'danmacat'

  private readonly proxys = new Map<symbol, TypeProtocolEventInstance<string>>()

  onInit(): void {
    this.createProtocolHandler(session.fromPartition(MainWindow.MAINWINDOW_PARTITION))
  }

  onDestroy(): void {
    this.destroyProtocolHandler(session.fromPartition(MainWindow.MAINWINDOW_PARTITION))
  }

  register<T extends string = never>(
    hostname: string,
    path: string,
    handler: TypeProtocolHandler<T>
  ) {
    const symbol = Symbol()
    this.proxys.set(symbol, {
      hostname,
      path,
      handler
    })

    return symbol
  }

  unregister(symbol: symbol) {
    this.proxys.delete(symbol)
  }

  private createProtocolHandler(instance: Electron.Session) {
    instance.protocol.handle(ProtocolServer.PROXY_PROTOCOL_NAME, (request) => {
      const url = new URL(request.url)
      const hostname = url.hostname
      const path = url.pathname

      const interceptor = [...this.proxys.values()].find((proxy) => {
        return proxy.hostname === hostname && parsePathParams(proxy.path, path) !== null
      })

      if (!interceptor) {
        return new Response('404 Not Found', {
          status: 404,
          statusText: 'Not Found'
        })
      }

      const params = parsePathParams(interceptor.path, path)!
      return interceptor.handler(request, params)
    })
  }

  private destroyProtocolHandler(instance: Electron.Session) {
    instance.protocol.unhandle(ProtocolServer.PROXY_PROTOCOL_NAME)
  }

  static registerProtocol() {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: ProtocolServer.PROXY_PROTOCOL_NAME,
        privileges: {
          secure: true,
          standard: true,
          corsEnabled: true,
          supportFetchAPI: true
        }
      }
    ])
  }
}
