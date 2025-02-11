import { Module } from '@shared/module'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import type { ServerType } from '@hono/node-server'
import type { Server } from 'http'

export class HttpServer extends Module {
  private app = new Hono()
  private server: ServerType | null = null
  private serve = serve

  static SERVER_PORT = 49005
  static SERVER_HOSTNAME = '0.0.0.0'

  onInit(): void {
    this.bindEvents()
    this.server = this.serve({
      fetch: this.app.fetch,
      hostname: HttpServer.SERVER_HOSTNAME,
      port: HttpServer.SERVER_PORT
    })
  }

  onDestroy(): void {
    this.server?.close()
  }

  private bindEvents(): void {
    this.app.get('/', (ctx) => {
      return ctx.json({
        message: 'Hello, World!'
      })
    })
  }

  get instance(): Hono {
    return this.app
  }

  get serverInstance(): Server {
    return this.server! as Server
  }
}
